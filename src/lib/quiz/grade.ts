import type { Answer, Question } from "./types";

export type GradedItem = {
  question: Question;
  chosen: Answer;
  isCorrect: boolean;
};

export type GradeResult = {
  total: number;
  correctCount: number;
  /** 0~100점. 정답 수 ÷ 전체 문항 수 × 100 */
  score: number;
  items: GradedItem[];
};

/** 파일에 들어 있는 정답(correctAnswer)으로 모든 문항을 한 번에 채점합니다. */
export function grade(questions: Question[], answers: Answer[]): GradeResult {
  const items = questions.map((question, i) => {
    const chosen = answers[i] ?? null;
    return { question, chosen, isCorrect: chosen === question.correctAnswer };
  });
  const correctCount = items.filter((item) => item.isCorrect).length;
  const total = questions.length;
  return {
    total,
    correctCount,
    score: total === 0 ? 0 : (correctCount / total) * 100,
    items,
  };
}

/** 점수를 소수점 둘째 자리까지 표시합니다. 66.666… → "66.67", 80 → "80" */
export function formatScore(score: number): string {
  return String(Math.round(score * 100) / 100);
}
