import { ArrowLeft, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCASLogs, getTasks } from '../utils/storage';

const TOTAL_OUTCOMES = 7;

export default function CASProgress() {
  const navigate = useNavigate();
  const logs = getCASLogs();
  const tasks = getTasks();

  const outcomes = new Set();
  logs.forEach((log) => {
    (log.outcomes || []).forEach((index) => outcomes.add(index));
  });

  const categoryCounts = logs.reduce(
    (acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    },
    { Creativity: 0, Activity: 0, Service: 0 }
  );

  const projects = logs.filter((log) => log.isProject).length;
  const experiences = logs.length - projects;

  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 30);

  const casDeadlines = tasks
    .filter((t) => t.type === 'CAS' && t.status !== 'done' && t.schoolDeadline)
    .filter((t) => new Date(t.schoolDeadline) <= in30Days)
    .sort((a, b) => new Date(a.schoolDeadline) - new Date(b.schoolDeadline));

  const outcomePercent = Math.round((outcomes.size / TOTAL_OUTCOMES) * 100);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>CAS Progress Tracker</h2>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Learning Outcomes</h3>
          <div className="analytics-row">
            <span>Completed</span>
            <span className="item-meta">
              {outcomes.size}/{TOTAL_OUTCOMES}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${outcomePercent}%` }} />
          </div>
        </div>

        <div className="analytics-card">
          <h3>Experiences vs Project</h3>
          <div className="analytics-row">
            <span>Experiences</span>
            <span className="item-meta">{experiences}</span>
          </div>
          <div className="analytics-row">
            <span>CAS Projects</span>
            <span className="item-meta">{projects}</span>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Balance Check</h3>
          <div className="analytics-row">
            <span>Creativity</span>
            <span className="item-meta">{categoryCounts.Creativity}</span>
          </div>
          <div className="analytics-row">
            <span>Activity</span>
            <span className="item-meta">{categoryCounts.Activity}</span>
          </div>
          <div className="analytics-row">
            <span>Service</span>
            <span className="item-meta">{categoryCounts.Service}</span>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Deadline Reminders</h3>
          {casDeadlines.length === 0 ? (
            <p className="empty-hint">No CAS deadlines in the next 30 days.</p>
          ) : (
            casDeadlines.map((task) => (
              <div key={task.id} className="analytics-row">
                <span>{task.title}</span>
                <span className="item-meta">{task.schoolDeadline}</span>
              </div>
            ))
          )}
          <div className="analytics-row">
            <CalendarCheck size={16} />
            <span className="item-meta">Add CAS deadlines in Task Manager.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
