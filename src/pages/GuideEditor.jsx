import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { getStudyGuide, saveStudyGuide, generateId } from '../utils/storage';

export default function GuideEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const existing = isNew ? null : getStudyGuide(id);
  const [title, setTitle] = useState(existing?.title || '');
  const [sections, setSections] = useState(existing?.sections || []);

  function addSection() {
    setSections([...sections, { id: generateId(), heading: '', content: '' }]);
  }

  function updateSection(sectionId, field, value) {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  }

  function removeSection(sectionId) {
    setSections(sections.filter((s) => s.id !== sectionId));
  }

  function moveSection(index, direction) {
    const newSections = [...sections];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setSections(newSections);
  }

  function handleSave() {
    if (!title.trim()) {
      alert('Please enter a guide title.');
      return;
    }

    saveStudyGuide({
      id: isNew ? generateId() : id,
      title: title.trim(),
      sections,
    });
    navigate('/guides');
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/guides')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{isNew ? 'Create Study Guide' : 'Edit Study Guide'}</h2>
      </div>

      <div className="form-group">
        <label>Guide Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Organic Chemistry Final Review"
          className="input"
        />
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Sections ({sections.length})</h3>
          <button className="btn btn-sm btn-primary" onClick={addSection}>
            <Plus size={16} /> Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <p className="empty-hint">
            No sections yet. Click "Add Section" to start building your guide.
          </p>
        )}

        {sections.map((section, index) => (
          <div key={section.id} className="card-editor">
            <div className="card-editor-header">
              <div className="section-move-controls">
                <GripVertical size={16} className="grip-icon" />
                <button
                  className="btn btn-icon"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="form-group">
              <label>Section Heading</label>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => updateSection(section.id, 'heading', e.target.value)}
                placeholder="Section title"
                className="input"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                placeholder="Write your notes here..."
                rows={6}
                className="input"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Guide
        </button>
      </div>
    </div>
  );
}
