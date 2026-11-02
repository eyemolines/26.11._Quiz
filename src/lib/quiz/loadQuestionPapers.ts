import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseQuizFile } from "./parseQuizFile";
import type { QuestionPaper } from "./types";

/** 형식이 맞지 않아 목록에 넣지 못한 문제지 파일 */
export type BrokenPaper = {
  fileName: string;
  errors: string[];
};

export type LoadResult = {
  papers: QuestionPaper[];
  broken: BrokenPaper[];
};

/**
 * 문제지 파일들의 내용을 파일 이름 순서로 검사해 목록으로 만듭니다.
 * .json이 아닌 파일은 무시하고, 형식이 맞지 않는 파일은 broken에 이유와 함께 담습니다.
 */
export function buildPaperList(files: { fileName: string; text: string }[]): LoadResult {
  const papers: QuestionPaper[] = [];
  const broken: BrokenPaper[] = [];
  const jsonFiles = files
    .filter((file) => file.fileName.toLowerCase().endsWith(".json"))
    .sort((a, b) => (a.fileName < b.fileName ? -1 : a.fileName > b.fileName ? 1 : 0));

  for (const { fileName, text } of jsonFiles) {
    const result = parseQuizFile(text);
    if (result.ok) {
      papers.push({ id: fileName.replace(/\.json$/i, ""), title: result.title, questions: result.questions });
    } else {
      broken.push({ fileName, errors: result.errors });
    }
  }
  return { papers, broken };
}

/** 프로젝트 맨 위의 question-papers 폴더에서 문제지 파일을 모두 읽습니다. */
export async function loadQuestionPapers(): Promise<LoadResult> {
  // 경로를 question-papers 폴더로 고정해 두어야 완성본(build)에 이 폴더만 포함됩니다.
  let fileNames: string[];
  try {
    fileNames = await readdir(join(process.cwd(), "question-papers"));
  } catch {
    return { papers: [], broken: [] };
  }
  const files = await Promise.all(
    fileNames
      .filter((fileName) => fileName.toLowerCase().endsWith(".json"))
      .map(async (fileName) => ({
        fileName,
        text: await readFile(join(process.cwd(), "question-papers", fileName), "utf8"),
      })),
  );
  return buildPaperList(files);
}
