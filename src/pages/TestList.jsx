import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Play } from 'lucide-react';
import { getPracticeTests, deletePracticeTest } from '../utils/storage';

export default function TestList() {
  const [tests, setTests] = useState(getPracticeTests);
  const navigate = useNavigate();

  function handleDelete(id) {
    if (window.confirm('Delete this practice test?')) {
      setTests(deletePracticeTest(id));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Practice Tests</h2>
        <Link to="/tests/new" className="btn btn-primary">
          <Plus size={18} /> New Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="empty-state">
          <p>No practice tests yet. Create your first test!</p>
          <Link to="/tests/new" className="btn btn-primary">
            <Plus size={18} /> Create Test
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {tests.map((test) => (
            <div key={test.id} className="deck-card">
              <h3>{test.title}</h3>
              <p className="deck-desc">
                {test.questions?.length || 0} question
                {test.questions?.length !== 1 ? 's' : ''}
              </p>
              {test.lastScore !== undefined && (
                <p className="deck-count">Last score: {test.lastScore}%</p>
              )}
              <div className="deck-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => navigate(`/tests/${test.id}/take`)}
                  disabled={!test.questions?.length}
                >
                  <Play size={16} /> Take Test
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => navigate(`/tests/${test.id}`)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(test.id)}
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
