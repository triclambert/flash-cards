import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { getDeck } from '../utils/storage';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deck = getDeck(id);

  const [cards, setCards] = useState(deck?.cards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());

  const card = cards[currentIndex];

  const handleShuffle = useCallback(() => {
    setCards(shuffleArray(deck?.cards || []));
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  }, [deck]);

  if (!deck || cards.length === 0) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => navigate('/decks')}>
          <ArrowLeft size={18} /> Back to Decks
        </button>
        <div className="empty-state">
          <p>This deck has no cards to study.</p>
        </div>
      </div>
    );
  }

  const allReviewed = known.size + unknown.size === cards.length;

  function markKnown() {
    setKnown((prev) => new Set(prev).add(card.id));
    setUnknown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
    goNext();
  }

  function markUnknown() {
    setUnknown((prev) => new Set(prev).add(card.id));
    setKnown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
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

  return (
    <div className="page study-page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(`/decks/${id}`)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Studying: {deck.name}</h2>
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
          <h3>Session Complete!</h3>
          <p>
            You knew {known.size} of {cards.length} cards (
            {Math.round((known.size / cards.length) * 100)}%)
          </p>
          <div className="study-complete-actions">
            <button className="btn btn-primary" onClick={reset}>
              <RotateCcw size={18} /> Study Again
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
                <span className="flashcard-hint">Click to flip</span>
              </div>
              <div className="flashcard-back">
                <span className="flashcard-label">Back</span>
                <p>{card.back}</p>
                <span className="flashcard-hint">Click to flip</span>
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
