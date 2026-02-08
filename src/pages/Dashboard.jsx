import { Link } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  ClipboardList,
  Plus,
  CalendarCheck,
  Timer,
  FileText,
  Lightbulb,
  Leaf,
} from 'lucide-react';
import {
  getDecks,
  getStudyGuides,
  getPracticeTests,
  getSubjects,
  getTasks,
} from '../utils/storage';

export default function Dashboard() {
  const decks = getDecks();
  const guides = getStudyGuides();
  const tests = getPracticeTests();
  const subjects = getSubjects();
  const tasks = getTasks();

  const totalCards = decks.reduce((sum, d) => sum + (d.cards?.length || 0), 0);

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  function getNextDeadline(task) {
    const candidates = [
      task.schoolDeadline ? { type: 'School', date: new Date(task.schoolDeadline) } : null,
      task.ibDeadline ? { type: 'IB', date: new Date(task.ibDeadline) } : null,
    ].filter(Boolean);
    if (candidates.length === 0) return null;
    return candidates.reduce((min, item) => (item.date < min.date ? item : min));
  }

  const todaysTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const date = new Date(t.dueDate);
    return date >= todayStart && date <= todayEnd && t.status !== 'done';
  });

  const upcoming = tasks
    .map((t) => ({ task: t, deadline: getNextDeadline(t) }))
    .filter((t) => t.deadline);

  const inNextDays = (days) => {
    const end = new Date(todayStart);
    end.setDate(end.getDate() + days);
    return upcoming
      .filter((item) => item.deadline.date >= todayStart && item.deadline.date <= end)
      .sort((a, b) => a.deadline.date - b.deadline.date);
  };

  const upcoming7 = inNextDays(7);
  const upcoming30 = inNextDays(30).filter(
    (item) => item.deadline.date > new Date(todayStart.getTime() + 7 * 86400000)
  );

  const subjectProgress = subjects.map((subject) => {
    const items = subject.syllabus || [];
    if (items.length === 0) return { ...subject, percent: 0 };
    const mastered = items.filter((i) => i.status === 'exam-ready').length;
    const learning = items.filter((i) => i.status === 'learning').length;
    const percent = Math.round(((mastered + learning * 0.5) / items.length) * 100);
    return { ...subject, percent };
  });

  const subjectById = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <h2>IB Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <Layers size={32} />
          <div>
            <h3>{decks.length}</h3>
            <p>Card Decks</p>
            <span className="stat-sub">{totalCards} total cards</span>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen size={32} />
          <div>
            <h3>{guides.length}</h3>
            <p>Study Guides</p>
          </div>
        </div>
        <div className="stat-card">
          <ClipboardList size={32} />
          <div>
            <h3>{tests.length}</h3>
            <p>Practice Tests</p>
          </div>
        </div>
      </div>

      <h3 className="section-title">Today’s Tasks</h3>
      {todaysTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks due today.</p>
        </div>
      ) : (
        <div className="item-list">
          {todaysTasks.map((task) => (
            <div key={task.id} className="item-row">
              <span className="item-name">{task.title}</span>
              <span className="item-meta">{formatDate(task.dueDate)}</span>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-title">Upcoming Deadlines</h3>
      <div className="deadline-grid">
        <div className="deadline-panel">
          <div className="deadline-header">
            <Timer size={18} />
            <span>Next 7 Days</span>
          </div>
          {upcoming7.length === 0 ? (
            <p className="empty-hint">No deadlines in the next 7 days.</p>
          ) : (
            upcoming7.map(({ task, deadline }) => (
              <div key={`${task.id}-7`} className="deadline-row">
                <div>
                  <p className="deadline-title">{task.title}</p>
                  <span className="deadline-meta">
                    {subjectById[task.subjectId]?.name || task.subjectName || 'General'} •{' '}
                    {deadline.type}
                  </span>
                </div>
                <span className="deadline-date">{formatDate(deadline.date)}</span>
              </div>
            ))
          )}
        </div>
        <div className="deadline-panel">
          <div className="deadline-header">
            <CalendarCheck size={18} />
            <span>Next 30 Days</span>
          </div>
          {upcoming30.length === 0 ? (
            <p className="empty-hint">No deadlines in days 8–30.</p>
          ) : (
            upcoming30.map(({ task, deadline }) => (
              <div key={`${task.id}-30`} className="deadline-row">
                <div>
                  <p className="deadline-title">{task.title}</p>
                  <span className="deadline-meta">
                    {subjectById[task.subjectId]?.name || task.subjectName || 'General'} •{' '}
                    {deadline.type}
                  </span>
                </div>
                <span className="deadline-date">{formatDate(deadline.date)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <h3 className="section-title">Progress By Subject</h3>
      {subjectProgress.length === 0 ? (
        <div className="empty-state">
          <p>Add subjects to see progress here.</p>
        </div>
      ) : (
        <div className="progress-grid">
          {subjectProgress.map((subject) => (
            <div key={subject.id} className="progress-card">
              <div className="progress-header">
                <div>
                  <h4>{subject.name}</h4>
                  <span className="item-meta">{subject.level || 'HL/SL'}</span>
                </div>
                <span className="progress-percent">{subject.percent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${subject.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-title">Quick Links</h3>
      <div className="quick-actions">
        <Link to="/ia" className="action-card">
          <FileText size={20} />
          IAs
        </Link>
        <Link to="/ee" className="action-card">
          <FileText size={20} />
          Extended Essay
        </Link>
        <Link to="/tok" className="action-card">
          <Lightbulb size={20} />
          TOK
        </Link>
        <Link to="/cas" className="action-card">
          <Leaf size={20} />
          CAS
        </Link>
        <Link to="/decks/new" className="action-card">
          <Plus size={20} />
          New Card Deck
        </Link>
        <Link to="/guides/new" className="action-card">
          <Plus size={20} />
          New Study Guide
        </Link>
        <Link to="/tests/new" className="action-card">
          <Plus size={20} />
          New Practice Test
        </Link>
      </div>

      {decks.length > 0 && (
        <>
          <h3 className="section-title">Recent Decks</h3>
          <div className="item-list">
            {decks.slice(0, 5).map((deck) => (
              <Link key={deck.id} to={`/decks/${deck.id}`} className="item-row">
                <span className="item-name">{deck.name}</span>
                <span className="item-meta">{deck.cards?.length || 0} cards</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
