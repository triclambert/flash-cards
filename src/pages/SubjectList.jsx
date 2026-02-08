import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getSubjects, deleteSubject } from '../utils/storage';

function progressPercent(subject) {
  const items = subject.syllabus || [];
  if (items.length === 0) return 0;
  const mastered = items.filter((i) => i.status === 'exam-ready').length;
  const learning = items.filter((i) => i.status === 'learning').length;
  return Math.round(((mastered + learning * 0.5) / items.length) * 100);
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState(getSubjects);
  const navigate = useNavigate();

  function handleDelete(id) {
    if (window.confirm('Delete this subject and its checklist?')) {
      setSubjects(deleteSubject(id));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Subjects</h2>
        <Link to="/subjects/new" className="btn btn-primary">
          <Plus size={18} /> New Subject
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <p>No subjects yet. Add your first subject to track progress.</p>
          <Link to="/subjects/new" className="btn btn-primary">
            <Plus size={18} /> Create Subject
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {subjects.map((subject) => (
            <div key={subject.id} className="deck-card">
              <h3>{subject.name}</h3>
              <p className="deck-desc">{subject.level || 'HL/SL'}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent(subject)}%` }}
                />
              </div>
              <p className="deck-count">{progressPercent(subject)}% exam-ready</p>
              <div className="deck-actions">
                <button
                  className="btn btn-sm"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  <Edit size={16} /> Open
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(subject.id)}
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
