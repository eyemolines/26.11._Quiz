import { describe, expect, it } from "vitest";
import { buildPaperList, loadQuestionPapers } from "./loadQuestionPapers";

const validQuestion = {
  question: "1 + 1은?",
  options: ["1", "2", "3", "4"],
  correctAnswer: 2,
  explanation: "1 더하기 1은 2입니다.",
};

describe("loadQuestionPapers", () => {
  it("question-papers 폴더의 문제지를 파일 이름 순서로 읽고 title을 가져온다", async () => {
    const { papers, broken } = await loadQuestionPapers();
    expect(broken).toEqual([]);
    expect(papers.map((p) => [p.id, p.title, p.questions.length])).toEqual([
      ["high-school-questions", "고등학교 정보과목", 10],
      ["sample-questions", "중학교 정보과목", 10],
    ]);
    expect(papers[0].questions[0].question).toBe("2진수 1101을 10진수로 나타내면 얼마인가요?");
    expect(papers[1].questions[0].question).toContain("글자를 입력할 때");
  });
});

describe("buildPaperList", () => {
  it("형식이 맞지 않는 파일과 .json이 아닌 파일은 목록에서 뺀다", () => {
    const { papers, broken } = buildPaperList([
      { fileName: "b.json", text: JSON.stringify({ title: "B", questions: [validQuestion] }) },
      { fileName: "a.json", text: JSON.stringify({ title: "A", questions: [validQuestion] }) },
      { fileName: "broken.json", text: JSON.stringify({ questions: [validQuestion] }) },
      { fileName: "memo.txt", text: "문제지가 아닙니다" },
    ]);
    expect(papers.map((p) => p.title)).toEqual(["A", "B"]);
    expect(broken).toEqual([{ fileName: "broken.json", errors: ["문제지 제목(title)이 없습니다."] }]);
  });
});
