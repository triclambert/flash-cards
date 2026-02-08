import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getSubjects,
  getStudyBlocks,
  saveStudyBlock,
  deleteStudyBlock,
  getStudyGoals,
  saveStudyGoal,
  deleteStudyGoal,
  generateId,
} from '../utils/storage';

const DURATIONS = [30, 45, 60];

function emptyBlock() {
  return {
    id: generateId(),
    subjectId: '',
    subjectName: '',
    durationMinutes: 45,
    date: '',
    focusMode: true,
  };
}

function emptyGoal() {
  return {
    id: generateId(),
    subjectId: '',
    subjectName: '',
    targetBlocks: 2,
    blockMinutes: 45,
  };
}

export default function StudyPlanner() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [blocks, setBlocks] = useState(getStudyBlocks);
  const [goals, setGoals] = useState(getStudyGoals);
  const [blockForm, setBlockForm] = useState(emptyBlock());
  const [goalForm, setGoalForm] = useState(emptyGoal());
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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

  function handleBlockChange(field, value) {
    setBlockForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleGoalChange(field, value) {
    setGoalForm((prev) => ({ ...prev, [field]: value }));
  }

  function saveBlock() {
    if (!blockForm.subjectId && !blockForm.subjectName.trim()) {
      alert('Select or enter a subject name.');
      return;
    }
    const payload = {
      ...blockForm,
      subjectName: blockForm.subjectId ? '' : blockForm.subjectName.trim(),
      durationMinutes: Number(blockForm.durationMinutes),
    };
    setBlocks(saveStudyBlock(payload));
    setBlockForm(emptyBlock());
  }

  function saveGoal() {
    if (!goalForm.subjectId && !goalForm.subjectName.trim()) {
      alert('Select or enter a subject name.');
      return;
    }
    const payload = {
      ...goalForm,
      subjectName: goalForm.subjectId ? '' : goalForm.subjectName.trim(),
      targetBlocks: Number(goalForm.targetBlocks),
      blockMinutes: Number(goalForm.blockMinutes),
    };
    setGoals(saveStudyGoal(payload));
    setGoalForm(emptyGoal());
  }

  function removeBlock(id) {
    if (window.confirm('Delete this study block?')) {
      setBlocks(deleteStudyBlock(id));
      if (activeBlockId === id) {
        setActiveBlockId(null);
        setSecondsLeft(0);
        setIsRunning(false);
      }
    }
  }

  function removeGoal(id) {
    if (window.confirm('Delete this weekly goal?')) {
      setGoals(deleteStudyGoal(id));
    }
  }

  function startFocus(block) {
    setActiveBlockId(block.id);
    setSecondsLeft(block.durationMinutes * 60);
    setIsRunning(true);
  }

  function pauseFocus() {
    setIsRunning(false);
  }

  function resetFocus() {
    setIsRunning(false);
    setSecondsLeft(0);
    setActiveBlockId(null);
  }

  function generateRotation() {
    if (goals.length === 0) return;
    const start = new Date();
    let offset = 0;
    const created = [];

    goals.forEach((goal) => {
      for (let i = 0; i < goal.targetBlocks; i += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + (offset % 7));
        offset += 1;
        created.push({
          id: generateId(),
          subjectId: goal.subjectId,
          subjectName: goal.subjectName,
          durationMinutes: goal.blockMinutes,
          date: date.toISOString().slice(0, 10),
          focusMode: true,
        });
      }
    });

    const nextBlocks = [...blocks];
    created.forEach((block) => {
      nextBlocks.push(block);
      saveStudyBlock(block);
    });
    setBlocks(nextBlocks);
  }

  const weeklySummary = useMemo(() => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);
    const plannedMinutes = blocks
      .filter((b) => {
        if (!b.date) return true;
        const d = new Date(b.date);
        return d >= today && d <= end;
      })
      .reduce((sum, b) => sum + Number(b.durationMinutes || 0), 0);
    const goalMinutes = goals.reduce(
      (sum, g) => sum + Number(g.targetBlocks || 0) * Number(g.blockMinutes || 0),
      0
    );
    return { plannedMinutes, goalMinutes };
  }, [blocks, goals]);

  const sortedBlocks = [...blocks].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Study Session Planner</h2>
      </div>

      <div className="planner-summary">
        <div>
          <h3>Weekly Goals</h3>
          <p className="item-meta">
            Planned {weeklySummary.plannedMinutes} min / Goal {weeklySummary.goalMinutes} min
          </p>
        </div>
        <button className="btn btn-sm" onClick={generateRotation}>
          <Plus size={16} /> Auto-Fill Rotation
        </button>
      </div>

      <div className="task-form">
        <div className="section-header">
          <h3>Weekly Study Goals</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              className="input"
              value={goalForm.subjectId}
              onChange={(e) => handleGoalChange('subjectId', e.target.value)}
            >
              <option value="">Select subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          {!goalForm.subjectId && (
            <div className="form-group">
              <label>Subject Name</label>
              <input
                className="input"
                value={goalForm.subjectName}
                onChange={(e) => handleGoalChange('subjectName', e.target.value)}
                placeholder="Subject label"
              />
            </div>
          )}
          <div className="form-group">
            <label>Target Blocks / Week</label>
            <input
              type="number"
              min="1"
              className="input"
              value={goalForm.targetBlocks}
              onChange={(e) => handleGoalChange('targetBlocks', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Minutes / Block</label>
            <select
              className="input"
              value={goalForm.blockMinutes}
              onChange={(e) => handleGoalChange('blockMinutes', e.target.value)}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={saveGoal}>
            <Plus size={16} /> Add Goal
          </button>
        </div>

        <div className="task-list">
          {goals.length === 0 ? (
            <p className="empty-hint">Add weekly goals to build a rotation.</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="task-row">
                <div>
                  <h4>
                    {subjectOptions.find((s) => s.id === goal.subjectId)?.name ||
                      goal.subjectName ||
                      'General'}
                  </h4>
                  <p className="task-meta">
                    {goal.targetBlocks} blocks × {goal.blockMinutes} min
                  </p>
                </div>
                <div className="task-actions">
                  <button className="btn btn-sm btn-danger" onClick={() => removeGoal(goal.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="task-form">
        <div className="section-header">
          <h3>Plan a Study Block</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <select
              className="input"
              value={blockForm.subjectId}
              onChange={(e) => handleBlockChange('subjectId', e.target.value)}
            >
              <option value="">Select subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          {!blockForm.subjectId && (
            <div className="form-group">
              <label>Subject Name</label>
              <input
                className="input"
                value={blockForm.subjectName}
                onChange={(e) => handleBlockChange('subjectName', e.target.value)}
                placeholder="Subject label"
              />
            </div>
          )}
          <div className="form-group">
            <label>Duration</label>
            <select
              className="input"
              value={blockForm.durationMinutes}
              onChange={(e) => handleBlockChange('durationMinutes', e.target.value)}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={blockForm.date}
              onChange={(e) => handleBlockChange('date', e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={saveBlock}>
            <Plus size={16} /> Add Block
          </button>
        </div>
      </div>

      <div className="timer-panel">
        <div>
          <span className="timer-label">Focus Mode</span>
          <h3 className="timer-value">{formatTimer(secondsLeft)}</h3>
          {activeBlockId && (
            <p className="item-meta">
              Active block:{' '}
              {sortedBlocks.find((b) => b.id === activeBlockId)?.subjectName ||
                subjectOptions.find(
                  (s) => s.id === sortedBlocks.find((b) => b.id === activeBlockId)?.subjectId
                )?.name ||
                'Session'}
            </p>
          )}
        </div>
        <div className="timer-actions">
          <button
            className="btn btn-success"
            onClick={() => {
              const block = sortedBlocks.find((b) => b.id === activeBlockId);
              if (block) startFocus(block);
            }}
            disabled={!activeBlockId}
          >
            <Play size={16} /> Start
          </button>
          <button className="btn" onClick={pauseFocus} disabled={!isRunning}>
            <Pause size={16} /> Pause
          </button>
          <button className="btn btn-ghost" onClick={resetFocus}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="task-list">
        {sortedBlocks.length === 0 ? (
          <div className="empty-state">
            <p>No study blocks yet. Add one above.</p>
          </div>
        ) : (
          sortedBlocks.map((block) => (
            <div key={block.id} className="task-row">
              <div>
                <h4>
                  {subjectOptions.find((s) => s.id === block.subjectId)?.name ||
                    block.subjectName ||
                    'General'}
                </h4>
                <p className="task-meta">
                  {block.durationMinutes} min • {block.date || 'No date'}
                </p>
              </div>
              <div className="task-actions">
                <button className="btn btn-sm" onClick={() => startFocus(block)}>
                  <Play size={16} /> Focus
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => removeBlock(block.id)}>
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
