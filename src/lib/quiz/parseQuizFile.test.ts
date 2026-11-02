import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseQuizFile } from "./parseQuizFile";

const validQuestion = {
  question: "1 + 1은?",
  options: ["1", "2", "3", "4"],
  correctAnswer: 2,
  explanation: "1 더하기 1은 2입니다.",
};

function fileWith(questions: unknown[], title: unknown = "시험 문제지"): string {
  return JSON.stringify({ title, questions });
}

describe("parseQuizFile", () => {
  it("중학교 문제지의 제목과 10문항을 모두 읽는다", () => {
    const text = readFileSync(join(process.cwd(), "question-papers", "sample-questions.json"), "utf8");
    const result = parseQuizFile(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.title).toBe("중학교 정보과목");
    expect(result.questions).toHaveLength(10);
    expect(result.questions[0].correctAnswer).toBe(4);
    expect(result.questions[0].options[3]).toBe("키보드");
  });

  it("제목(title)이 없거나 비어 있으면 거부한다", () => {
    const noTitle = JSON.stringify({ questions: [validQuestion] });
    for (const text of [noTitle, ...[null, "", "   ", 3].map((title) => fileWith([validQuestion], title))]) {
      expect(parseQuizFile(text)).toEqual({ ok: false, errors: ["문제지 제목(title)이 없습니다."] });
    }
  });

  it("파일 맨 앞의 BOM 문자가 있어도 읽는다", () => {
    expect(parseQuizFile("﻿" + fileWith([validQuestion])).ok).toBe(true);
  });

  it("JSON이 아니면 거부한다", () => {
    const result = parseQuizFile("이것은 JSON이 아닙니다");
    expect(result).toEqual({ ok: false, errors: [expect.stringContaining("JSON")] });
  });

  it("questions 목록이 없거나 비어 있으면 거부한다", () => {
    expect(parseQuizFile(JSON.stringify({ items: [] })).ok).toBe(false);
    expect(parseQuizFile(JSON.stringify([validQuestion])).ok).toBe(false);
    expect(parseQuizFile(fileWith([])).ok).toBe(false);
  });

  it("보기가 4개가 아니면 몇 번 문항인지 알려준다", () => {
    const result = parseQuizFile(fileWith([validQuestion, { ...validQuestion, options: ["a", "b", "c"] }]));
    expect(result).toEqual({ ok: false, errors: ["2번 문항: 보기가 4개가 아닙니다. (지금 3개)"] });
  });

  it("정답 번호가 1~4가 아니면 거부한다", () => {
    for (const correctAnswer of [0, 5, "2", 2.5]) {
      expect(parseQuizFile(fileWith([{ ...validQuestion, correctAnswer }])).ok).toBe(false);
    }
  });

  it("빠진 항목을 모두 알려준다", () => {
    const result = parseQuizFile(fileWith([{ options: ["a", "b", "c", "d"] }]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toHaveLength(3);
    expect(result.errors.join(" ")).toMatch(/question[\s\S]*correctAnswer[\s\S]*explanation/);
  });

  it("오류가 많으면 5개만 보여주고 나머지 개수를 알려준다", () => {
    const result = parseQuizFile(fileWith(Array.from({ length: 4 }, () => ({}))));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toHaveLength(6);
    expect(result.errors[5]).toContain("11군데");
  });
});
