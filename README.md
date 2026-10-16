# 119 현장 체크리스트 (EMS Checklist App)

119구급대원 현장응급처치 표준지침(2023년 개정본, 소방청)을 근거로 만든 모바일 웹 체크리스트입니다.
구급대원이 현장에서 환자 나이(성인/소아)와 증상에 맞는 처치 순서를 빠르게 확인할 수 있도록 만들었습니다.

이 문서는 산학협력단에 프로젝트를 인계하기 위해, 그간 어떻게 만들어졌는지와 코드 구조를 정리한 것입니다.

## 1. 지금 상태 요약

- **본 서비스(체크리스트)**: 실제로 동작하는 완성 단계 프로토타입. 47개 임상 시나리오 + 계산기 도구 4종이 구현되어 있습니다.
- **`/demo` (AI 통합 데모)**: 장수소방서의 "나만의 구급" 생성형 AI 기능과 통합했을 때의 화면을 보여주는 **정적 목업**입니다. 실제 AI 모델과 연결되어 있지 않고, 버튼을 누르면 미리 정해둔 화면만 보여줍니다. 코드에도 이 점을 명시해 두었습니다 (`app/demo/page.tsx` 상단 주석 참고).
- 개인정보를 입력받거나 저장하지 않습니다. 진행 상태는 브라우저 세션에만 임시 저장됩니다(아래 4-3 참고).
- 오프라인 동작은 지원하지 않습니다(항상 네트워크 연결 상태를 전제로 설계됨).

## 2. 개발 경과

커밋 히스토리 기준으로 세 단계로 진행되었습니다.

1. **초기 버전** (`Initial commit`) — 나이별(성인/소아) 체크리스트의 기본 골격: 홈 화면 → 나이 선택 → 카테고리(질병/외상/출산) → 시나리오 목록 → 단계별 체크리스트. 표준지침 기반 시나리오 데이터 초안 작성.
2. **도구·검색·콘텐츠 정비** (`Add tools section, search, and fix content/UX issues...`) — GCS·아프가·화상면적·CPC 계산기 및 정상 활력징후 참고표 추가, 증상 검색(자동완성), 낙상/추락 시나리오 분리, 중복 slug 버그 수정, 약물명 통일, 진행 상태 저장 로직(새로고침 시에만 이어보기) 등 실사용성 개선.
3. **AI 통합 개념 데모** (`Add static prototype demo...` → `Redesign AI demo...` v2 → v3) — 무주소방서의 체크리스트와 장수소방서의 "나만의 구급" AI를 한 화면에 합쳤을 때의 모습을 3차례에 걸쳐 다듬은 정적 프로토타입. 최종 버전(v3)은 전체 순서를 나열하는 대신 "놓치기 쉬운 것"을 먼저 보여주는 트리아지 우선 UI로 재구성했습니다.

이와 별도로, 같은 프로젝트의 **발표용 로드맵 PPT**(전북형 통합 AI 구급 플랫폼 — 캡스톤 모집용)를 여러 차례 다듬는 작업도 이 세션에서 진행했으나, 코드 저장소와는 별도 산출물입니다.

## 3. 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 | Tailwind CSS 4 |
| 아이콘 | lucide-react |
| 데이터 저장 | 없음 — 모든 콘텐츠는 코드 안의 정적 데이터. 진행 상태만 `sessionStorage` 사용 |
| 배포 대상 | 정적으로 빌드 가능한 모바일 웹 (별도 백엔드/DB 없음) |

> **주의**: `AGENTS.md`에 적혀 있듯, 이 프로젝트의 Next.js 버전은 학습 데이터 기준의 관례와 다를 수 있습니다. 구조를 바꾸는 작업을 할 때는 `node_modules/next/dist/docs/`의 최신 문서를 먼저 확인하세요.

## 4. 폴더 구조와 핵심 아키텍처

```
app/                    라우팅 (Next.js App Router, 폴더 = URL 경로)
  page.tsx                홈 — 나이(성인/소아) 선택
  menu/page.tsx            카테고리 선택(질병/외상/출산) + 심정지 바로가기 + 검색
  disease/、trauma/、childbirth/   각 카테고리의 시나리오 목록
  scenarios/[slug]/page.tsx  실제 체크리스트 실행 화면 (핵심 페이지)
  tools/                  계산기 도구 (gcs, apgar, burn, cpc, vitals)
  demo/page.tsx           AI 통합 개념 정적 데모 (실동작 아님, 위 1번 참고)

components/              화면 조각들
  ChecklistRunner.tsx       체크리스트 실행 로직의 핵심 (아래 4-3 참고)
  ScenarioSearch.tsx        증상 검색 자동완성
  ApgarCalculator.tsx 등     계산기 4종

lib/                     데이터 · 순수 로직 (UI 없음)
  types.ts                  핵심 타입 정의 (Scenario, ChecklistStep 등)
  catalog.ts                시나리오 목록 + 카테고리 분류 (질병/외상/출산)
  scenarios.ts               47개 시나리오 파일을 모아 등록하는 레지스트리
  scenarios/*.ts              시나리오별 실제 처치 단계 데이터 (47개 파일, 표준지침 원문 근거)
  severity.ts                 처치 단계의 위험도별 색상·라벨
  searchIndex.ts               검색 대상 목록
  tools.ts                     계산기 도구 메타데이터
  age.ts                       성인/소아 age 파라미터 유틸
```

### 4-1. 데이터 모델 — 새 시나리오를 추가하려면

시나리오 하나는 `lib/scenarios/*.ts` 파일 하나입니다. 예시(`cardiacArrest.ts`)처럼 `Scenario` 타입을 따릅니다.

```ts
const example: Scenario = {
  id: "example-id",       // URL의 [slug]가 됨
  title: "표시될 제목",
  status: "ready",         // "planned"면 "준비 중" 화면만 보여줌
  steps: [
    {
      id: "step-1",
      severity: "critical", // critical | urgent | important | info (색상·라벨 자동 적용)
      title: "성인 기준 단계 제목",
      detail: "성인 기준 상세 설명",
      sourceRef: "p.194",   // 표준지침 페이지 — 필수
      // 소아 기준이 다르면만 아래를 채움 (없으면 성인 값을 그대로 사용)
      pediatricDetail: "소아 기준 상세 설명",
      pediatricSourceRef: "p.303",
    },
  ],
};
export default example;
```

추가한 뒤에는 **`lib/scenarios.ts`에 import + 배열 등록**, **`lib/catalog.ts`에 목록 항목 추가**(질병/외상/출산 중 분류) 이 두 곳을 같이 고쳐야 화면에 나타납니다.

> **콘텐츠 원칙 (`AGENTS.md`)**: 모든 처치 단계는 반드시 `sourceRef`로 표준지침 페이지를 명시해야 하며, 지침에 없는 내용을 임의로 만들어 넣지 않습니다. 새 시나리오가 필요하면 먼저 해당 표준지침 페이지 범위를 확인하고 작성합니다.

### 4-2. 라우팅 흐름

```
/ (나이 선택)
  → /menu?age=adult|pediatric (카테고리 + 검색 + 심정지 바로가기)
    → /disease, /trauma, /childbirth (시나리오 목록)
      → /scenarios/[slug]?age=... (체크리스트 실행)
  → /tools (계산기 목록)
    → /tools/gcs, /tools/apgar, /tools/burn, /tools/cpc, /tools/vitals
```

나이(`age`)는 URL 쿼리 파라미터로 전달되며, 성인/소아 기준이 다른 항목은 `ChecklistStep`의 `pediatric*` 필드로 분기합니다.

### 4-3. 체크리스트 실행 로직 (`components/ChecklistRunner.tsx`)

- 단계를 한 번에 하나씩 보여주고, "완료 · 다음 항목"으로 진행합니다.
- 경과 시간을 재고, 10분(600초) 초과 시 경고색으로 표시합니다.
- 진행 중 상태는 `sessionStorage`에 저장하되, **브라우저를 진짜로 새로고침했을 때만** 이어보기를 허용합니다. 메뉴로 나갔다가 같은 시나리오에 다시 들어오는 것은 새 처치로 간주해 1번부터 시작합니다(오조작 방지를 위한 의도된 동작 — `isHardReload()` 참고).
- `quickJumps`가 있는 시나리오는 화면 위쪽에 "즉시 이동" 경고 버튼을 보여줍니다(예: 교통사고에서 심정지 의심 시 심정지 체크리스트로 바로 이동).

## 5. 실행 방법

```bash
npm install
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint
```

별도 환경변수나 백엔드 설정이 필요 없습니다.

## 6. 알려진 제약 · 향후 과제

- `/demo`는 실제 AI 응답이 아닌 정적 목업이므로, 실서비스로 연결하려면 별도의 AI 백엔드(응답 생성·근거 검증) 설계가 필요합니다 — 관련 로드맵은 별도 PPT 자료(전북형 통합 AI 구급 플랫폼) 참고.
- 오프라인 모드 미지원(설계상 제외).
- 표준지침이 개정되면 `lib/scenarios/*.ts`의 `sourceRef`·내용을 함께 갱신해야 합니다. 별도 개정 대응 프로세스는 아직 없습니다.
- 사용자 테스트(실제 구급대원 대상 사용성 검증)는 아직 진행 전입니다.
