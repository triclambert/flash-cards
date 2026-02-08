import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IAHub() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>IA Manager</h2>
      </div>
      <div className="empty-state">
        <p>IA management is coming next.</p>
      </div>
    </div>
  );
}
