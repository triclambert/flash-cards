import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { getPracticeTest, savePracticeTest } from '../utils/storage';

export default function TestTaker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = getPracticeTest(id);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  if (!test || !test.questions?.length) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => navigate('/tests')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="empty-state">
          <p>This test has no questions.</p>
        </div>
      </div>
    );
  }

  function setAnswer(qId, value) {
    setAnswers({ ...answers, [qId]: value });
  }

  function handleSubmit() {
    let correct = 0;
    test.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple-choice') {
        if (userAnswer === q.correctAnswer) correct++;
      } else if (q.type === 'true-false') {
        if (userAnswer === q.correctAnswer) correct++;
      } else if (q.type === 'short-answer') {
        if (
          typeof userAnswer === 'string' &&
          userAnswer.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
        ) {
          correct++;
        }
      }
    });

    const pct = Math.round((correct / test.questions.length) * 100);
    setScore({ correct, total: test.questions.length, percentage: pct });
    setSubmitted(true);

    savePracticeTest({ ...test, lastScore: pct });
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }

  function isCorrect(q) {
    const userAnswer = answers[q.id];
    if (q.type === 'multiple-choice') return userAnswer === q.correctAnswer;
    if (q.type === 'true-false') return userAnswer === q.correctAnswer;
    if (q.type === 'short-answer')
      return (
        typeof userAnswer === 'string' &&
        userAnswer.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
      );
    return false;
  }

  return (
    <div className="page test-page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/tests')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>{test.title}</h2>
      </div>

      {submitted && score && (
        <div className={`score-banner ${score.percentage >= 70 ? 'score-pass' : 'score-fail'}`}>
          <h3>
            Score: {score.correct}/{score.total} ({score.percentage}%)
          </h3>
          <p>{score.percentage >= 70 ? 'Great job!' : 'Keep studying, you\'ll get there!'}</p>
          <button className="btn btn-primary" onClick={handleRetake}>
            <RotateCcw size={18} /> Retake Test
          </button>
        </div>
      )}

      <div className="test-questions">
        {test.questions.map((q, qIndex) => (
          <div
            key={q.id}
            className={`test-question ${
              submitted ? (isCorrect(q) ? 'q-correct' : 'q-incorrect') : ''
            }`}
          >
            <div className="question-header">
              <span className="q-number">Q{qIndex + 1}.</span>
              <p className="q-text">{q.question}</p>
              {submitted && (
                <span className="q-result-icon">
                  {isCorrect(q) ? (
                    <CheckCircle size={20} className="icon-success" />
                  ) : (
                    <XCircle size={20} className="icon-danger" />
                  )}
                </span>
              )}
            </div>

            {q.type === 'multiple-choice' && (
              <div className="test-options">
                {q.options.map((opt, optIndex) => (
                  <label
                    key={optIndex}
                    className={`test-option ${
                      submitted && optIndex === q.correctAnswer ? 'option-correct' : ''
                    } ${
                      submitted && answers[q.id] === optIndex && optIndex !== q.correctAnswer
                        ? 'option-wrong'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === optIndex}
                      onChange={() => setAnswer(q.id, optIndex)}
                      disabled={submitted}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'true-false' && (
              <div className="test-options tf-test-options">
                {['true', 'false'].map((val) => (
                  <label
                    key={val}
                    className={`test-option ${
                      submitted && val === q.correctAnswer ? 'option-correct' : ''
                    } ${
                      submitted && answers[q.id] === val && val !== q.correctAnswer
                        ? 'option-wrong'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === val}
                      onChange={() => setAnswer(q.id, val)}
                      disabled={submitted}
                    />
                    <span>{val.charAt(0).toUpperCase() + val.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'short-answer' && (
              <div className="short-answer-input">
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="Type your answer"
                  className="input"
                  disabled={submitted}
                />
                {submitted && !isCorrect(q) && (
                  <p className="correct-answer-hint">
                    Correct answer: {q.correctAnswer}
                  </p>
                )}
              </div>
            )}

            {submitted && q.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="form-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Submit Test
          </button>
        </div>
      )}
    </div>
  );
}
