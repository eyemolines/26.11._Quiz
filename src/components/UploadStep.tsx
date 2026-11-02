"use client";

import { useState } from "react";
import { parseQuizFile } from "@/lib/quiz/parseQuizFile";
import type { Question } from "@/lib/quiz/types";

type Props = {
  onLoaded: (questions: Question[], fileName: string) => void;
};

export default function UploadStep({ onLoaded }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 고친 뒤 다시 골라도 동작하도록 선택을 비웁니다.
    event.target.value = "";
    if (!file) return;

    let text: string;
    try {
      text = await file.text();
    } catch {
      setErrors(["파일을 읽지 못했습니다. 다시 골라 주세요."]);
      return;
    }

    const result = parseQuizFile(text);
    if (result.ok) {
      setErrors([]);
      onLoaded(result.questions, file.name);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <section className="card">
      <h2>문제 파일을 올려 주세요</h2>
      <p className="muted">
        선생님께 받은 JSON 문제 파일을 고르면 문제풀이를 시작할 수 있습니다.
      </p>
      <label className="button primary file-button">
        문제 파일 고르기
        <input type="file" accept=".json,application/json" onChange={handleFile} />
      </label>

      {errors.length > 0 && (
        <div className="error-box" role="alert">
          <p className="error-title">이 파일로는 문제를 풀 수 없습니다.</p>
          <ul>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
          <p>파일을 고친 뒤 다시 올려 주세요.</p>
        </div>
      )}
    </section>
  );
}
