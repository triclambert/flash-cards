import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TERMS = [
  {
    term: 'Analyze',
    definition: 'Break down in order to bring out the essential elements or structure.',
    marks: '6–12',
    starters: ['This suggests...', 'The key components are...', 'The relationship shows...'],
  },
  {
    term: 'Discuss',
    definition: 'Offer a considered and balanced review, including a range of arguments.',
    marks: '8–15',
    starters: [
      'On one hand...',
      'A contrasting view is...',
      'Overall, the evidence indicates...',
    ],
  },
  {
    term: 'Evaluate',
    definition: 'Make an appraisal by weighing strengths and limitations.',
    marks: '8–15',
    starters: [
      'A major strength is...',
      'A limitation is...',
      'Therefore, the most reasonable conclusion is...',
    ],
  },
  {
    term: 'Compare',
    definition: 'Give an account of similarities between two (or more) items.',
    marks: '4–8',
    starters: ['Both show...', 'Similarly...', 'In both cases...'],
  },
  {
    term: 'Contrast',
    definition: 'Give an account of the differences between two (or more) items.',
    marks: '4–8',
    starters: ['In contrast...', 'Unlike...', 'A key difference is...'],
  },
  {
    term: 'Explain',
    definition: 'Give a detailed account including reasons or causes.',
    marks: '6–10',
    starters: ['This occurs because...', 'The mechanism involves...', 'As a result...'],
  },
  {
    term: 'Describe',
    definition: 'Give a detailed account.',
    marks: '2–6',
    starters: ['First...', 'The main features are...', 'It consists of...'],
  },
  {
    term: 'Outline',
    definition: 'Give a brief account or summary.',
    marks: '2–4',
    starters: ['In summary...', 'The main idea is...', 'Overall...'],
  },
  {
    term: 'Justify',
    definition: 'Give valid reasons or evidence to support an answer or conclusion.',
    marks: '4–8',
    starters: ['This is supported by...', 'Evidence for this is...', 'Therefore...'],
  },
  {
    term: 'To what extent',
    definition: 'Consider the merits or otherwise of an argument or concept.',
    marks: '10–20',
    starters: [
      'To a large extent...',
      'However, this is limited by...',
      'In conclusion...',
    ],
  },
];

export default function CommandTerms() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return TERMS;
    const q = query.toLowerCase();
    return TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.starters.some((s) => s.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Command Term Reference</h2>
      </div>

      <div className="form-group">
        <label>Search terms</label>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search analyze, evaluate, discuss..."
        />
      </div>

      <div className="term-grid">
        {filtered.map((term) => (
          <div key={term.term} className="term-card">
            <div className="term-header">
              <h3>{term.term}</h3>
              <span className="term-marks">{term.marks} marks</span>
            </div>
            <p className="term-definition">{term.definition}</p>
            <div className="term-starters">
              {term.starters.map((starter) => (
                <span key={starter} className="starter-pill">
                  {starter}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
