import type { Answer, ChoiceNumber, Question } from "@/lib/quiz/types";

type Props = {
  question: Question;
  number: number;
  total: number;
  chosen: Answer;
  onChoose: (choice: ChoiceNumber) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function QuestionStep({ question, number, total, chosen, onChoose, onPrev, onNext }: Props) {
  const isLast = number === total;

  return (
    <section className="card">
      <p className="progress">
        {number} / {total}
      </p>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={number}
      >
        <div style={{ width: `${(number / total) * 100}%` }} />
      </div>

      <fieldset className="question">
        <legend>
          {number}. {question.question}
        </legend>
        {question.options.map((option, i) => {
          const choice = (i + 1) as ChoiceNumber;
          return (
            <label key={choice} className={`option${chosen === choice ? " selected" : ""}`}>
              <input
                type="radio"
                name={`question-${number}`}
                checked={chosen === choice}
                onChange={() => onChoose(choice)}
              />
              <span className="option-number">{choice}</span>
              <span>{option}</span>
            </label>
          );
        })}
      </fieldset>

      {chosen === null && <p className="muted hint">보기 중 하나를 골라 주세요.</p>}

      <div className="actions">
        <button type="button" className="button" onClick={onPrev} disabled={number === 1}>
          이전
        </button>
        <button type="button" className="button primary" onClick={onNext} disabled={chosen === null}>
          {isLast ? "채점하기" : "다음"}
        </button>
      </div>
    </section>
  );
}
