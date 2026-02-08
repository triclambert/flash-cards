import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getSubjects,
  getStudyBlocks,
  getTasks,
  getPastPaperSessions,
} from '../utils/storage';

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export default function ProgressAnalytics() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const blocks = getStudyBlocks();
  const tasks = getTasks();
  const sessions = getPastPaperSessions();

  const timeBySubject = subjects.map((subject) => {
    const minutes = blocks
      .filter((b) => b.subjectId === subject.id)
      .reduce((sum, b) => sum + Number(b.durationMinutes || 0), 0);
    return { ...subject, minutes };
  });

  const syllabusProgress = subjects.map((subject) => {
    const items = subject.syllabus || [];
    const mastered = items.filter((i) => i.status === 'exam-ready').length;
    const learning = items.filter((i) => i.status === 'learning').length;
    return {
      id: subject.id,
      name: subject.name,
      total: items.length,
      mastered,
      learning,
    };
  });

  const iaTasks = tasks.filter((t) => t.type === 'IA');
  const eeTasks = tasks.filter((t) => t.type === 'EE');

  function completionRate(list) {
    if (list.length === 0) return 0;
    const done = list.filter((t) => t.status === 'done').length;
    return Math.round((done / list.length) * 100);
  }

  const weakest = {};
  sessions.forEach((session) => {
    (session.errors || []).forEach((error) => {
      const key = error.topic?.trim();
      if (!key) return;
      weakest[key] = (weakest[key] || 0) + 1;
    });
  });
  const weakTopics = Object.entries(weakest)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Progress Analytics</h2>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Time Spent Per Subject</h3>
          {timeBySubject.length === 0 ? (
            <p className="empty-hint">Log study blocks to see time tracking.</p>
          ) : (
            timeBySubject.map((subject) => (
              <div key={subject.id} className="analytics-row">
                <span>{subject.name}</span>
                <span className="item-meta">{formatMinutes(subject.minutes)}</span>
              </div>
            ))
          )}
        </div>

        <div className="analytics-card">
          <h3>Topics Completed vs Remaining</h3>
          {syllabusProgress.length === 0 ? (
            <p className="empty-hint">Add subjects to track syllabus progress.</p>
          ) : (
            syllabusProgress.map((subject) => {
              const completed = subject.mastered;
              const total = subject.total || 1;
              const percent = Math.round((completed / total) * 100);
              return (
                <div key={subject.id} className="analytics-row column">
                  <div className="analytics-row">
                    <span>{subject.name}</span>
                    <span className="item-meta">
                      {completed}/{subject.total || 0} exam-ready
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="item-meta">
                    {subject.learning} learning • {subject.total - completed - subject.learning}{' '}
                    not started
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="analytics-card">
          <h3>IA / EE Completion</h3>
          <div className="analytics-row">
            <span>Internal Assessments</span>
            <span className="item-meta">{completionRate(iaTasks)}%</span>
          </div>
          <div className="analytics-row">
            <span>Extended Essay</span>
            <span className="item-meta">{completionRate(eeTasks)}%</span>
          </div>
          {(iaTasks.length === 0 && eeTasks.length === 0) && (
            <p className="empty-hint">Add IA/EE tasks to track completion.</p>
          )}
        </div>

        <div className="analytics-card">
          <h3>Weakest Areas</h3>
          {weakTopics.length === 0 ? (
            <p className="empty-hint">Log past paper errors to see weak topics.</p>
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
    </div>
  );
}
