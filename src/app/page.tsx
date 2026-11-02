import QuizApp from "@/components/QuizApp";
import { loadQuestionPapers } from "@/lib/quiz/loadQuestionPapers";

export default async function Home() {
  const { papers, broken } = await loadQuestionPapers();
  return <QuizApp papers={papers} broken={broken} />;
}
