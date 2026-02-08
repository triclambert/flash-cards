import { useMemo, useState } from 'react';
import { Plus, Trash2, Edit, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, getTasks, saveTask, deleteTask, generateId } from '../utils/storage';

const TASK_TYPES = ['IA', 'Test', 'Essay', 'CAS', 'EE', 'TOK'];
const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
const LEVELS = ['HL', 'SL'];

function emptyTask() {
  return {
    id: generateId(),
    title: '',
    subjectId: '',
    subjectName: '',
    level: 'HL',
    type: 'IA',
    dueDate: '',
    schoolDeadline: '',
    ibDeadline: '',
    status: 'todo',
    priority: 'medium',
  };
}

export default function TaskManager() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [tasks, setTasks] = useState(getTasks);
  const [form, setForm] = useState(emptyTask());
  const [editingId, setEditingId] = useState(null);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ id: s.id, name: s.name, level: s.level })),
    [subjects]
  );

  function resetForm() {
    setForm(emptyTask());
    setEditingId(null);
  }

  function startEdit(task) {
    setForm({
      ...task,
      id: task.id,
      subjectId: task.subjectId || '',
      subjectName: task.subjectName || '',
      dueDate: task.dueDate || '',
      schoolDeadline: task.schoolDeadline || '',
      ibDeadline: task.ibDeadline || '',
    });
    setEditingId(task.id);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert('Please enter a task title.');
      return;
    }
    const next = {
      ...form,
      title: form.title.trim(),
      subjectName: form.subjectId ? '' : form.subjectName.trim(),
    };
    setTasks(saveTask(next));
    resetForm();
  }

  function handleDelete(id) {
    if (window.confirm('Delete this task?')) {
      setTasks(deleteTask(id));
      if (editingId === id) resetForm();
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const ad = new Date(a.schoolDeadline || a.ibDeadline || a.dueDate || 0);
    const bd = new Date(b.schoolDeadline || b.ibDeadline || b.dueDate || 0);
    return ad - bd;
  });

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Deadline & Task Manager</h2>
      </div>

      <div className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input"
              placeholder="e.g. History IA first draft"
            />
          </div>
          <div className="form-group">
            <label>Task Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              className="input"
              value={form.subjectId}
              onChange={(e) => handleChange('subjectId', e.target.value)}
            >
              <option value="">General / Other</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>HL / SL</label>
            <select
              className="input"
              value={form.level}
              onChange={(e) => handleChange('level', e.target.value)}
              disabled={!!form.subjectId}
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          {!form.subjectId && (
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                value={form.subjectName}
                onChange={(e) => handleChange('subjectName', e.target.value)}
                className="input"
                placeholder="Optional subject label"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date (Task)</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>School Deadline</label>
            <input
              type="date"
              value={form.schoolDeadline}
              onChange={(e) => handleChange('schoolDeadline', e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Final IB Deadline</label>
            <input
              type="date"
              value={form.ibDeadline}
              onChange={(e) => handleChange('ibDeadline', e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> {editingId ? 'Update Task' : 'Save Task'}
          </button>
          {editingId ? (
            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
          ) : (
            <button className="btn" onClick={resetForm}>
              <Plus size={16} /> New Blank
            </button>
          )}
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add your first deadline above.</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="task-row">
              <div>
                <h4>{task.title}</h4>
                <p className="task-meta">
                  {(task.subjectId
                    ? subjectOptions.find((s) => s.id === task.subjectId)?.name
                    : task.subjectName) || 'General'}
                  {' • '}
                  {task.level} • {task.type}
                </p>
                <p className="task-meta">
                  Due: {task.dueDate || '—'} • School: {task.schoolDeadline || '—'} • IB:{' '}
                  {task.ibDeadline || '—'}
                </p>
              </div>
              <div className="task-actions">
                <span className={`pill pill-${task.priority}`}>{task.priority}</span>
                <span className={`pill pill-${task.status}`}>{task.status}</span>
                <button className="btn btn-sm" onClick={() => startEdit(task)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
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
