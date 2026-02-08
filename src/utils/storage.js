const STORAGE_KEYS = {
  DECKS: 'flashcards_decks',
  STUDY_GUIDES: 'flashcards_study_guides',
  PRACTICE_TESTS: 'flashcards_practice_tests',
  SUBJECTS: 'ib_subjects',
  TASKS: 'ib_tasks',
  PAST_PAPER_SESSIONS: 'ib_past_paper_sessions',
  STUDY_BLOCKS: 'ib_study_blocks',
  STUDY_GOALS: 'ib_study_goals',
  IA_PROJECTS: 'ib_ia_projects',
  EE_PROJECT: 'ib_ee_project',
};

function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateId() {
  return crypto.randomUUID();
}

// --- Decks & Cards ---

export function getDecks() {
  return load(STORAGE_KEYS.DECKS);
}

export function getDeck(id) {
  return getDecks().find((d) => d.id === id) || null;
}

export function saveDeck(deck) {
  const decks = getDecks();
  const index = decks.findIndex((d) => d.id === deck.id);
  if (index >= 0) {
    decks[index] = { ...deck, updatedAt: new Date().toISOString() };
  } else {
    decks.push({
      ...deck,
      id: deck.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.DECKS, decks);
  return decks;
}

export function deleteDeck(id) {
  const decks = getDecks().filter((d) => d.id !== id);
  save(STORAGE_KEYS.DECKS, decks);
  return decks;
}

// --- Study Guides ---

export function getStudyGuides() {
  return load(STORAGE_KEYS.STUDY_GUIDES);
}

export function getStudyGuide(id) {
  return getStudyGuides().find((g) => g.id === id) || null;
}

export function saveStudyGuide(guide) {
  const guides = getStudyGuides();
  const index = guides.findIndex((g) => g.id === guide.id);
  if (index >= 0) {
    guides[index] = { ...guide, updatedAt: new Date().toISOString() };
  } else {
    guides.push({
      ...guide,
      id: guide.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.STUDY_GUIDES, guides);
  return guides;
}

export function deleteStudyGuide(id) {
  const guides = getStudyGuides().filter((g) => g.id !== id);
  save(STORAGE_KEYS.STUDY_GUIDES, guides);
  return guides;
}

// --- Practice Tests ---

export function getPracticeTests() {
  return load(STORAGE_KEYS.PRACTICE_TESTS);
}

export function getPracticeTest(id) {
  return getPracticeTests().find((t) => t.id === id) || null;
}

export function savePracticeTest(test) {
  const tests = getPracticeTests();
  const index = tests.findIndex((t) => t.id === test.id);
  if (index >= 0) {
    tests[index] = { ...test, updatedAt: new Date().toISOString() };
  } else {
    tests.push({
      ...test,
      id: test.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.PRACTICE_TESTS, tests);
  return tests;
}

export function deletePracticeTest(id) {
  const tests = getPracticeTests().filter((t) => t.id !== id);
  save(STORAGE_KEYS.PRACTICE_TESTS, tests);
  return tests;
}

// --- IB Subjects ---

export function getSubjects() {
  return load(STORAGE_KEYS.SUBJECTS);
}

export function getSubject(id) {
  return getSubjects().find((s) => s.id === id) || null;
}

export function saveSubject(subject) {
  const subjects = getSubjects();
  const index = subjects.findIndex((s) => s.id === subject.id);
  if (index >= 0) {
    subjects[index] = { ...subject, updatedAt: new Date().toISOString() };
  } else {
    subjects.push({
      ...subject,
      id: subject.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.SUBJECTS, subjects);
  return subjects;
}

export function deleteSubject(id) {
  const subjects = getSubjects().filter((s) => s.id !== id);
  save(STORAGE_KEYS.SUBJECTS, subjects);
  return subjects;
}

// --- IB Tasks / Deadlines ---

export function getTasks() {
  return load(STORAGE_KEYS.TASKS);
}

export function getTask(id) {
  return getTasks().find((t) => t.id === id) || null;
}

export function saveTask(task) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    tasks[index] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.push({
      ...task,
      id: task.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.TASKS, tasks);
  return tasks;
}

export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  save(STORAGE_KEYS.TASKS, tasks);
  return tasks;
}

// --- Past Paper Practice ---

export function getPastPaperSessions() {
  return load(STORAGE_KEYS.PAST_PAPER_SESSIONS);
}

export function getPastPaperSession(id) {
  return getPastPaperSessions().find((s) => s.id === id) || null;
}

export function savePastPaperSession(session) {
  const sessions = getPastPaperSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = { ...session, updatedAt: new Date().toISOString() };
  } else {
    sessions.push({
      ...session,
      id: session.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.PAST_PAPER_SESSIONS, sessions);
  return sessions;
}

export function deletePastPaperSession(id) {
  const sessions = getPastPaperSessions().filter((s) => s.id !== id);
  save(STORAGE_KEYS.PAST_PAPER_SESSIONS, sessions);
  return sessions;
}

// --- Study Planner ---

export function getStudyBlocks() {
  return load(STORAGE_KEYS.STUDY_BLOCKS);
}

export function saveStudyBlock(block) {
  const blocks = getStudyBlocks();
  const index = blocks.findIndex((b) => b.id === block.id);
  if (index >= 0) {
    blocks[index] = { ...block, updatedAt: new Date().toISOString() };
  } else {
    blocks.push({
      ...block,
      id: block.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.STUDY_BLOCKS, blocks);
  return blocks;
}

export function deleteStudyBlock(id) {
  const blocks = getStudyBlocks().filter((b) => b.id !== id);
  save(STORAGE_KEYS.STUDY_BLOCKS, blocks);
  return blocks;
}

export function getStudyGoals() {
  return load(STORAGE_KEYS.STUDY_GOALS);
}

export function saveStudyGoal(goal) {
  const goals = getStudyGoals();
  const index = goals.findIndex((g) => g.id === goal.id);
  if (index >= 0) {
    goals[index] = { ...goal, updatedAt: new Date().toISOString() };
  } else {
    goals.push({
      ...goal,
      id: goal.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.STUDY_GOALS, goals);
  return goals;
}

export function deleteStudyGoal(id) {
  const goals = getStudyGoals().filter((g) => g.id !== id);
  save(STORAGE_KEYS.STUDY_GOALS, goals);
  return goals;
}

// --- IA Manager ---

export function getIAProjects() {
  return load(STORAGE_KEYS.IA_PROJECTS);
}

export function saveIAProject(project) {
  const projects = getIAProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push({
      ...project,
      id: project.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  save(STORAGE_KEYS.IA_PROJECTS, projects);
  return projects;
}

export function deleteIAProject(id) {
  const projects = getIAProjects().filter((p) => p.id !== id);
  save(STORAGE_KEYS.IA_PROJECTS, projects);
  return projects;
}

// --- Extended Essay ---

export function getEEProject() {
  return load(STORAGE_KEYS.EE_PROJECT)[0] || null;
}

export function saveEEProject(project) {
  const payload = {
    ...project,
    updatedAt: new Date().toISOString(),
  };
  if (!project.createdAt) {
    payload.createdAt = new Date().toISOString();
  }
  save(STORAGE_KEYS.EE_PROJECT, [payload]);
  return payload;
}
