import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEEProject, saveEEProject, generateId } from '../utils/storage';

function emptyMeeting() {
  return { id: generateId(), date: '', notes: '' };
}

function emptyDraft() {
  return { id: generateId(), label: '', date: '', wordCount: '', notes: '' };
}

const RPPF_PROMPTS = [
  'Initial reflection: Planning and initial research',
  'Interim reflection: Progress review',
  'Final reflection: Completion and learning',
];

export default function EEHub() {
  const navigate = useNavigate();
  const existing = getEEProject();
  const [form, setForm] = useState(
    existing || {
      subject: '',
      researchQuestion: '',
      supervisor: '',
      wordCount: '',
      citations: '',
      meetings: [],
      drafts: [],
      rppf: RPPF_PROMPTS.map((label) => ({ id: generateId(), label, response: '' })),
    }
  );
  const [meetings, setMeetings] = useState(
    existing?.meetings?.length ? existing.meetings : [emptyMeeting()]
  );
  const [drafts, setDrafts] = useState(
    existing?.drafts?.length ? existing.drafts : [emptyDraft()]
  );
  const [rppf, setRppf] = useState(form.rppf);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateMeeting(id, field, value) {
    setMeetings(meetings.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function addMeeting() {
    setMeetings([...meetings, emptyMeeting()]);
  }

  function removeMeeting(id) {
    setMeetings(meetings.filter((m) => m.id !== id));
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

  function updateRppf(id, value) {
    setRppf(rppf.map((r) => (r.id === id ? { ...r, response: value } : r)));
  }

  function handleSave() {
    if (!form.subject.trim()) {
      alert('Enter the EE subject.');
      return;
    }
    if (!form.researchQuestion.trim()) {
      alert('Enter the research question.');
      return;
    }
    saveEEProject({
      ...form,
      subject: form.subject.trim(),
      researchQuestion: form.researchQuestion.trim(),
      meetings: meetings.filter((m) => m.notes.trim()),
      drafts: drafts.filter((d) => d.label.trim() || d.notes.trim()),
      rppf,
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Extended Essay Manager</h2>
      </div>

      <div className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <input
              className="input"
              value={form.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="e.g. Biology"
            />
          </div>
          <div className="form-group">
            <label>Supervisor</label>
            <input
              className="input"
              value={form.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
              placeholder="Supervisor name"
            />
          </div>
          <div className="form-group">
            <label>Word Count</label>
            <input
              className="input"
              value={form.wordCount}
              onChange={(e) => handleChange('wordCount', e.target.value)}
              placeholder="e.g. 3900"
            />
          </div>
          <div className="form-group">
            <label>Citations</label>
            <input
              className="input"
              value={form.citations}
              onChange={(e) => handleChange('citations', e.target.value)}
              placeholder="e.g. 12 sources"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Research Question</label>
          <input
            className="input"
            value={form.researchQuestion}
            onChange={(e) => handleChange('researchQuestion', e.target.value)}
            placeholder="Your EE research question"
          />
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Supervisor Meeting Log</h3>
            <button className="btn btn-sm btn-primary" onClick={addMeeting}>
              <Plus size={16} /> Add Meeting
            </button>
          </div>
          {meetings.map((meeting) => (
            <div key={meeting.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={meeting.date}
                    onChange={(e) => updateMeeting(meeting.id, 'date', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={meeting.notes}
                    onChange={(e) => updateMeeting(meeting.id, 'notes', e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeMeeting(meeting.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Draft Timeline</h3>
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
                    placeholder="3900"
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
            <h3>RPPF Reflections</h3>
          </div>
          {rppf.map((entry) => (
            <div key={entry.id} className="criteria-card">
              <label className="criteria-header">{entry.label}</label>
              <textarea
                className="input"
                rows={4}
                value={entry.response}
                onChange={(e) => updateRppf(entry.id, e.target.value)}
                placeholder="Write your reflection..."
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save EE
          </button>
        </div>
      </div>
    </div>
  );
}
