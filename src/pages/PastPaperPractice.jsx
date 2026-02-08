import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getSubjects,
  getPastPaperSessions,
  savePastPaperSession,
  deletePastPaperSession,
  generateId,
} from '../utils/storage';

function emptyError() {
  return { id: generateId(), topic: '', reason: '', marksLost: '' };
}

function emptySession() {
  return {
    id: generateId(),
    subjectId: '',
    subjectName: '',
    level: 'HL',
    paper: 'Paper 1',
    topic: '',
    durationMinutes: 60,
    markschemeUrl: '',
    score: '',
    maxScore: '',
    startedAt: '',
    completedAt: '',
    errors: [],
  };
}

export default function PastPaperPractice() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [sessions, setSessions] = useState(getPastPaperSessions);
  const [form, setForm] = useState(emptySession());
  const [errors, setErrors] = useState([emptyError()]);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [filters, setFilters] = useState({
    subjectId: '',
    level: '',
    paper: '',
    topic: '',
  });

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name, level: s.level })),
    [subjects]
  );

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
  }, [secondsLeft, isRunning]);

  function formatTimer(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function handleStart() {
    if (!form.durationMinutes || Number.isNaN(Number(form.durationMinutes))) return;
    setSecondsLeft(Number(form.durationMinutes) * 60);
    setIsRunning(true);
    if (!form.startedAt) {
      setForm((prev) => ({ ...prev, startedAt: new Date().toISOString() }));
    }
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleResetTimer() {
    setIsRunning(false);
    setSecondsLeft(0);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addError() {
    setErrors([...errors, emptyError()]);
  }

  function updateError(id, field, value) {
    setErrors(errors.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeError(id) {
    setErrors(errors.filter((e) => e.id !== id));
  }

  function handleSaveSession() {
    if (!form.subjectId && !form.subjectName.trim()) {
      alert('Select or enter a subject name.');
      return;
    }
    const payload = {
      ...form,
      subjectName: form.subjectId ? '' : form.subjectName.trim(),
      errors: errors.filter((e) => e.topic.trim() || e.reason.trim()),
      completedAt: form.completedAt || new Date().toISOString(),
    };
    setSessions(savePastPaperSession(payload));
    setForm(emptySession());
    setErrors([emptyError()]);
    handleResetTimer();
  }

  function handleDeleteSession(id) {
    if (window.confirm('Delete this practice session?')) {
      setSessions(deletePastPaperSession(id));
    }
  }

  const filteredSessions = sessions.filter((session) => {
    if (filters.subjectId && session.subjectId !== filters.subjectId) return false;
    if (filters.level && session.level !== filters.level) return false;
    if (filters.paper && session.paper !== filters.paper) return false;
    if (filters.topic && !session.topic?.toLowerCase().includes(filters.topic.toLowerCase()))
      return false;
    return true;
  });

  const weakTopics = useMemo(() => {
    const counts = {};
    sessions.forEach((session) => {
      (session.errors || []).forEach((error) => {
        const key = error.topic?.trim();
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);
  }, [sessions]);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Past Paper Practice</h2>
      </div>

      <div className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              className="input"
              value={form.subjectId}
              onChange={(e) => handleChange('subjectId', e.target.value)}
            >
              <option value="">Select subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          {!form.subjectId && (
            <div className="form-group">
              <label>Subject Name</label>
              <input
                className="input"
                value={form.subjectName}
                onChange={(e) => handleChange('subjectName', e.target.value)}
                placeholder="Subject label"
              />
            </div>
          )}
          <div className="form-group">
            <label>Level</label>
            <select
              className="input"
              value={form.level}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              <option value="HL">HL</option>
              <option value="SL">SL</option>
            </select>
          </div>
          <div className="form-group">
            <label>Paper</label>
            <input
              className="input"
              value={form.paper}
              onChange={(e) => handleChange('paper', e.target.value)}
              placeholder="Paper 1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Topic</label>
            <input
              className="input"
              value={form.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              placeholder="e.g. Kinematics"
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.durationMinutes}
              onChange={(e) => handleChange('durationMinutes', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Markscheme Link</label>
            <input
              type="url"
              className="input"
              value={form.markschemeUrl}
              onChange={(e) => handleChange('markschemeUrl', e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>

        <div className="timer-panel">
          <div>
            <span className="timer-label">Timed Practice</span>
            <h3 className="timer-value">{formatTimer(secondsLeft)}</h3>
          </div>
          <div className="timer-actions">
            <button className="btn btn-success" onClick={handleStart}>
              <Play size={16} /> Start
            </button>
            <button className="btn" onClick={handlePause} disabled={!isRunning}>
              <Pause size={16} /> Pause
            </button>
            <button className="btn btn-ghost" onClick={handleResetTimer}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Score</label>
            <input
              className="input"
              value={form.score}
              onChange={(e) => handleChange('score', e.target.value)}
              placeholder="e.g. 56"
            />
          </div>
          <div className="form-group">
            <label>Max Score</label>
            <input
              className="input"
              value={form.maxScore}
              onChange={(e) => handleChange('maxScore', e.target.value)}
              placeholder="e.g. 80"
            />
          </div>
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Error Log</h3>
            <button className="btn btn-sm btn-primary" onClick={addError}>
              <Plus size={16} /> Add Error
            </button>
          </div>
          {errors.map((error) => (
            <div key={error.id} className="error-row">
              <input
                className="input"
                value={error.topic}
                onChange={(e) => updateError(error.id, 'topic', e.target.value)}
                placeholder="Topic"
              />
              <input
                className="input"
                value={error.reason}
                onChange={(e) => updateError(error.id, 'reason', e.target.value)}
                placeholder="Lost marks because..."
              />
              <input
                className="input"
                value={error.marksLost}
                onChange={(e) => updateError(error.id, 'marksLost', e.target.value)}
                placeholder="Marks"
              />
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removeError(error.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSaveSession}>
            <Save size={18} /> Save Session
          </button>
        </div>
      </div>

      <div className="section-header">
        <h3>Session Filters</h3>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Subject</label>
          <select
            className="input"
            value={filters.subjectId}
            onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
          >
            <option value="">All subjects</option>
            {subjectOptions.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Level</label>
          <select
            className="input"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All levels</option>
            <option value="HL">HL</option>
            <option value="SL">SL</option>
          </select>
        </div>
        <div className="form-group">
          <label>Paper</label>
          <input
            className="input"
            value={filters.paper}
            onChange={(e) => setFilters({ ...filters, paper: e.target.value })}
            placeholder="Paper 1"
          />
        </div>
        <div className="form-group">
          <label>Topic</label>
          <input
            className="input"
            value={filters.topic}
            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
            placeholder="Search topics"
          />
        </div>
      </div>

      <div className="task-list">
        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <p>No sessions yet. Log your first practice session above.</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.id} className="task-row">
              <div>
                <h4>{session.paper}</h4>
                <p className="task-meta">
                  {subjectOptions.find((s) => s.id === session.subjectId)?.name ||
                    session.subjectName ||
                    'General'}{' '}
                  • {session.level} • {session.topic || 'General'}
                </p>
                <p className="task-meta">
                  Score: {session.score || '—'} / {session.maxScore || '—'} •{' '}
                  {session.durationMinutes || '—'} min
                </p>
                {session.markschemeUrl && (
                  <a
                    className="link-inline"
                    href={session.markschemeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Markscheme
                  </a>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Weak-Topic Tracker</h3>
        </div>
        {weakTopics.length === 0 ? (
          <p className="empty-hint">No weak topics yet. Log errors to build this view.</p>
        ) : (
          <div className="weak-topic-grid">
            {weakTopics.map((topic) => (
              <div key={topic.topic} className="weak-topic-card">
                <h4>{topic.topic}</h4>
                <p className="item-meta">{topic.count} errors logged</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
