import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EEHub() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Extended Essay</h2>
      </div>
      <div className="empty-state">
        <p>Extended Essay tools are coming next.</p>
      </div>
    </div>
  );
}
