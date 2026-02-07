import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { getStudyGuides, deleteStudyGuide } from '../utils/storage';

export default function GuideList() {
  const [guides, setGuides] = useState(getStudyGuides);
  const navigate = useNavigate();

  function handleDelete(id) {
    if (window.confirm('Delete this study guide?')) {
      setGuides(deleteStudyGuide(id));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Study Guides</h2>
        <Link to="/guides/new" className="btn btn-primary">
          <Plus size={18} /> New Guide
        </Link>
      </div>

      {guides.length === 0 ? (
        <div className="empty-state">
          <p>No study guides yet. Create your first guide!</p>
          <Link to="/guides/new" className="btn btn-primary">
            <Plus size={18} /> Create Guide
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {guides.map((guide) => (
            <div key={guide.id} className="deck-card">
              <h3>{guide.title}</h3>
              <p className="deck-desc">
                {guide.sections?.length || 0} section
                {guide.sections?.length !== 1 ? 's' : ''}
              </p>
              <div className="deck-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => navigate(`/guides/${guide.id}/view`)}
                >
                  <Eye size={16} /> View
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => navigate(`/guides/${guide.id}`)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(guide.id)}
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
