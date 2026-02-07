import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { getPracticeTest, savePracticeTest, generateId } from '../utils/storage';

function emptyQuestion() {
  return {
    id: generateId(),
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  };
}

export default function TestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const existing = isNew ? null : getPracticeTest(id);
  const [title, setTitle] = useState(existing?.title || '');
  const [questions, setQuestions] = useState(existing?.questions || []);

  function addQuestion() {
    setQuestions([...questions, emptyQuestion()]);
  }

  function updateQuestion(qId, field, value) {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, [field]: value } : q)));
  }

  function updateOption(qId, optIndex, value) {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const options = [...q.options];
        options[optIndex] = value;
        return { ...q, options };
      })
    );
  }

  function addOption(qId) {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return { ...q, options: [...q.options, ''] };
      })
    );
  }

  function removeOption(qId, optIndex) {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const options = q.options.filter((_, i) => i !== optIndex);
        const correctAnswer =
          q.correctAnswer === optIndex
            ? 0
            : q.correctAnswer > optIndex
            ? q.correctAnswer - 1
            : q.correctAnswer;
        return { ...q, options, correctAnswer };
      })
    );
  }

  function removeQuestion(qId) {
    setQuestions(questions.filter((q) => q.id !== qId));
  }

  function handleSave() {
    if (!title.trim()) {
      alert('Please enter a test title.');
      return;
    }

    savePracticeTest({
      id: isNew ? generateId() : id,
      title: title.trim(),
      questions,
      lastScore: existing?.lastScore,
    });
    navigate('/tests');
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/tests')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{isNew ? 'Create Practice Test' : 'Edit Practice Test'}</h2>
      </div>

      <div className="form-group">
        <label>Test Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. History Midterm Practice"
          className="input"
        />
      </div>

      <div className="cards-section">
        <div className="section-header">
          <h3>Questions ({questions.length})</h3>
          <button className="btn btn-sm btn-primary" onClick={addQuestion}>
            <Plus size={16} /> Add Question
          </button>
        </div>

        {questions.length === 0 && (
          <p className="empty-hint">No questions yet. Click "Add Question" to create one.</p>
        )}

        {questions.map((q, qIndex) => (
          <div key={q.id} className="card-editor question-editor">
            <div className="card-editor-header">
              <span className="card-number">Q{qIndex + 1}</span>
              <div className="question-type-select">
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                  className="input input-sm"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True / False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>
              <button
                className="btn btn-icon btn-danger"
                onClick={() => removeQuestion(q.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="form-group">
              <label>Question</label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                placeholder="Enter your question"
                rows={2}
                className="input"
              />
            </div>

            {q.type === 'multiple-choice' && (
              <div className="options-list">
                <label>Options (select the correct answer)</label>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="option-row">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctAnswer === optIndex}
                      onChange={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className="input"
                    />
                    {q.options.length > 2 && (
                      <button
                        className="btn btn-icon btn-danger"
                        onClick={() => removeOption(q.id, optIndex)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => addOption(q.id)}
                >
                  <Plus size={14} /> Add Option
                </button>
              </div>
            )}

            {q.type === 'true-false' && (
              <div className="options-list">
                <label>Correct Answer</label>
                <div className="tf-options">
                  <label className="tf-label">
                    <input
                      type="radio"
                      name={`tf-${q.id}`}
                      checked={q.correctAnswer === 'true'}
                      onChange={() => updateQuestion(q.id, 'correctAnswer', 'true')}
                    />
                    True
                  </label>
                  <label className="tf-label">
                    <input
                      type="radio"
                      name={`tf-${q.id}`}
                      checked={q.correctAnswer === 'false'}
                      onChange={() => updateQuestion(q.id, 'correctAnswer', 'false')}
                    />
                    False
                  </label>
                </div>
              </div>
            )}

            {q.type === 'short-answer' && (
              <div className="form-group">
                <label>Expected Answer</label>
                <input
                  type="text"
                  value={q.correctAnswer || ''}
                  onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                  placeholder="The correct answer"
                  className="input"
                />
              </div>
            )}

            <div className="form-group">
              <label>Explanation (optional)</label>
              <textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(q.id, 'explanation', e.target.value)}
                placeholder="Explain why this is the correct answer"
                rows={2}
                className="input"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Test
        </button>
      </div>
    </div>
  );
}
