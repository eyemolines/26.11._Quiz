"use client";

import { useEffect, useState } from "react";
import type { Answer, ChoiceNumber, Question } from "@/lib/quiz/types";
import UploadStep from "@/components/UploadStep";
import ReadyStep from "@/components/ReadyStep";
import QuestionStep from "@/components/QuestionStep";
import ResultStep from "@/components/ResultStep";

/** 화면 단계: 파일 올리기 → 문항 확인 → 풀이 → 결과 */
type Stage = "upload" | "ready" | "solving" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("upload");
  const [fileName, setFileName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [index, setIndex] = useState(0);

  // 단계나 문항이 바뀌면 화면 맨 위부터 보이게 합니다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage, index]);

  function handleLoaded(loaded: Question[], name: string) {
    setQuestions(loaded);
    setFileName(name);
    setStage("ready");
  }

  function handleStart() {
    setAnswers(questions.map(() => null));
    setIndex(0);
    setStage("solving");
  }

  function handleChoose(choice: ChoiceNumber) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? choice : a)));
  }

  function handleNext() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else if (answers.every((a) => a !== null)) {
      setStage("result");
    }
  }

  return (
    <main className="container">
      <h1 className="app-title">문제풀이</h1>
      {stage === "upload" && <UploadStep onLoaded={handleLoaded} />}
      {stage === "ready" && (
        <ReadyStep
          fileName={fileName}
          count={questions.length}
          onStart={handleStart}
          onChooseAnother={() => setStage("upload")}
        />
      )}
      {stage === "solving" && (
        <QuestionStep
          question={questions[index]}
          number={index + 1}
          total={questions.length}
          chosen={answers[index]}
          onChoose={handleChoose}
          onPrev={() => setIndex(index - 1)}
          onNext={handleNext}
        />
      )}
      {stage === "result" && <ResultStep questions={questions} answers={answers} />}
    </main>
  );
}
