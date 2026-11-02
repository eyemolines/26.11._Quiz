import { formatScore, grade } from "@/lib/quiz/grade";
import type { Answer, Question } from "@/lib/quiz/types";

type Props = {
  title: string;
  questions: Question[];
  answers: Answer[];
};

function optionText(question: Question, choice: Answer): string {
  return choice === null ? "고르지 않음" : `${choice}. ${question.options[choice - 1]}`;
}

export default function ResultStep({ title, questions, answers }: Props) {
  const result = grade(questions, answers);

  return (
    <>
      <section className="card score-card">
        <h2>채점 결과</h2>
        <p className="muted paper-name">{title}</p>
        <p className="score">{formatScore(result.score)}점</p>
        <p className="muted">
          {result.total}문제 중 {result.correctCount}문제 정답
        </p>
      </section>

      <ol className="result-list">
        {result.items.map((item, i) => (
          <li key={i} className={`card result-item ${item.isCorrect ? "correct" : "wrong"}`}>
            <p className="result-head">
              <span className="mark" aria-hidden="true">
                {item.isCorrect ? "○" : "×"}
              </span>
              <span>
                {i + 1}번 {item.isCorrect ? "정답" : "오답"}
              </span>
            </p>
            <p className="result-question">{item.question.question}</p>
            <dl>
              <dt>내가 고른 답</dt>
              <dd>{optionText(item.question, item.chosen)}</dd>
              <dt>정답</dt>
              <dd>{optionText(item.question, item.question.correctAnswer)}</dd>
              <dt>해설</dt>
              <dd>{item.question.explanation}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </>
  );
}
