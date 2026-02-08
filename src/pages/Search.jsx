import { useMemo, useState } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getDecks,
  getStudyGuides,
  getPracticeTests,
  getTasks,
  getSubjects,
  getIAProjects,
  getEEProject,
  getTOKWorkspace,
  getCASLogs,
  getPastPaperSessions,
} from '../utils/storage';

const TYPES = [
  'All',
  'Decks',
  'Cards',
  'Guides',
  'Tests',
  'Tasks',
  'Subjects',
  'IA',
  'EE',
  'TOK',
  'CAS',
  'Past Papers',
];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const decks = getDecks();
  const guides = getStudyGuides();
  const tests = getPracticeTests();
  const tasks = getTasks();
  const subjects = getSubjects();
  const iaProjects = getIAProjects();
  const eeProject = getEEProject();
  const tokWorkspace = getTOKWorkspace();
  const casLogs = getCASLogs();
  const pastPapers = getPastPaperSessions();

  const subjectOptions = subjects.map((s) => ({ id: s.id, name: s.name }));
  const tagOptions = Array.from(
    new Set(
      decks.flatMap((deck) =>
        (deck.cards || []).flatMap((card) =>
          Array.isArray(card.tags) ? card.tags : []
        )
      )
    )
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesQuery = (text) => !q || text.toLowerCase().includes(q);

    const out = [];

    decks.forEach((deck) => {
      if (matchesQuery(deck.name || '') || matchesQuery(deck.description || '')) {
        out.push({
          id: deck.id,
          type: 'Decks',
          title: deck.name,
          subtitle: `${deck.cards?.length || 0} cards`,
          link: `/decks/${deck.id}`,
        });
      }
      (deck.cards || []).forEach((card) => {
        const cardText = `${card.front || ''} ${card.back || ''}`.toLowerCase();
        const tags = Array.isArray(card.tags) ? card.tags : [];
        if (!matchesQuery(cardText)) return;
        if (tagFilter && !tags.includes(tagFilter)) return;
        out.push({
          id: card.id,
          type: 'Cards',
          title: card.front || 'Card',
          subtitle: deck.name,
          link: `/decks/${deck.id}`,
          tags,
        });
      });
    });

    guides.forEach((guide) => {
      const content = `${guide.title || ''} ${(guide.sections || [])
        .map((s) => s.heading || '')
        .join(' ')}`;
      if (!matchesQuery(content)) return;
      out.push({
        id: guide.id,
        type: 'Guides',
        title: guide.title,
        subtitle: `${guide.sections?.length || 0} sections`,
        link: `/guides/${guide.id}`,
      });
    });

    tests.forEach((test) => {
      const content = `${test.title || ''} ${(test.questions || [])
        .map((q2) => q2.question || '')
        .join(' ')}`;
      if (!matchesQuery(content)) return;
      out.push({
        id: test.id,
        type: 'Tests',
        title: test.title,
        subtitle: `${test.questions?.length || 0} questions`,
        link: `/tests/${test.id}`,
      });
    });

    tasks.forEach((task) => {
      const subjectName =
        subjectOptions.find((s) => s.id === task.subjectId)?.name ||
        task.subjectName ||
        'General';
      const content = `${task.title || ''} ${task.type || ''} ${subjectName}`;
      if (!matchesQuery(content)) return;
      if (assessmentFilter && task.type !== assessmentFilter) return;
      out.push({
        id: task.id,
        type: 'Tasks',
        title: task.title,
        subtitle: `${task.type || 'Task'} • ${subjectName}`,
        link: '/tasks',
      });
    });

    subjects.forEach((subject) => {
      if (!matchesQuery(subject.name || '')) return;
      if (subjectFilter && subject.id !== subjectFilter) return;
      out.push({
        id: subject.id,
        type: 'Subjects',
        title: subject.name,
        subtitle: subject.level || 'HL/SL',
        link: `/subjects/${subject.id}`,
      });
    });

    iaProjects.forEach((project) => {
      const subjectName =
        subjectOptions.find((s) => s.id === project.subjectId)?.name ||
        project.subjectName ||
        'IA';
      const content = `${subjectName} ${project.researchQuestion || ''}`;
      if (!matchesQuery(content)) return;
      out.push({
        id: project.id,
        type: 'IA',
        title: subjectName,
        subtitle: project.researchQuestion,
        link: '/ia',
      });
    });

    if (eeProject) {
      const content = `${eeProject.subject || ''} ${eeProject.researchQuestion || ''}`;
      if (matchesQuery(content)) {
        out.push({
          id: eeProject.id || 'ee',
          type: 'EE',
          title: eeProject.subject || 'Extended Essay',
          subtitle: eeProject.researchQuestion,
          link: '/ee',
        });
      }
    }

    if (tokWorkspace) {
      const content = `${tokWorkspace.essayTitle || ''} ${(tokWorkspace.objects || [])
        .map((o) => o.title || '')
        .join(' ')}`;
      if (matchesQuery(content)) {
        out.push({
          id: tokWorkspace.id || 'tok',
          type: 'TOK',
          title: tokWorkspace.essayTitle || 'TOK Workspace',
          subtitle: `${tokWorkspace.objects?.length || 0} objects`,
          link: '/tok',
        });
      }
    }

    casLogs.forEach((log) => {
      const content = `${log.description || ''} ${log.category || ''}`;
      if (!matchesQuery(content)) return;
      out.push({
        id: log.id,
        type: 'CAS',
        title: `${log.category} • ${log.date}`,
        subtitle: log.description,
        link: '/cas',
      });
    });

    pastPapers.forEach((session) => {
      const content = `${session.topic || ''} ${session.paper || ''}`;
      if (!matchesQuery(content)) return;
      out.push({
        id: session.id,
        type: 'Past Papers',
        title: session.paper || 'Past Paper',
        subtitle: session.topic || 'General',
        link: '/past-papers',
      });
    });

    return out
      .filter((item) => typeFilter === 'All' || item.type === typeFilter)
      .filter((item) => {
        if (!subjectFilter) return true;
        if (item.type === 'Subjects') return item.id === subjectFilter;
        if (item.type === 'Tasks') return item.subtitle?.includes(
          subjectOptions.find((s) => s.id === subjectFilter)?.name || ''
        );
        return true;
      });
  }, [
    query,
    typeFilter,
    subjectFilter,
    assessmentFilter,
    tagFilter,
    decks,
    guides,
    tests,
    tasks,
    subjects,
    iaProjects,
    eeProject,
    tokWorkspace,
    casLogs,
    pastPapers,
    subjectOptions,
  ]);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Search & Tagging</h2>
      </div>

      <div className="search-bar">
        <SearchIcon size={18} />
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decks, guides, tasks, CAS logs..."
        />
      </div>

      <div className="filter-row">
        <select
          className="input"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="">All subjects</option>
          {subjectOptions.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={assessmentFilter}
          onChange={(e) => setAssessmentFilter(e.target.value)}
        >
          <option value="">Assessment type</option>
          {['IA', 'Test', 'Essay', 'CAS', 'EE', 'TOK'].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">Any tag</option>
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="task-list">
        {results.length === 0 ? (
          <div className="empty-state">
            <p>No results match your filters.</p>
          </div>
        ) : (
          results.map((item) => (
            <div key={`${item.type}-${item.id}`} className="task-row">
              <div>
                <h4>{item.title}</h4>
                <p className="task-meta">
                  {item.type} • {item.subtitle}
                </p>
                {item.tags?.length > 0 && (
                  <p className="item-meta">Tags: {item.tags.join(', ')}</p>
                )}
              </div>
              <div className="task-actions">
                <button className="btn btn-sm" onClick={() => navigate(item.link)}>
                  Open
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
