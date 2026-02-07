import { Link } from 'react-router-dom';
import { Layers, BookOpen, ClipboardList, Plus } from 'lucide-react';
import { getDecks, getStudyGuides, getPracticeTests } from '../utils/storage';

export default function Dashboard() {
  const decks = getDecks();
  const guides = getStudyGuides();
  const tests = getPracticeTests();

  const totalCards = decks.reduce((sum, d) => sum + (d.cards?.length || 0), 0);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <Layers size={32} />
          <div>
            <h3>{decks.length}</h3>
            <p>Card Decks</p>
            <span className="stat-sub">{totalCards} total cards</span>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen size={32} />
          <div>
            <h3>{guides.length}</h3>
            <p>Study Guides</p>
          </div>
        </div>
        <div className="stat-card">
          <ClipboardList size={32} />
          <div>
            <h3>{tests.length}</h3>
            <p>Practice Tests</p>
          </div>
        </div>
      </div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions">
        <Link to="/decks/new" className="action-card">
          <Plus size={20} />
          New Card Deck
        </Link>
        <Link to="/guides/new" className="action-card">
          <Plus size={20} />
          New Study Guide
        </Link>
        <Link to="/tests/new" className="action-card">
          <Plus size={20} />
          New Practice Test
        </Link>
      </div>

      {decks.length > 0 && (
        <>
          <h3 className="section-title">Recent Decks</h3>
          <div className="item-list">
            {decks.slice(0, 5).map((deck) => (
              <Link key={deck.id} to={`/decks/${deck.id}`} className="item-row">
                <span className="item-name">{deck.name}</span>
                <span className="item-meta">{deck.cards?.length || 0} cards</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
