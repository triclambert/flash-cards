import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { getSubject, saveSubject, generateId } from '../utils/storage';

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not started' },
  { value: 'learning', label: 'Learning' },
  { value: 'exam-ready', label: 'Exam-ready' },
];

export default function SubjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const existing = isNew ? null : getSubject(id);

  const [name, setName] = useState(existing?.name || '');
  const [level, setLevel] = useState(existing?.level || 'HL');
  const [syllabus, setSyllabus] = useState(existing?.syllabus || []);
  const [notes, setNotes] = useState(existing?.notes || '');
  const [pastPapers, setPastPapers] = useState(existing?.pastPapers || []);

  function addSyllabusItem() {
    setSyllabus([
      ...syllabus,
      { id: generateId(), topic: '', status: 'not-started' },
    ]);
  }

  function updateSyllabusItem(itemId, field, value) {
    setSyllabus(
      syllabus.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  }

  function removeSyllabusItem(itemId) {
    setSyllabus(syllabus.filter((item) => item.id !== itemId));
  }

  function addPastPaper() {
    setPastPapers([
      ...pastPapers,
      { id: generateId(), label: '', url: '' },
    ]);
  }

  function updatePastPaper(paperId, field, value) {
    setPastPapers(
      pastPapers.map((paper) =>
        paper.id === paperId ? { ...paper, [field]: value } : paper
      )
    );
  }

  function removePastPaper(paperId) {
    setPastPapers(pastPapers.filter((paper) => paper.id !== paperId));
  }

  function handleSave() {
    if (!name.trim()) {
      alert('Please enter a subject name.');
      return;
    }
    saveSubject({
      id: isNew ? generateId() : id,
      name: name.trim(),
      level,
      syllabus,
      notes,
      pastPapers,
    });
    navigate('/subjects');
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/subjects')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{isNew ? 'Create Subject' : 'Subject Page'}</h2>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Subject Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="e.g. Math AA"
          />
        </div>
        <div className="form-group">
          <label>Level</label>
          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="HL">HL</option>
            <option value="SL">SL</option>
          </select>
        </div>
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>IB Syllabus Checklist</h3>
          <button className="btn btn-sm btn-primary" onClick={addSyllabusItem}>
            <Plus size={16} /> Add Topic
          </button>
        </div>

        {syllabus.length === 0 ? (
          <p className="empty-hint">
            Add syllabus topics to track mastery across the course.
          </p>
        ) : (
          syllabus.map((item, index) => (
            <div key={item.id} className="syllabus-row">
              <span className="card-number">#{index + 1}</span>
              <input
                type="text"
                value={item.topic}
                onChange={(e) => updateSyllabusItem(item.id, 'topic', e.target.value)}
                className="input"
                placeholder="Topic / syllabus point"
              />
              <select
                className="input status-select"
                value={item.status}
                onChange={(e) => updateSyllabusItem(item.id, 'status', e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removeSyllabusItem(item.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Notes</h3>
        </div>
        <textarea
          className="input"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key notes, formulas, or reminders..."
        />
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Past Paper Links</h3>
          <button className="btn btn-sm btn-primary" onClick={addPastPaper}>
            <Plus size={16} /> Add Link
          </button>
        </div>
        {pastPapers.length === 0 ? (
          <p className="empty-hint">Add links to past papers or markschemes.</p>
        ) : (
          pastPapers.map((paper) => (
            <div key={paper.id} className="link-row">
              <input
                type="text"
                value={paper.label}
                onChange={(e) => updatePastPaper(paper.id, 'label', e.target.value)}
                className="input"
                placeholder="Paper label"
              />
              <input
                type="url"
                value={paper.url}
                onChange={(e) => updatePastPaper(paper.id, 'url', e.target.value)}
                className="input"
                placeholder="https://"
              />
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removePastPaper(paper.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Subject
        </button>
      </div>
    </div>
  );
}
