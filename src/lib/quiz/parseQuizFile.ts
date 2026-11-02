import type { ChoiceNumber, Question } from "./types";

export type ParseResult =
  | { ok: true; questions: Question[] }
  | { ok: false; errors: string[] };

/** 화면에 한꺼번에 보여줄 오류 개수. 나머지는 "외 N건"으로 묶습니다. */
const MAX_ERRORS_SHOWN = 5;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isChoiceNumber(value: unknown): value is ChoiceNumber {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

/** 한 문항의 형식 문제를 찾아 쉬운 말로 돌려줍니다. 문제가 없으면 빈 배열입니다. */
function checkQuestion(item: unknown, number: number): string[] {
  const prefix = `${number}번 문항:`;
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return [`${prefix} 문항 내용을 읽을 수 없습니다.`];
  }
  const q = item as Record<string, unknown>;
  const errors: string[] = [];

  if (!isNonEmptyString(q.question)) {
    errors.push(`${prefix} 문제 내용(question)이 없습니다.`);
  }
  if (!Array.isArray(q.options)) {
    errors.push(`${prefix} 보기 목록(options)이 없습니다.`);
  } else if (q.options.length !== 4) {
    errors.push(`${prefix} 보기가 4개가 아닙니다. (지금 ${q.options.length}개)`);
  } else if (!q.options.every(isNonEmptyString)) {
    errors.push(`${prefix} 내용이 비어 있는 보기가 있습니다.`);
  }
  if (!isChoiceNumber(q.correctAnswer)) {
    errors.push(`${prefix} 정답 번호(correctAnswer)는 1, 2, 3, 4 중 하나여야 합니다.`);
  }
  if (!isNonEmptyString(q.explanation)) {
    errors.push(`${prefix} 해설(explanation)이 없습니다.`);
  }
  return errors;
}

/**
 * 업로드한 문제 파일의 글자 내용을 읽어 문항 목록으로 바꿉니다.
 * 형식에 맞지 않는 곳이 하나라도 있으면 파일 전체를 받지 않고 이유를 알려줍니다.
 */
export function parseQuizFile(text: string): ParseResult {
  let data: unknown;
  try {
    // 메모장 등으로 저장한 파일 맨 앞에 붙는 보이지 않는 문자(BOM)를 지웁니다.
    data = JSON.parse(text.replace(/^﻿/, ""));
  } catch {
    return {
      ok: false,
      errors: ["JSON 문제 파일 형식이 아닙니다. 파일 내용이 올바른지 확인해 주세요."],
    };
  }

  if (typeof data !== "object" || data === null || !Array.isArray((data as Record<string, unknown>).questions)) {
    return { ok: false, errors: ["파일에 문제 목록(questions)이 없습니다."] };
  }

  const items = (data as { questions: unknown[] }).questions;
  if (items.length === 0) {
    return { ok: false, errors: ["파일에 문제가 하나도 없습니다."] };
  }

  const errors = items.flatMap((item, i) => checkQuestion(item, i + 1));
  if (errors.length > 0) {
    const shown = errors.slice(0, MAX_ERRORS_SHOWN);
    if (errors.length > MAX_ERRORS_SHOWN) {
      shown.push(`그 밖에 고칠 곳이 ${errors.length - MAX_ERRORS_SHOWN}군데 더 있습니다.`);
    }
    return { ok: false, errors: shown };
  }

  const questions = (items as Record<string, unknown>[]).map((q) => ({
    question: q.question as string,
    options: q.options as Question["options"],
    correctAnswer: q.correctAnswer as ChoiceNumber,
    explanation: q.explanation as string,
  }));
  return { ok: true, questions };
}
