import { useState } from 'react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCASLogs, saveCASLog, deleteCASLog, generateId } from '../utils/storage';

const OUTCOMES = [
  'Identify own strengths and develop areas for growth',
  'Demonstrate that challenges have been undertaken, developing new skills',
  'Demonstrate how to initiate and plan a CAS experience',
  'Show commitment to and perseverance in CAS experiences',
  'Demonstrate the skills and recognize the benefits of working collaboratively',
  'Demonstrate engagement with issues of global significance',
  'Recognize and consider the ethics of choices and actions',
];

function emptyLog() {
  return {
    id: generateId(),
    date: '',
    category: 'Creativity',
    description: '',
    outcomes: [],
    evidence: '',
    supervisorConfirmed: false,
    isProject: false,
  };
}

export default function CASHub() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(getCASLogs);
  const [form, setForm] = useState(emptyLog());

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleOutcome(index) {
    setForm((prev) => {
      const outcomes = new Set(prev.outcomes);
      if (outcomes.has(index)) outcomes.delete(index);
      else outcomes.add(index);
      return { ...prev, outcomes: Array.from(outcomes) };
    });
  }

  function handleSave() {
    if (!form.date) {
      alert('Add a date for this CAS experience.');
      return;
    }
    if (!form.description.trim()) {
      alert('Add a description.');
      return;
    }
    setLogs(
      saveCASLog({
        ...form,
        description: form.description.trim(),
      })
    );
    setForm(emptyLog());
  }

  function handleDelete(id) {
    if (window.confirm('Delete this CAS log entry?')) {
      setLogs(deleteCASLog(id));
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>CAS Log System</h2>
      </div>

      <div className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="Creativity">Creativity</option>
              <option value="Activity">Activity</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div className="form-group">
            <label>Supervisor Confirmed</label>
            <select
              className="input"
              value={form.supervisorConfirmed ? 'yes' : 'no'}
              onChange={(e) => handleChange('supervisorConfirmed', e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>CAS Project</label>
            <select
              className="input"
              value={form.isProject ? 'yes' : 'no'}
              onChange={(e) => handleChange('isProject', e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your CAS experience"
          />
        </div>

        <div className="form-group">
          <label>Evidence (link)</label>
          <input
            className="input"
            value={form.evidence}
            onChange={(e) => handleChange('evidence', e.target.value)}
            placeholder="https://"
          />
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Learning Outcomes</h3>
          </div>
          <div className="outcomes-grid">
            {OUTCOMES.map((label, index) => (
              <label key={label} className="outcome-item">
                <input
                  type="checkbox"
                  checked={form.outcomes.includes(index)}
                  onChange={() => toggleOutcome(index)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Log
          </button>
        </div>
      </div>

      <div className="task-list">
        {logs.length === 0 ? (
          <div className="empty-state">
            <p>No CAS logs yet.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="task-row">
              <div>
                <h4>
                  {log.category} • {log.date}
                </h4>
                <p className="task-meta">{log.description}</p>
                <p className="task-meta">
                  Outcomes: {log.outcomes?.length || 0} • Supervisor:{' '}
                  {log.supervisorConfirmed ? 'Confirmed' : 'Pending'}
                </p>
                {log.evidence && (
                  <a
                    className="link-inline"
                    href={log.evidence}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Evidence Link
                  </a>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(log.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
