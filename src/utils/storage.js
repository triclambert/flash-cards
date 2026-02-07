const STORAGE_KEYS = {
  DECKS: 'flashcards_decks',
  STUDY_GUIDES: 'flashcards_study_guides',
  PRACTICE_TESTS: 'flashcards_practice_tests',
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
