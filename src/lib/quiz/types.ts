/** 보기 번호. 파일의 correctAnswer와 같은 1부터 시작하는 번호입니다. */
export type ChoiceNumber = 1 | 2 | 3 | 4;

/** 문제지 파일(JSON)의 문항 하나 */
export type Question = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: ChoiceNumber;
  explanation: string;
};

/** question-papers 폴더의 문제지 파일 하나 */
export type QuestionPaper = {
  /** 확장자를 뺀 파일 이름. 목록에서 문제지를 구분하는 데만 씁니다. */
  id: string;
  title: string;
  questions: Question[];
};

/** 이용자가 고른 답. 아직 고르지 않았으면 null */
export type Answer = ChoiceNumber | null;
