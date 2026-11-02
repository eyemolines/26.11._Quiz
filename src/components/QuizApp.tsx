"use client";

import { useEffect, useState } from "react";
import type { BrokenPaper } from "@/lib/quiz/loadQuestionPapers";
import type { Answer, ChoiceNumber, QuestionPaper } from "@/lib/quiz/types";
import PaperListStep from "@/components/PaperListStep";
import ReadyStep from "@/components/ReadyStep";
import QuestionStep from "@/components/QuestionStep";
import ResultStep from "@/components/ResultStep";

/** 화면 단계: 문제지 고르기 → 문항 확인 → 풀이 → 결과 */
type Stage = "list" | "ready" | "solving" | "result";

type Props = {
  papers: QuestionPaper[];
  broken: BrokenPaper[];
};

export default function QuizApp({ papers, broken }: Props) {
  const [stage, setStage] = useState<Stage>("list");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [index, setIndex] = useState(0);

  // 단계나 문항이 바뀌면 화면 맨 위부터 보이게 합니다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage, index]);

  const questions = paper?.questions ?? [];

  function handleSelect(selected: QuestionPaper) {
    setPaper(selected);
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
      {stage === "list" && <PaperListStep papers={papers} broken={broken} onSelect={handleSelect} />}
      {stage === "ready" && paper && (
        <ReadyStep
          title={paper.title}
          count={questions.length}
          onStart={handleStart}
          onChooseAnother={() => setStage("list")}
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
      {stage === "result" && paper && (
        <ResultStep title={paper.title} questions={questions} answers={answers} />
      )}
    </main>
  );
}
