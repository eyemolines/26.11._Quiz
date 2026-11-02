import type { BrokenPaper } from "@/lib/quiz/loadQuestionPapers";
import type { QuestionPaper } from "@/lib/quiz/types";

type Props = {
  papers: QuestionPaper[];
  broken: BrokenPaper[];
  onSelect: (paper: QuestionPaper) => void;
};

export default function PaperListStep({ papers, broken, onSelect }: Props) {
  return (
    <section className="card">
      <h2>문제지를 골라 주세요</h2>
      {papers.length === 0 ? (
        <p className="muted">아직 준비된 문제지가 없습니다. 선생님께 문의해 주세요.</p>
      ) : (
        <>
          <p className="muted">풀고 싶은 문제지를 누르면 시작할 수 있습니다.</p>
          <ul className="paper-list">
            {papers.map((paper) => (
              <li key={paper.id}>
                <button type="button" className="paper-button" onClick={() => onSelect(paper)}>
                  <span className="paper-title">{paper.title}</span>
                  <span className="muted">문제 {paper.questions.length}개</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {broken.length > 0 && (
        <div className="error-box" role="alert">
          <p className="error-title">형식이 맞지 않아 목록에서 뺀 문제지가 있습니다.</p>
          <ul>
            {broken.map((paper) => (
              <li key={paper.fileName}>
                {paper.fileName}: {paper.errors[0]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
