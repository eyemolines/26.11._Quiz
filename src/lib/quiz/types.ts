/** 보기 번호. 파일의 correctAnswer와 같은 1부터 시작하는 번호입니다. */
export type ChoiceNumber = 1 | 2 | 3 | 4;

/** 문제 파일(JSON)의 문항 하나 */
export type Question = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: ChoiceNumber;
  explanation: string;
};

/** 이용자가 고른 답. 아직 고르지 않았으면 null */
export type Answer = ChoiceNumber | null;
