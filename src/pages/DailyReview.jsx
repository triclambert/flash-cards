import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from 'lucide-react';
import { getDecks, saveDeck } from '../utils/storage';

function createSrs() {
  return {
    intervalDays: 0,
    ease: 2.5,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    lastReviewed: null,
  };
}

function normalizeCard(card) {
  return {
    ...card,
    tags: Array.isArray(card.tags) ? card.tags : [],
    imageUrl: card.imageUrl || '',
    srs: card.srs || createSrs(),
  };
}

function updateSrs(card, isCorrect) {
  const srs = card.srs || createSrs();
  let { repetitions, intervalDays, ease } = srs;
  if (isCorrect) {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.max(1, Math.round(intervalDays * ease));
    ease = Math.min(3.0, ease + 0.1);
  } else {
    repetitions = 0;
    intervalDays = 1;
    ease = Math.max(1.3, ease - 0.2);
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + intervalDays);
  return {
    ...card,
    srs: {
      repetitions,
      intervalDays,
      ease,
      dueDate: dueDate.toISOString(),
      lastReviewed: new Date().toISOString(),
    },
  };
}

function isDue(card) {
  if (!card.srs?.dueDate) return true;
  return new Date(card.srs.dueDate) <= new Date();
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DailyReview() {
  const navigate = useNavigate();
  const decks = getDecks();

  const dueCards = useMemo(() => {
    return decks.flatMap((deck) =>
      (deck.cards || [])
        .map(normalizeCard)
        .filter(isDue)
        .map((card) => ({
          ...card,
          deckId: deck.id,
          deckName: deck.name,
        }))
    );
  }, [decks]);

  const [cards, setCards] = useState(dueCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());

  const card = cards[currentIndex];

  const handleShuffle = useCallback(() => {
    setCards(shuffleArray(dueCards));
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  }, [dueCards]);

  function persistCard(updatedCard) {
    const deck = decks.find((d) => d.id === updatedCard.deckId);
    if (!deck) return;
    const nextCards = (deck.cards || []).map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    saveDeck({ ...deck, cards: nextCards });
  }

  function reviewCard(isCorrect) {
    if (!card) return;
    const updated = updateSrs(card, isCorrect);
    persistCard(updated);
    setCards((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...updated, deckId: c.deckId } : c))
    );
  }

  function markKnown() {
    setKnown((prev) => new Set(prev).add(card.id));
    setUnknown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
    reviewCard(true);
    goNext();
  }

  function markUnknown() {
    setUnknown((prev) => new Set(prev).add(card.id));
    setKnown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
    reviewCard(false);
    goNext();
  }

  function goNext() {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function goPrev() {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function reset() {
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  }

  if (cards.length === 0) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="empty-state">
          <p>No cards are due today.</p>
        </div>
      </div>
    );
  }

  const allReviewed = known.size + unknown.size === cards.length;

  return (
    <div className="page study-page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Daily Review</h2>
      </div>

      <div className="study-progress">
        <span className="progress-text">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
        <div className="score-badges">
          <span className="badge badge-success">Know: {known.size}</span>
          <span className="badge badge-danger">Review: {unknown.size}</span>
        </div>
      </div>

      {allReviewed ? (
        <div className="study-complete">
          <h3>Daily Review Complete!</h3>
          <p>
            You knew {known.size} of {cards.length} cards (
            {Math.round((known.size / cards.length) * 100)}%)
          </p>
          <div className="study-complete-actions">
            <button className="btn btn-primary" onClick={reset}>
              <RotateCcw size={18} /> Review Again
            </button>
            <button className="btn" onClick={() => navigate('/decks')}>
              Back to Decks
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <span className="flashcard-label">Front</span>
                <p>{card.front}</p>
                {card.imageUrl && (
                  <img className="flashcard-image" src={card.imageUrl} alt="" />
                )}
                <span className="flashcard-hint">From {card.deckName}</span>
              </div>
              <div className="flashcard-back">
                <span className="flashcard-label">Back</span>
                <p>{card.back}</p>
                {card.imageUrl && (
                  <img className="flashcard-image" src={card.imageUrl} alt="" />
                )}
                <span className="flashcard-hint">From {card.deckName}</span>
              </div>
            </div>
          </div>

          <div className="study-controls">
            <button className="btn" onClick={goPrev} disabled={currentIndex === 0}>
              <ChevronLeft size={18} /> Prev
            </button>
            <button className="btn btn-danger" onClick={markUnknown}>
              Don't Know
            </button>
            <button className="btn btn-success" onClick={markKnown}>
              Know It
            </button>
            <button
              className="btn"
              onClick={goNext}
              disabled={currentIndex === cards.length - 1}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>

          <div className="study-extra">
            <button className="btn btn-ghost" onClick={handleShuffle}>
              <Shuffle size={16} /> Shuffle
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
