// 같은 증상 표현이라도 원인이 "질병"인지 "질병외(외상)"인지에 따라 전혀 다른 체크리스트로
// 이어져야 하는 경우를 다룬다. 검색어가 아래 키워드/동의어와 정확히 일치하면, 바로 체크리스트로
// 보내지 않고 원인을 먼저 묻는다.
//
// 주의(AGENTS.md 콘텐츠 출처 원칙): 여기서 연결하는 체크리스트는 모두 기존에 출처 페이지가
// 확인된 시나리오만 사용한다. 아직 표준지침 근거 페이지를 확인하지 못한 쪽(예: 질병성 두통)은
// 옵션으로 추가하지 않고 note로만 안내한다 — 임의로 처치 내용을 만들어 넣지 않는다.
export interface DisambiguationOption {
  label: string;
  hint: string;
  slug: string;
}

export interface DisambiguationEntry {
  keyword: string;
  aliases?: string[];
  question: string;
  options: DisambiguationOption[];
  /** 질병/질병외 중 아직 체크리스트가 없는 쪽이 있을 때 안내 문구 */
  note?: string;
}

export const disambiguationIndex: DisambiguationEntry[] = [
  {
    keyword: "흉통",
    aliases: ["가슴통증", "가슴 아픔", "흉부통증"],
    question: "흉통의 원인이 질병인가요, 외상인가요?",
    options: [
      {
        label: "질병으로 인한 흉통",
        hint: "협심증·심근경색 등 심장성/비심장성 흉통",
        slug: "chest-pain",
      },
      {
        label: "외상으로 인한 흉통",
        hint: "타격·충돌 등으로 가슴을 다친 경우",
        slug: "chest-injury",
      },
    ],
  },
  {
    keyword: "두통",
    aliases: ["머리아픔", "머리가 아픔"],
    question: "두통의 원인이 질병인가요, 외상인가요?",
    options: [
      {
        label: "외상으로 인한 두통",
        hint: "타격·낙상 등으로 머리를 다친 경우",
        slug: "head-injury",
      },
    ],
    note: "편두통 등 질병성 두통 체크리스트는 표준지침 근거 페이지 확인 후 추가될 예정입니다.",
  },
];

export function findDisambiguation(query: string): DisambiguationEntry | undefined {
  const q = query.trim();
  if (!q) return undefined;
  return disambiguationIndex.find((d) => d.keyword === q || d.aliases?.includes(q));
}
