import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { getDeck, saveDeck, generateId } from '../utils/storage';

export default function DeckEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const existing = isNew ? null : getDeck(id);
  const [name, setName] = useState(existing?.name || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [cards, setCards] = useState(existing?.cards || []);

  function addCard() {
    setCards([...cards, { id: generateId(), front: '', back: '' }]);
  }

  function updateCard(cardId, field, value) {
    setCards(cards.map((c) => (c.id === cardId ? { ...c, [field]: value } : c)));
  }

  function removeCard(cardId) {
    setCards(cards.filter((c) => c.id !== cardId));
  }

  function handleSave() {
    if (!name.trim()) {
      alert('Please enter a deck name.');
      return;
    }

    saveDeck({
      id: isNew ? generateId() : id,
      name: name.trim(),
      description: description.trim(),
      cards,
    });
    navigate('/decks');
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/decks')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{isNew ? 'Create Deck' : 'Edit Deck'}</h2>
      </div>

      <div className="form-group">
        <label>Deck Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Biology Chapter 5"
          className="input"
        />
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this deck"
          className="input"
        />
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Cards ({cards.length})</h3>
          <button className="btn btn-sm btn-primary" onClick={addCard}>
            <Plus size={16} /> Add Card
          </button>
        </div>

        {cards.length === 0 && (
          <p className="empty-hint">No cards yet. Click "Add Card" to create one.</p>
        )}

        {cards.map((card, index) => (
          <div key={card.id} className="card-editor">
            <div className="card-editor-header">
              <span className="card-number">#{index + 1}</span>
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removeCard(card.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="card-editor-fields">
              <div className="form-group">
                <label>Front</label>
                <textarea
                  value={card.front}
                  onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                  placeholder="Question or term"
                  rows={2}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>Back</label>
                <textarea
                  value={card.back}
                  onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                  placeholder="Answer or definition"
                  rows={2}
                  className="input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Deck
        </button>
      </div>
    </div>
  );
}
