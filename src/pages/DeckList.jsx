import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Play } from 'lucide-react';
import { getDecks, deleteDeck } from '../utils/storage';

export default function DeckList() {
  const [decks, setDecks] = useState(getDecks);
  const navigate = useNavigate();

  function handleDelete(id) {
    if (window.confirm('Delete this deck and all its cards?')) {
      setDecks(deleteDeck(id));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Flash Card Decks</h2>
        <Link to="/decks/new" className="btn btn-primary">
          <Plus size={18} /> New Deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="empty-state">
          <p>No decks yet. Create your first deck to get started!</p>
          <Link to="/decks/new" className="btn btn-primary">
            <Plus size={18} /> Create Deck
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {decks.map((deck) => (
            <div key={deck.id} className="deck-card">
              <h3>{deck.name}</h3>
              {deck.description && <p className="deck-desc">{deck.description}</p>}
              <p className="deck-count">{deck.cards?.length || 0} cards</p>
              <div className="deck-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => navigate(`/decks/${deck.id}/study`)}
                  disabled={!deck.cards?.length}
                >
                  <Play size={16} /> Study
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => navigate(`/decks/${deck.id}`)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(deck.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
