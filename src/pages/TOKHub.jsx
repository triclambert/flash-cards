import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTOKWorkspace, saveTOKWorkspace, generateId } from '../utils/storage';

function emptyObject() {
  return { id: generateId(), title: '', prompt: '', justification: '' };
}

function emptyClaim() {
  return { id: generateId(), claim: '', counterclaim: '', example: '' };
}

function emptyReflection() {
  return { id: generateId(), label: '', date: '', text: '' };
}

export default function TOKHub() {
  const navigate = useNavigate();
  const existing = getTOKWorkspace();
  const [essayTitle, setEssayTitle] = useState(existing?.essayTitle || '');
  const [objects, setObjects] = useState(
    existing?.objects?.length ? existing.objects : [emptyObject()]
  );
  const [claims, setClaims] = useState(
    existing?.claims?.length ? existing.claims : [emptyClaim()]
  );
  const [reflections, setReflections] = useState(
    existing?.reflections?.length ? existing.reflections : [emptyReflection()]
  );

  function addObject() {
    setObjects([...objects, emptyObject()]);
  }

  function updateObject(id, field, value) {
    setObjects(objects.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }

  function removeObject(id) {
    setObjects(objects.filter((o) => o.id !== id));
  }

  function addClaim() {
    setClaims([...claims, emptyClaim()]);
  }

  function updateClaim(id, field, value) {
    setClaims(claims.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function removeClaim(id) {
    setClaims(claims.filter((c) => c.id !== id));
  }

  function addReflection() {
    setReflections([...reflections, emptyReflection()]);
  }

  function updateReflection(id, field, value) {
    setReflections(
      reflections.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function removeReflection(id) {
    setReflections(reflections.filter((r) => r.id !== id));
  }

  function handleSave() {
    saveTOKWorkspace({
      essayTitle: essayTitle.trim(),
      objects: objects.filter((o) => o.title.trim() || o.justification.trim()),
      claims: claims.filter((c) => c.claim.trim() || c.counterclaim.trim()),
      reflections: reflections.filter((r) => r.text.trim()),
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>TOK Workspace</h2>
      </div>

      <div className="task-form">
        <div className="form-group">
          <label>Essay Title</label>
          <input
            className="input"
            value={essayTitle}
            onChange={(e) => setEssayTitle(e.target.value)}
            placeholder="Paste your TOK essay title"
          />
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Exhibition Objects</h3>
            <button className="btn btn-sm btn-primary" onClick={addObject}>
              <Plus size={16} /> Add Object
            </button>
          </div>
          {objects.map((object) => (
            <div key={object.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Object</label>
                  <input
                    className="input"
                    value={object.title}
                    onChange={(e) => updateObject(object.id, 'title', e.target.value)}
                    placeholder="Object title"
                  />
                </div>
                <div className="form-group">
                  <label>Prompt</label>
                  <input
                    className="input"
                    value={object.prompt}
                    onChange={(e) => updateObject(object.id, 'prompt', e.target.value)}
                    placeholder="TOK prompt"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Justification</label>
                <textarea
                  className="input"
                  rows={3}
                  value={object.justification}
                  onChange={(e) => updateObject(object.id, 'justification', e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeObject(object.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Claim / Counterclaim Builder</h3>
            <button className="btn btn-sm btn-primary" onClick={addClaim}>
              <Plus size={16} /> Add Pair
            </button>
          </div>
          {claims.map((pair) => (
            <div key={pair.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Claim</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={pair.claim}
                    onChange={(e) => updateClaim(pair.id, 'claim', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Counterclaim</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={pair.counterclaim}
                    onChange={(e) => updateClaim(pair.id, 'counterclaim', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Example / Evidence</label>
                <input
                  className="input"
                  value={pair.example}
                  onChange={(e) => updateClaim(pair.id, 'example', e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeClaim(pair.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cards-section">
          <div className="section-header">
            <h3>Reflection Drafts</h3>
            <button className="btn btn-sm btn-primary" onClick={addReflection}>
              <Plus size={16} /> Add Reflection
            </button>
          </div>
          {reflections.map((entry) => (
            <div key={entry.id} className="task-row">
              <div className="form-row">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    className="input"
                    value={entry.label}
                    onChange={(e) => updateReflection(entry.id, 'label', e.target.value)}
                    placeholder="Reflection 1"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={entry.date}
                    onChange={(e) => updateReflection(entry.id, 'date', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Draft</label>
                <textarea
                  className="input"
                  rows={3}
                  value={entry.text}
                  onChange={(e) => updateReflection(entry.id, 'text', e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeReflection(entry.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save TOK Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
