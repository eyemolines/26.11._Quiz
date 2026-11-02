import { describe, expect, it } from "vitest";
import { formatScore, grade } from "./grade";
import type { Question } from "./types";

function makeQuestion(correctAnswer: Question["correctAnswer"]): Question {
  return { question: "문제", options: ["가", "나", "다", "라"], correctAnswer, explanation: "해설" };
}

describe("grade", () => {
  it("파일의 정답 번호(1부터 시작)로 채점한다", () => {
    const questions = [makeQuestion(1), makeQuestion(4)];
    const result = grade(questions, [1, 3]);
    expect(result.correctCount).toBe(1);
    expect(result.items.map((i) => i.isCorrect)).toEqual([true, false]);
    expect(result.score).toBe(50);
  });

  it("3문항 중 2개 정답이면 66.67점으로 표시한다", () => {
    const result = grade([makeQuestion(1), makeQuestion(2), makeQuestion(3)], [1, 2, 4]);
    expect(formatScore(result.score)).toBe("66.67");
  });

  it("모두 맞히면 100점, 모두 틀리면 0점", () => {
    const questions = [makeQuestion(2), makeQuestion(3)];
    expect(grade(questions, [2, 3]).score).toBe(100);
    expect(grade(questions, [1, 1]).score).toBe(0);
  });

  it("고르지 않은 문항은 오답으로 처리한다", () => {
    expect(grade([makeQuestion(2)], [null]).items[0].isCorrect).toBe(false);
  });
});

describe("formatScore", () => {
  it("딱 떨어지면 소수점 없이, 아니면 둘째 자리까지 표시한다", () => {
    expect(formatScore(80)).toBe("80");
    expect(formatScore(12.5)).toBe("12.5");
    expect(formatScore(100 / 3)).toBe("33.33");
    expect(formatScore(200 / 3)).toBe("66.67");
  });
});
