import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getSubjects,
  getIAProjects,
  saveIAProject,
  deleteIAProject,
  generateId,
} from '../utils/storage';

function emptyProject() {
  return {
    id: generateId(),
    subjectId: '',
    subjectName: '',
    researchQuestion: '',
    wordCount: '',
    criteria: {
      A: { done: false, notes: '' },
      B: { done: false, notes: '' },
      C: { done: false, notes: '' },
      D: { done: false, notes: '' },
    },
    drafts: [],
    feedback: [],
  };
}

function emptyDraft() {
  return { id: generateId(), label: '', date: '', wordCount: '', notes: '' };
}

function emptyFeedback() {
  return { id: generateId(), date: '', notes: '' };
}

export default function IAHub() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [projects, setProjects] = useState(getIAProjects);
  const [form, setForm] = useState(emptyProject());
  const [drafts, setDrafts] = useState([emptyDraft()]);
  const [feedback, setFeedback] = useState([emptyFeedback()]);
  const [editingId, setEditingId] = useState(null);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name, level: s.level })),
    [subjects]
  );

  function resetForm() {
    setForm(emptyProject());
    setDrafts([emptyDraft()]);
    setFeedback([emptyFeedback()]);
    setEditingId(null);
  }

  function startEdit(project) {
    setForm({
      ...project,
      subjectId: project.subjectId || '',
      subjectName: project.subjectName || '',
      wordCount: project.wordCount || '',
      criteria: project.criteria || emptyProject().criteria,
    });
    setDrafts(project.drafts?.length ? project.drafts : [emptyDraft()]);
    setFeedback(project.feedback?.length ? project.feedback : [emptyFeedback()]);
    setEditingId(project.id);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCriteria(key, field, value) {
    setForm((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: { ...prev.criteria[key], [field]: value },
      },
    }));
  }

  function updateDraft(id, field, value) {
    setDrafts(drafts.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function addDraft() {
    setDrafts([...drafts, emptyDraft()]);
  }

  function removeDraft(id) {
    setDrafts(drafts.filter((d) => d.id !== id));
  }

  function updateFeedback(id, field, value) {
    setFeedback(feedback.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  }

  function addFeedback() {
    setFeedback([...feedback, emptyFeedback()]);
  }

  function removeFeedback(id) {
    setFeedback(feedback.filter((f) => f.id !== id));
  }

  function handleSave() {
    if (!form.subjectId && !form.subjectName.trim()) {
      alert('Select or enter a subject.');
      return;
    }
    if (!form.researchQuestion.trim()) {
      alert('Add a research question.');
      return;
    }
    const payload = {
      ...form,
      subjectName: form.subjectId ? '' : form.subjectName.trim(),
      researchQuestion: form.researchQuestion.trim(),
      wordCount: form.wordCount,
      drafts: drafts.filter((d) => d.label.trim() || d.notes.trim()),
      feedback: feedback.filter((f) => f.notes.trim()),
    };
    setProjects(saveIAProject(payload));
    resetForm();
  }

  function handleDelete(id) {
    if (window.confirm('Delete this IA project?')) {
      setProjects(deleteIAProject(id));
      if (editingId === id) resetForm();
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>IA Manager</h2>
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
            <label>Word Count</label>
            <input
              className="input"
              value={form.wordCount}
              onChange={(e) => handleChange('wordCount', e.target.value)}
              placeholder="e.g. 2100"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Research Question</label>
          <input
            className="input"
            value={form.researchQuestion}
            onChange={(e) => handleChange('researchQuestion', e.target.value)}
            placeholder="Type your IA research question"
          />
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Criteria Checklist (A–D)</h3>
          </div>
          <div className="criteria-grid">
            {Object.entries(form.criteria).map(([key, value]) => (
              <div key={key} className="criteria-card">
                <label className="criteria-header">
                  <input
                    type="checkbox"
                    checked={value.done}
                    onChange={(e) => updateCriteria(key, 'done', e.target.checked)}
                  />
                  Criterion {key}
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={value.notes}
                  onChange={(e) => updateCriteria(key, 'notes', e.target.value)}
                  placeholder="Notes for this criterion"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Draft Versions</h3>
            <button className="btn btn-sm btn-primary" onClick={addDraft}>
              <Plus size={16} /> Add Draft
            </button>
          </div>
          {drafts.map((draft) => (
            <div key={draft.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    className="input"
                    value={draft.label}
                    onChange={(e) => updateDraft(draft.id, 'label', e.target.value)}
                    placeholder="Draft 1"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={draft.date}
                    onChange={(e) => updateDraft(draft.id, 'date', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Word Count</label>
                  <input
                    className="input"
                    value={draft.wordCount}
                    onChange={(e) => updateDraft(draft.id, 'wordCount', e.target.value)}
                    placeholder="2100"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="input"
                  rows={2}
                  value={draft.notes}
                  onChange={(e) => updateDraft(draft.id, 'notes', e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeDraft(draft.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Teacher Feedback Log</h3>
            <button className="btn btn-sm btn-primary" onClick={addFeedback}>
              <Plus size={16} /> Add Feedback
            </button>
          </div>
          {feedback.map((entry) => (
            <div key={entry.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={entry.date}
                    onChange={(e) => updateFeedback(entry.id, 'date', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Feedback</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={entry.notes}
                    onChange={(e) => updateFeedback(entry.id, 'notes', e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeFeedback(entry.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> {editingId ? 'Update IA' : 'Save IA'}
          </button>
          {editingId && (
            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="task-list">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No IA projects yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="task-row">
              <div>
                <h4>
                  {subjectOptions.find((s) => s.id === project.subjectId)?.name ||
                    project.subjectName ||
                    'IA'}
                </h4>
                <p className="task-meta">{project.researchQuestion}</p>
                <p className="task-meta">Word Count: {project.wordCount || '—'}</p>
              </div>
              <div className="task-actions">
                <button className="btn btn-sm" onClick={() => startEdit(project)}>
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(project.id)}
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
