type Props = {
  fileName: string;
  count: number;
  onStart: () => void;
  onChooseAnother: () => void;
};

export default function ReadyStep({ fileName, count, onStart, onChooseAnother }: Props) {
  return (
    <section className="card">
      <h2>문제 {count}개를 불러왔습니다</h2>
      <p className="muted">파일: {fileName}</p>
      <p>모든 문제를 푼 뒤에 한 번에 채점합니다. 준비되면 시작해 주세요.</p>
      <div className="actions">
        <button type="button" className="button" onClick={onChooseAnother}>
          다른 파일 고르기
        </button>
        <button type="button" className="button primary" onClick={onStart}>
          풀이 시작
        </button>
      </div>
    </section>
  );
}
