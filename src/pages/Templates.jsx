import { ArrowLeft, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEMPLATES = [
  {
    title: 'Science IA Paragraph Structure',
    description: 'Clear claim → data → analysis → evaluation.',
    content:
      'Claim: State the specific trend or relationship.\nEvidence: Cite the key data point(s) or graph trend.\nAnalysis: Explain the scientific reason for the trend.\nEvaluation: Mention uncertainty, limitation, or improvement.',
  },
  {
    title: 'Humanities Essay Paragraph Structure',
    description: 'Topic sentence → evidence → analysis → link.',
    content:
      'Topic sentence: Answer the question directly.\nEvidence: Use a specific fact, quote, or source.\nAnalysis: Explain how the evidence supports the argument.\nLink: Connect back to the thesis and next point.',
  },
  {
    title: 'TOK Analysis Structure',
    description: 'Claim → justification → counterclaim → evaluation.',
    content:
      'Claim: Make a knowledge claim.\nJustification: Explain why the claim holds in a real-life context.\nCounterclaim: Present an alternative perspective.\nEvaluation: Weigh the claim vs counterclaim and conclude.',
  },
  {
    title: 'ATL Reflection Template',
    description: 'Reflection prompts using ATL language.',
    content:
      'What ATL skills did I apply?\nWhat ATL skills do I need to strengthen?\nHow did my strategies impact the outcome?\nWhat will I do differently next time?',
  },
];

export default function Templates() {
  const navigate = useNavigate();

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert('Copy failed. Select the text and copy manually.');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Essay & Paragraph Templates</h2>
      </div>

      <div className="template-grid">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.title} className="template-card">
            <div className="template-header">
              <div>
                <h3>{tpl.title}</h3>
                <p className="item-meta">{tpl.description}</p>
              </div>
              <button className="btn btn-sm" onClick={() => handleCopy(tpl.content)}>
                <Copy size={16} /> Copy
              </button>
            </div>
            <textarea className="input template-text" rows={6} defaultValue={tpl.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
