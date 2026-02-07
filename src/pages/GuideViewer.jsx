import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { getStudyGuide } from '../utils/storage';

export default function GuideViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = getStudyGuide(id);

  if (!guide) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => navigate('/guides')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="empty-state">
          <p>Study guide not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page guide-viewer">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/guides')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{guide.title}</h2>
        <button className="btn btn-sm" onClick={() => navigate(`/guides/${id}`)}>
          <Edit size={16} /> Edit
        </button>
      </div>

      {guide.sections?.length === 0 && (
        <div className="empty-state">
          <p>This guide has no sections yet.</p>
        </div>
      )}

      <div className="guide-content">
        {guide.sections?.map((section, index) => (
          <div key={section.id} className="guide-section">
            <h3>
              {index + 1}. {section.heading || 'Untitled Section'}
            </h3>
            <div className="guide-section-content">
              {section.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
