/* 랜덤 구급일지 생성기 추가 기능 — 엑셀 ↔ 구급일지·세부상황표 변환
   · 첫 화면: 엑셀을 놓으면 종류(값 엑셀 / 오류 0·1 엑셀)를 알아보고 PDF로 바꾼다
   · 시험용: 만든 일지 세트를 값 엑셀·오류 위치 엑셀로 내려받는다
   생성기 쪽 전역(loadTemplate, Stream, makeZip, makeCtx, makeRng, build*, pickErrors, ERR, CONFIGS)과 PDFLib, XLSX 를 쓴다.
   모든 처리는 이 브라우저 안에서만 한다. */
(() => {
  const $ = (s) => document.querySelector(s);
  const LAYOUT = /*__LAYOUT__*/{};
  const tick = () => new Promise((r) => setTimeout(r, 0));

  /* ================= 칸 변환표 =================
     [열 이름, 오류 엑셀의 항목 이름(없으면 ''), 종류, 서식 PDF 글자 덩어리 번호들, 보조값]
     종류: text 글자 · join 줄바꿈 이어 붙임 · paren (값) · prefix/prefix0 앞 글자+값(공백 있음/없음) · onset 발생시간 · lpm 산소 유량 ·
           lines 여러 줄 · chunks 글자 수로 줄바꿈 · multi 칸마다 ' | ' · datetime 날짜+시각 · check 체크 칸 */
  const F_LOG = [
    ['1.소속', '1.소속', 'join', [0, 1]],
    ['1.소속(지역대)', '1.소속', 'text', [2]],
    ['센터전화', '', 'text', [7]],
    ['2.차량번호', '2.차량번호', 'text', [9]],
    ['3.구급구분', '3.구급구분', 'check', [11]],
    ['4.신고일시', '4.신고일시', 'datetime', [15, 21]],
    ['12.신고자번호', '12.신고자번호', 'text', [18]],
    ['13.신고방법', '13.신고방법', 'check', [20]],
    ['5.출동일시', '5.출동일시', 'text', [34]],
    ['6.현장도착일시', '6.현장도착일시', 'text', [39]],
    ['7.환자접촉일시', '7.환자접촉일시', 'text', [41]],
    ['8.현장과의거리', '8.현장과의거리', 'text', [52]],
    ['9.현장출발일시', '9.현장출발일시', 'text', [57]],
    ['10.병원도착일시', '10.병원도착일시', 'text', [60]],
    ['11.귀소일시', '11.귀소일시', 'text', [69]],
    ['14.환자성명', '14.환자성명', 'text', [26]],
    ['15.환자나이', '15.환자나이', 'text', [28]],
    ['16.환자성별', '16.환자성별', 'check', [30]],
    ['환자생년월일', '', 'text', [32]],
    ['17.환자주소', '17.환자주소', 'text', [36]],
    ['17.외국인', '17.환자주소', 'check', [37]],
    ['보호자성명', '', 'text', [44]],
    ['보호자관계', '', 'text', [46]],
    ['보호자전화', '', 'text', [48]],
    ['19.환자발생 위치', '19.환자발생 위치', 'text', [50]],
    ['20.환자발생 장소', '20.환자발생 장소', 'check', [55, 58]],
    ['21.환자증상', '21.환자증상', 'check', [65, 67, 70, 74, 78]],
    ['출동유형', '', 'check', [72, 73, 75, 76, 77]],
    ['22.환자발생유형', '22.환자발생유형', 'check', [82, 87, 97]],
    ['22.병력', '22.환자발생유형', 'check', [84, 85, 86]],
    ['22.질병외 세부', '22.환자발생유형', 'check', [88, 90, 91, 92, 93, 94, 95, 96, 98]],
    ['23.의식상태(1차)', '23.의식상태(1차)', 'check', [104]],
    ['23.의식상태(1차) 시각', '23.의식상태(1차)', 'paren', [103]],
    ['23.의식상태(2차)', '23.의식상태(1차)', 'check', [107]],
    ['23.의식상태(2차) 시각', '23.의식상태(1차)', 'paren', [106]],
    ['24.1.동공상태_좌(1차)', '24.1.동공상태_좌(1차)', 'check', [111]],
    ['24.2.동공상태_우(1차)', '24.2.동공상태_우(1차)', 'check', [114]],
    ['24.3.동공반응_좌(1차)', '24.3.동공반응_좌(1차)', 'check', [112]],
    ['24.4.동공반응_우(1차)', '24.4.동공반응_우(1차)', 'check', [115]],
    ['25.활력징후 측정불가/거부', '25.활력징후', 'check', [117, 118]],
    ['25.활력징후(1회)', '25.활력징후', 'multi', [126, 127, 128, 129, 130, 131]],
    ['25.활력징후(2회)', '25.활력징후', 'multi', [133, 134, 135, 136, 137, 138]],
    ['26.환자분류', '26.환자분류', 'check', [141]],
    ['27.주호소', '27.평가소견', 'prefix', [144], 'ㆍ주 호소:'],
    ['27.발생시간', '27.평가소견', 'onset', [145]],
    ['27.평가소견', '27.평가소견', 'lines', [146, 147, 148]],
    ['28.산소투여 유량(L/min)', '28.응급처치', 'lpm', [155]],
    ['28.응급처치', '28.응급처치', 'check', [154, 155, 156, 157, 158]],
    ['29.의료지도', '29.의료지도', 'check', [162, 166, 169, 173, 174, 175, 176, 181, 182, 183]],
    ['29.의료지도 의사성명', '29.의료지도', 'text', [180]],
    ['30.이송기관명(1차)', '30.환자이송', 'chunks', [194, 195, 196, 197]],
    ['30.관할(1차)', '30.환자이송', 'check', [198]],
    ['30.타시도(1차)', '30.환자이송', 'check', [212]],
    ['30.도착시간(1차)', '30.환자이송', 'text', [199]],
    ['30.거리(1차)', '30.환자이송', 'paren', [214]],
    ['30.선정자(1차)', '30.환자이송', 'check', [200, 201, 202]],
    ['30.재이송사유(1차)', '30.환자이송', 'check', [203, 204, 205, 206]],
    ['30.인수자(1차)', '30.환자이송', 'check', [207, 208, 209, 210]],
    ['30.인수자성명(1차)', '30.환자이송', 'text', [211]],
    ['30.이송기관명(2차)', '30.환자이송', 'text', [217]],
    ['30.관할(2차)', '30.환자이송', 'check', [218]],
    ['30.타시도(2차)', '30.환자이송', 'check', [232]],
    ['30.도착시간(2차)', '30.환자이송', 'text', [219]],
    ['30.거리(2차)', '30.환자이송', 'paren', [233]],
    ['30.선정자(2차)', '30.환자이송', 'check', [220, 221, 222]],
    ['30.재이송사유(2차)', '30.환자이송', 'check', [223, 224, 225, 226]],
    ['30.인수자(2차)', '30.환자이송', 'check', [227, 228, 229, 230]],
    ['30.인수자성명(2차)', '30.환자이송', 'text', [231]],
    ['공동대응', '', 'check', [236, 239]],
    ['미이송', '', 'check', [244]],
    ['31.구급대원(1) 자격', '31.이송자', 'check', [251]],
    ['31.구급대원(1) 계급', '31.이송자', 'text', [253]],
    ['31.구급대원(1) 성명', '31.이송자', 'text', [255]],
    ['31.구급대원(2) 자격', '31.이송자', 'check', [258]],
    ['31.구급대원(2) 계급', '31.이송자', 'text', [260]],
    ['31.구급대원(2) 성명', '31.이송자', 'text', [262]],
    ['31.운전요원 자격', '31.이송자', 'check', [265]],
    ['31.운전요원 계급', '31.이송자', 'text', [267]],
    ['31.운전요원 성명', '31.이송자', 'text', [269]],
    ['31.기타 자격', '31.이송자', 'check', [272]],
    ['32.장애요인', '32.장애요인', 'check', [278, 279]],
    ['재난번호', '', 'text', [284]],
    ['출력자', '', 'prefix', [285], '출력자 :'],
    ['출력일시', '', 'prefix', [287], '출력 일시 :'],
  ];
  // 심뇌혈관질환자 응급처치 세부상황표 (오류 엑셀의 항목 이름은 열 이름과 같다)
  const F_CV = [
    ['주증상 유형', '', 'check', [8]],
    ['주호소 주증상(1개 선택)', '', 'check', [194, 195]],
    ['주호소 동반증상(중복허용)', '', 'check', [198, 199]],
    ['발병 정황', '', 'check', [201]],
    ['발병시각 명확', '', 'check', [203]],
    ['발병시각', '', 'text', [204]],
    ['발병시각 불명확', '', 'check', [205]],
    ['마지막 정상 확인 시각', '', 'text', [207]],
    ['최초 이상 소견 발견 시각', '', 'text', [209]],
    ['병원 전 뇌졸중 선별검사', '', 'check', [215]],
    ['나이 ≥ 45세', '', 'check', [218]],
    ['의식저하로 협조안됨', '', 'check', [222]],
    ['뇌전증(간질) 및 경련 병력', '', 'check', [220]],
    ['얼굴마비', '', 'check', [225]],
    ['증상 발생 24시간 이내', '', 'check', [227]],
    ['팔 위약', '', 'check', [229]],
    ['평상시 휠체어·병상 생활 아님', '', 'check', [231]],
    ['구음장애/실어증', '', 'check', [233]],
    ['혈당 수치 60~400 mg/dL', '', 'check', [235]],
    ['선별검사 최종 결과', '', 'check', [237]],
    ['주시 편위(2점)', '', 'check', [241]],
    ['나이/시간(월) 지남력', '', 'check', [243]],
    ['팔 위약(편마비)(1점)', '', 'check', [245]],
    ['눈감기/손잡고 펴기 동작', '', 'check', [247]],
    ['최종 중증도 평가 결과', '', 'check', [249]],
    ['뇌졸중 과거력', '', 'check', [252]],
    ['뇌졸중 후유 장애', '', 'check', [254]],
    ['혈전용해제 금기', '', 'check', [258]],
    ['헬기 이송 요청', '', 'check', [260]],
    ['병원 사전 연락', '', 'check', [262]],
    ['담당자 자격', '', 'check', [264]],
    ['담당자 계급', '', 'prefix0', [265], '계급:'],
    ['담당자 성명', '', 'prefix0', [266], '성명:'],
  ];
  // 중증외상환자 응급처치 세부상황표
  const F_TR = [
    ['지령분류', '', 'check', [8]],
    ['평가기준: 그 외 구급대원 판단', '', 'check', [29]],
    ['평가기준: 다음에 해당', '', 'check', [32]],
    ['중증외상 발생 시각', '', 'text', [42]],
    ['구급처치 시작 시각', '', 'text', [44]],
    ['발생 환자 수', '', 'text', [46]],
    ['이송 환자 수', '', 'text', [48]],
    ['중증외상 목격 여부', '', 'check', [50]],
    ['구급처치 전·후 구조작업', '', 'check', [52]],
    ['의도성 추정', '', 'check', [54]],
    ['손상 기전 1', '', 'check', [57]],
    ['손상 기전 2', '', 'check', [58]],
    ['심정지/호흡정지 상황', '', 'check', [70]],
    ['명백한 사망', '', 'check', [72]],
    ['약물', '', 'check', [74]],
    ['음주', '', 'check', [76]],
    ['GCS 현장도착 E', '', 'text', [83]],
    ['GCS 현장도착 M', '', 'text', [85]],
    ['GCS 현장도착 V', '', 'text', [87]],
    ['GCS 병원도착 E', '', 'text', [91]],
    ['GCS 병원도착 M', '', 'text', [93]],
    ['GCS 병원도착 V', '', 'text', [95]],
    ['주외상 부위', '', 'check', [105]],
    ['중증외상 판정', '', 'check', [107, 108, 109, 110]],
    ['산소투여', '', 'check', [162]],
    ['처치전 산소포화도', '', 'text', [167]],
    ['처치후 산소포화도', '', 'text', [170]],
    ['정맥로 확보', '', 'check', [177]],
    ['처치전 수축기혈압', '', 'text', [182]],
    ['처치후 수축기혈압', '', 'text', [185]],
    ['사전 연락', '', 'check', [223]],
    ['담당자 자격', '', 'check', [229]],
    ['담당자 계급', '', 'text', [231]],
    ['담당자 성명', '', 'prefix0', [232], '성명:'],
  ];
  // 오류 엑셀(구급정보시스템 완결성 점검)의 일지 항목 열 35개
  const ITEMS = ['1.소속', '2.차량번호', '3.구급구분', '4.신고일시', '5.출동일시', '6.현장도착일시', '7.환자접촉일시', '8.현장과의거리',
    '9.현장출발일시', '10.병원도착일시', '11.귀소일시', '12.신고자번호', '13.신고방법', '14.환자성명', '15.환자나이', '16.환자성별',
    '17.환자주소', '18.환자직업', '19.환자발생 위치', '20.환자발생 장소', '21.환자증상', '22.환자발생유형', '23.의식상태(1차)',
    '24.1.동공상태_좌(1차)', '24.2.동공상태_우(1차)', '24.3.동공반응_좌(1차)', '24.4.동공반응_우(1차)', '25.활력징후', '26.환자분류',
    '27.평가소견', '28.응급처치', '29.의료지도', '30.환자이송', '31.이송자', '32.장애요인'];
  const META = ['보고서번호', '소방서', '출동센터', '신고일시'];
  const DELETED_ITEM = '18.환자직업'; // 2025 서식에서 칸이 삭제됨(구급빨간펜 결정 2026-10-31)

  // 서식별 정보. serial: 일련번호 글자 덩어리, img: 지울 가상 서명 그림
  const FORMS = {
    log: { tpl: 'log', title: '구급활동일지', sheet: '일지값', errSheet: '오류위치', F: F_LOG, serial: 282, img: /\/Im[1-4] Do/g },
    cv: { tpl: 'cv', title: '심뇌혈관 세부상황표', sheet: '심뇌혈관', errSheet: '오류위치_심뇌혈관', F: F_CV, serial: 6, img: /\/Im0 Do/g, station: 1, center: 2 },
    trauma: { tpl: 'trauma', title: '중증외상 세부상황표', sheet: '중증외상', errSheet: '오류위치_중증외상', F: F_TR, serial: 6, img: /\/Im0 Do/g, station: 1, center: 2 },
  };
  const FORM_KEYS = ['log', 'cv', 'trauma'];
  FORM_KEYS.forEach((k) => {
    const D = FORMS[k]; D.runField = {};
    D.F.forEach((f, n) => f[3].forEach((i) => { D.runField[i] = { item: D === FORMS.log ? f[1] : f[0], n: n + 1 }; }));
  });

  /* ================= 읽기·쓰기 보조 ================= */
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const p2s = (n) => String(n).padStart(2, '0');

  function parseOpts(text) {
    const re = /\[\s*(√?)\s*\]/g, hits = []; let m;
    while ((m = re.exec(text))) hits.push({ at: m.index, len: m[0].length, on: m[1] === '√' });
    return hits.map((h, i) => {
      const end = i + 1 < hits.length ? hits[i + 1].at : text.length;
      const lab = text.slice(h.at + h.len, end).split(/[()■]|\s{2,}/)[0].replace(/\s+/g, ' ').trim();
      return Object.assign({ lab }, h);
    });
  }
  // 같은 칸(field) 안의 모든 선택지. 이름이 겹치면 두 번째부터 #2, #3 을 붙인다
  function fieldOpts(S, f) {
    const seen = {}, out = [];
    f[3].forEach((ri, pos) => parseOpts(S.runs[ri].text).forEach((o, k) => {
      const base = o.lab || ('옵션' + (pos + 1) + '-' + (k + 1));
      seen[base] = (seen[base] || 0) + 1;
      out.push(Object.assign({ ri, name: seen[base] > 1 ? base + '#' + seen[base] : base }, o));
    }));
    return out;
  }
  function setChecks(S, f, want) {
    const opts = fieldOpts(S, f);
    f[3].forEach((ri) => {
      let t = S.runs[ri].text;
      opts.filter((o) => o.ri === ri).sort((a, b) => b.at - a.at).forEach((o) => {
        t = t.slice(0, o.at) + '[' + (want.has(o.name) ? '√' : ' ') + ']' + t.slice(o.at + o.len);
      });
      S.set(S.runs[ri], t);
    });
  }
  function parseDT(v) {
    const s = String(v || '').trim();
    let m = /^(\d{4})\D?(\d{1,2})\D?(\d{1,2})\D*(\d{1,2})\D?(\d{2})/.exec(s);
    if (m) return { y: m[1], mo: p2s(m[2]), d: p2s(m[3]), h: p2s(m[4]), mi: m[5] };
    m = /^(\d{4})\D+(\d{1,2})\D+(\d{1,2})/.exec(s);
    return m ? { y: m[1], mo: p2s(m[2]), d: p2s(m[3]), h: '', mi: '' } : null;
  }
  const fmtDT = (o) => (o ? o.y + '-' + o.mo + '-' + o.d + (o.h ? ' ' + o.h + ':' + o.mi : '') : '');

  function readField(S, f) {
    const [, , kind, idx, arg] = f, R = idx.map((i) => S.runs[i]);
    switch (kind) {
      case 'text': return clean(R[0].text);
      case 'join': case 'chunks': return clean(R.map((r) => r.text).join(''));
      case 'paren': { const m = /^\((.*)\)$/.exec(R[0].text.trim()); return clean(m ? m[1] : R[0].text); }
      case 'prefix': case 'prefix0': return clean(R[0].text.replace(new RegExp('^\\s*' + reEsc(arg) + '\\s*'), ''));
      case 'onset': { const m = /^ㆍ발생시간\(\[\s*(√?)\s*\]추정\):\s*(.*)$/.exec(R[0].text.trim()); return m ? clean((m[1] ? '추정 ' : '') + m[2]) : clean(R[0].text); }
      case 'lpm': { const m = /(\d+(?:\.\d+)?)L\/min/.exec(R[0].text); return m ? m[1] : ''; }
      case 'lines': return R.map((r) => clean(r.text)).filter(Boolean).join('\n');
      case 'multi': return R.map((r) => clean(r.text)).join(' | ');
      case 'datetime': {
        const d = /^(\d{4})\D+(\d{1,2})\D+(\d{1,2})/.exec(R[0].text), t = /(\d{1,2}):(\d{2})/.exec(R[1].text);
        return d ? fmtDT({ y: d[1], mo: p2s(d[2]), d: p2s(d[3]), h: t ? p2s(t[1]) : '', mi: t ? t[2] : '' }) : '';
      }
      case 'check': return fieldOpts(S, f).filter((o) => o.on).map((o) => o.name).join(', ');
    }
    return '';
  }

  function writeField(S, f, raw) {
    const [, , kind, idx, arg] = f, R = idx.map((i) => S.runs[i]), val = clean(raw);
    switch (kind) {
      case 'text': S.set(R[0], val || ' '); break;
      case 'join': {
        let k = 0; while (k < val.length && S.width(val.slice(0, k + 1), R[0].size) <= 62) k++;
        S.set(R[0], val.slice(0, k) || ' '); R.slice(1).forEach((r, i) => S.set(r, i === 0 ? (val.slice(k) || ' ') : ' ')); break;
      }
      case 'paren': S.set(R[0], /^km$/i.test(val) ? '(   km)' : '(' + (val || '     ') + ')'); break;
      case 'prefix': S.set(R[0], arg + ' ' + val); break;
      case 'prefix0': S.set(R[0], ' ' + arg + val); break;
      case 'onset': { const m = /^(추정)?\s*(.*)$/.exec(val); S.set(R[0], 'ㆍ발생시간([' + (m[1] ? '√' : ' ') + ']추정): ' + m[2]); break; }
      case 'lpm': S.set(R[0], R[0].text.replace(/\d+(?:\.\d+)?L\/min/, (val || '0') + 'L/min')); break;
      case 'chunks': {
        const ch = Array.from(val), n = R.length, parts = [];
        for (let i = 0; i < n; i++) parts.push(ch.slice(i * 6, i === n - 1 ? ch.length : (i + 1) * 6).join(''));
        R.forEach((r, i) => S.set(r, parts[i] || ' '));
        break;
      }
      case 'multi': { const p = String(raw == null ? '' : raw).split('|').map((x) => x.trim()); R.forEach((r, i) => S.set(r, p[i] || ' ')); break; }
      case 'lines': {
        const text = String(raw == null ? '' : raw).trim(), size = R[0].size, LIM = 455; let lines = [];
        if (text.indexOf('\n') >= 0) lines = text.split('\n').map(clean);
        else { let cur = ''; clean(text).split(' ').filter(Boolean).forEach((w) => { const nx = cur ? cur + ' ' + w : w; if (S.width(nx, size) <= LIM) cur = nx; else { lines.push(cur); cur = w; } }); if (cur) lines.push(cur); }
        if (lines.length > R.length) lines = lines.slice(0, R.length - 1).concat([lines.slice(R.length - 1).join(' ')]);
        R.forEach((r, i) => S.set(r, lines[i] || ' '));
        break;
      }
      case 'datetime': {
        const o = parseDT(raw);
        S.set(R[0], o ? o.y + '. ' + Number(o.mo) + '. ' + Number(o.d) : ' ');
        S.set(R[1], o && o.h ? o.h + ':' + o.mi : ' ');
        break;
      }
      case 'check': setChecks(S, f, new Set(String(raw == null ? '' : raw).split(/[,，\n;]/).map((x) => x.trim()).filter(Boolean))); break;
    }
  }

  /* ================= 서식 한 쪽 읽기·만들기 ================= */
  async function openStream(bytes, pageNo) {
    const doc = await PDFLib.PDFDocument.load(bytes), page = doc.getPage(pageNo || 0), s = page.node.Contents();
    const raw = s instanceof PDFLib.PDFRawStream ? PDFLib.decodePDFRawStream(s).decode() : (s.getContents ? s.getContents() : s.contents);
    return new Stream(raw, page.getHeight());
  }
  function readMeta(key, S) {
    const D = FORMS[key], id = clean(S.runs[D.serial].text);
    if (key === 'log') {
      const aff = /^소속\s*:\s*(\S+)\s*(.*)$/.exec(clean(S.runs[286].text)) || [], o = parseDT(readField(S, F_LOG.find((f) => f[0] === '4.신고일시')));
      return { id, station: aff[1] || '', center: clean(aff[2] || ''), time: o && o.h ? o.y + o.mo + o.d + o.h + o.mi + '00' : '' };
    }
    return { id, station: clean(S.runs[D.station].text), center: clean(S.runs[D.center].text), time: '' };
  }
  function readValues(key, S) {
    const v = {}; FORMS[key].F.forEach((f) => { v[f[0]] = readField(S, f); });
    return v;
  }
  function writeMeta(key, S, m) {
    const D = FORMS[key];
    S.set(S.runs[D.serial], m.id || ' ');
    if (key === 'log') S.set(S.runs[286], '소속 : ' + (m.station || '') + ' ' + (m.center || ''));
    else { S.set(S.runs[D.station], m.station || ' '); S.set(S.runs[D.center], m.center || ' '); }
  }
  // 가상 서명 그림 삭제 + 체크 모두 해제 → 표의 모든 칸을 엑셀 값(없으면 빈칸)으로 채움
  function fillForm(key, S, meta, values) {
    const D = FORMS[key];
    S.src = S.src.replace(D.img, (m) => ' '.repeat(m.length));
    S.runs.forEach((r) => { if (r.text.indexOf('[√]') >= 0) S.uncheck(r); });
    D.F.forEach((f) => writeField(S, f, values ? values[f[0]] : ''));
    writeMeta(key, S, meta);
    if (key === 'log' && !(values && clean(values['4.신고일시'])) && meta.time) writeField(S, F_LOG.find((f) => f[0] === '4.신고일시'), meta.time);
  }
  async function finishZ(t) { // 글자 스트림을 압축해서 저장 (쪽당 용량 1/2.5)
    const ref = t.doc.context.register(t.doc.context.flateStream(t.stream.serialize()));
    t.page.node.set(PDFLib.PDFName.of('Contents'), ref);
    return await t.doc.save();
  }

  /* ---------- 고칠 칸 표시 ---------- */
  function runBox(S, i) {
    const r = S.runs[i], top = S.top(r), w = Math.max(S.width(r.text, r.size), 12);
    return [Math.max(2, r.x - 1), top - r.size * 0.95, Math.min(593, r.x + w + 1), top + r.size * 0.3];
  }
  // names: 일지는 오류 엑셀의 항목 이름, 세부상황표는 열 이름 → [{box:[x0,top,x1,bottom], label}]
  function marksFor(key, S, names) {
    const D = FORMS[key], out = [];
    names.forEach((nm) => {
      if (key === 'log') {
        const it = LAYOUT.items && LAYOUT.items[nm];
        if (it) out.push({ box: it.box, label: (/^\d+(?:\.\d+)?(?=\.\D)/.exec(nm) || [nm])[0] });
      } else {
        const n = D.F.findIndex((f) => f[0] === nm);
        if (n >= 0) { const bs = D.F[n][3].map((i) => runBox(S, i)); out.push({ box: [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))], label: String(n + 1) }); }
      }
    });
    return out;
  }
  function drawMarks(page, font, marks) {
    const H = page.getHeight(), red = PDFLib.rgb(0.78, 0.16, 0.16);
    marks.forEach(({ box: b, label }) => {
      const pad = 1.5;
      page.drawRectangle({ x: b[0] - pad, y: H - b[3] - pad, width: b[2] - b[0] + 2 * pad, height: b[3] - b[1] + 2 * pad,
        color: red, opacity: 0.14, borderColor: red, borderWidth: 1.5, borderOpacity: 1 });
      page.drawText(label, { x: Math.max(1, b[0] - 11), y: H - b[1] - 7, size: 8, font, color: red });
    });
  }

  // pages: [{form, meta, values, names}] → PDF 한 개 (건마다 한 쪽). names 가 있으면 그 칸을 빨갛게 표시
  async function buildPdf(pages, onProgress) {
    const out = await PDFLib.PDFDocument.create();
    for (let n = 0; n < pages.length; n++) {
      if (onProgress) onProgress(n + 1, pages.length);
      await tick();
      const p = pages[n], t = await loadTemplate(FORMS[p.form].tpl);
      fillForm(p.form, t.stream, p.meta, p.values);
      const marks = p.names && p.names.length ? marksFor(p.form, t.stream, p.names) : [];
      const d = await PDFLib.PDFDocument.load(await finishZ(t));
      if (marks.length) drawMarks(d.getPage(0), await d.embedFont(PDFLib.StandardFonts.HelveticaBold), marks);
      out.addPage((await out.copyPages(d, [0]))[0]);
    }
    return await out.save();
  }

  /* ================= 엑셀 읽기 ================= */
  // 모든 시트를 { 시트이름: {head, rows} } 로
  async function readBook(file) {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' }), book = {};
    wb.SheetNames.forEach((n) => {
      const data = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: false, defval: '' });
      if (data.length >= 2) book[n] = { head: data[0].map((h) => String(h).trim()), rows: data.slice(1).filter((r) => String(r[0]).trim()) };
    });
    return book;
  }
  const rowMeta = (r) => ({ id: String(r[0]).trim(), station: String(r[1]).trim(), center: String(r[2]).trim(), time: String(r[3]).trim() });

  // 엑셀 종류 알아보기: 'values'(값 엑셀) / 'errors'(오류 0·1 엑셀) / null
  function detect(book) {
    if (FORM_KEYS.some((k) => book[FORMS[k].sheet])) return 'values';
    if (FORM_KEYS.some((k) => book[FORMS[k].errSheet])) return 'errors';
    const name = Object.keys(book)[0], first = book[name];
    if (!first) return null;
    const rest = first.rows.map((r) => r.slice(META.length).map((v) => String(v).trim()));
    if (first.head.indexOf('1.소속') >= 0 && first.head.indexOf('4.신고일시') >= 0 && rest.some((r) => r.some((v) => v && !/^[01]$/.test(v)))) { book[FORMS.log.sheet] = first; return 'values'; }
    const flagish = first.head.length > META.length + 9 && rest.length && rest.every((r) => r.every((v) => /^[01]?$/.test(v)));
    if (flagish) { book[FORMS.log.errSheet] = first; return 'errors'; }
    return null;
  }

  // 값 엑셀 → 쪽 목록 (보고서번호 순서대로 일지, 심뇌혈관, 중증외상)
  function valuePages(book) {
    const order = [], per = {};
    FORM_KEYS.forEach((k) => {
      per[k] = {}; const sh = book[FORMS[k].sheet]; if (!sh) return;
      sh.rows.forEach((r) => {
        const m = rowMeta(r), values = {}; if (per[k][m.id]) return;
        FORMS[k].F.forEach((f) => { const i = sh.head.indexOf(f[0]); values[f[0]] = i < 0 ? '' : String(r[i]).trim(); });
        per[k][m.id] = { form: k, meta: m, values }; if (order.indexOf(m.id) < 0) order.push(m.id);
      });
    });
    const pages = [];
    order.forEach((id) => FORM_KEYS.forEach((k) => { if (per[k][id]) pages.push(per[k][id]); }));
    return pages;
  }
  // 오류 엑셀 → 쪽 목록 (1로 표시된 칸이 있는 일지·세부상황표만)
  function errorPages(book, excludeDeleted) {
    const order = [], per = {};
    FORM_KEYS.forEach((k) => {
      per[k] = {}; const sh = book[FORMS[k].errSheet]; if (!sh) return;
      const cols = sh.head.slice(META.length);
      sh.rows.forEach((r) => {
        const names = cols.filter((c, i) => String(r[META.length + i]).trim() === '1' && !(excludeDeleted && k === 'log' && c === DELETED_ITEM));
        if (!names.length) return;
        const m = rowMeta(r); per[k][m.id] = { form: k, meta: m, values: null, names }; if (order.indexOf(m.id) < 0) order.push(m.id);
      });
    });
    const pages = [];
    order.forEach((id) => FORM_KEYS.forEach((k) => { if (per[k][id]) pages.push(per[k][id]); }));
    return pages;
  }
  const byCenter = (pages) => { const g = {}; pages.forEach((p) => { (g[p.meta.center || '센터없음'] = g[p.meta.center || '센터없음'] || []).push(p); }); return g; };

  /* ================= 일지 세트 만들기 → 엑셀 ================= */
  // generate({kind, level, seed}) 와 같은 순서로 난수를 써서 같은 문서를 만들고, 일부러 넣은 오류가 바꾼 칸을 기록한다
  async function genSet(kind, level, seed) {
    const rng = makeRng(seed), cfg = CONFIGS[kind] || CONFIGS.both;
    const c = makeCtx(rng, cfg.scen || (rng() < 0.5 ? 'stroke' : 'trauma')), want = cfg.want, chosen = {};
    want.forEach((f) => { chosen[f] = pickErrors(c, ERR[f], level); });
    Object.values(chosen).flat().forEach((e) => e.plan && e.plan(c, level));
    const out = { seed, serial: c.serial, forms: {}, notes: [] };
    for (const f of want) {
      const t = await loadTemplate(FORMS[f].tpl);
      const refs = f === 'log' ? buildLog(t.stream, c) : f === 'cv' ? buildCv(t.stream, c) : buildTrauma(t.stream, c), flags = new Set();
      chosen[f].forEach((e) => {
        const before = t.stream.runs.map((r) => r.text), detail = e.apply(t.stream, refs, c);
        t.stream.runs.forEach((r, i) => { if (r.text !== before[i] && FORMS[f].runField[i]) flags.add(FORMS[f].runField[i].item); });
        out.notes.push([FORMS[f].title, e.desc + ': ' + detail]);
      });
      out.forms[f] = { meta: readMeta(f, t.stream), values: readValues(f, t.stream), flags };
    }
    return out;
  }
  async function genMany(n, kind, level, base, onProgress) {
    const sets = [];
    for (let k = 0; k < n; k++) { if (onProgress) onProgress(k + 1, n); await tick(); sets.push(await genSet(kind, level, base + k)); }
    return sets;
  }
  const colWidths = (cols) => cols.map((c) => ({ wch: Math.min(40, Math.max(8, String(c).length * 2)) }));
  const xlsxBlob = (wb) => new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  function valuesWorkbook(sets) {
    const wb = XLSX.utils.book_new();
    FORM_KEYS.forEach((k) => {
      const rows = sets.filter((s) => s.forms[k]); if (!rows.length) return;
      const cols = META.concat(FORMS[k].F.map((f) => f[0]));
      const aoa = [cols].concat(rows.map((s) => { const x = s.forms[k]; return [x.meta.id || s.serial, x.meta.station, x.meta.center, x.meta.time].concat(FORMS[k].F.map((f) => x.values[f[0]])); }));
      const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = colWidths(cols);
      XLSX.utils.book_append_sheet(wb, ws, FORMS[k].sheet);
    });
    const help = [['구급일지 값 엑셀 안내'], [''],
      ['· 시트마다 한 종류의 서식입니다(일지값 / 심뇌혈관 / 중증외상). 한 줄이 한 장입니다. 앞 4열은 오류 엑셀과 같은 모양입니다.'],
      ['· 심뇌혈관·중증외상 시트의 보고서번호가 일지와 같으면 같은 사건으로 보고 PDF에서 이어서 나옵니다.'],
      ['· 체크 칸은 선택한 항목 이름을 쉼표로 적습니다. 예: 13.신고방법 = 휴대전화 / 21.환자증상 = 흉통, 어지러움'],
      ['· 같은 이름이 한 칸 안에 두 번 나오면 두 번째부터 이름 뒤에 #2 를 붙입니다.'],
      ['· 25.활력징후는 시각 | 혈압 | 맥박 | 호흡 | 체온 | SpO2 순서이고 | 로 나눕니다.'],
      ['· 27.발생시간 앞에 추정 이 있으면 추정 체크입니다. 27.평가소견은 줄바꿈 없이 써도 알아서 3줄로 나눕니다.'],
      ['· 열에 없는 칸(서식 고정 글자 등)은 서식 기본 모양 그대로 나옵니다. 이 파일의 값은 모두 가상입니다.']];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(help), '안내');
    return wb;
  }
  function errorWorkbook(sets) {
    const wb = XLSX.utils.book_new();
    FORM_KEYS.forEach((k) => {
      const rows = sets.filter((s) => s.forms[k]); if (!rows.length) return;
      const items = k === 'log' ? ITEMS : FORMS[k].F.map((f) => f[0]), cols = META.concat(items);
      const aoa = [cols].concat(rows.map((s) => { const x = s.forms[k]; return [x.meta.id || s.serial, x.meta.station, x.meta.center, x.meta.time].concat(items.map((it) => (x.flags.has(it) ? '1' : '0'))); }));
      const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = colWidths(cols);
      XLSX.utils.book_append_sheet(wb, ws, FORMS[k].errSheet);
    });
    const notes = [['보고서번호', '서식', '일부러 넣은 오류']];
    sets.forEach((s) => { if (s.notes.length) s.notes.forEach((n) => notes.push([s.serial, n[0], n[1]])); else notes.push([s.serial, '', '(없음)']); });
    const ns = XLSX.utils.aoa_to_sheet(notes); ns['!cols'] = [{ wch: 24 }, { wch: 22 }, { wch: 90 }];
    XLSX.utils.book_append_sheet(wb, ns, '정답표');
    return wb;
  }
  function saveBlob(name, blob) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /* ================= 첫 화면 (파일을 놓으면 알아서 변환) ================= */
  const H = { book: null, kind: null, file: null, result: null, busy: false };
  const show = (sel, on) => { $(sel).hidden = !on; };
  const mb = (n) => (n / 1048576).toFixed(1) + 'MB';
  function setProgress(label, n, total) {
    $('#h-prog-label').textContent = label + ' ' + n + ' / ' + total;
    $('#h-prog-bar').style.width = Math.round((n / total) * 100) + '%';
  }
  function resetHome() {
    H.book = H.kind = H.file = H.result = null;
    show('#h-card', false); show('#h-drop', true); show('#h-samples', true); $('#h-error').textContent = '';
    $('#h-file').value = '';
  }
  function describe(book, kind) {
    const parts = [], ids = new Set(), centers = new Set();
    FORM_KEYS.forEach((k) => {
      const sh = book[kind === 'values' ? FORMS[k].sheet : FORMS[k].errSheet]; if (!sh) return;
      sh.rows.forEach((r) => { ids.add(String(r[0]).trim()); if (String(r[2]).trim()) centers.add(String(r[2]).trim()); });
      parts.push(FORMS[k].title + ' ' + sh.rows.length + '건');
    });
    return { text: parts.join(' · '), ids: ids.size, centers: centers.size };
  }
  async function convert() {
    if (H.busy || !H.book) return;
    H.busy = true; H.result = null;
    show('#h-done', false); show('#h-prog', true); $('#h-error').textContent = '';
    try {
      const zip = H.kind === 'errors' && $('input[name=h-out]:checked').value === 'zip';
      const pages = H.kind === 'values' ? valuePages(H.book) : errorPages(H.book, $('#h-exc').checked);
      if (!pages.length) throw new Error(H.kind === 'errors' ? '수정이 필요한 일지(1로 표시된 칸)가 없습니다' : '변환할 줄이 없습니다');
      const prog = (n, total) => setProgress('만드는 중', n, total);
      if (zip) {
        const files = [], groups = byCenter(pages); let done = 0;
        for (const c of Object.keys(groups).sort()) { files.push({ name: '일지_' + c + '.pdf', data: await buildPdf(groups[c], (n) => setProgress('만드는 중', done + n, pages.length)) }); done += groups[c].length; }
        const blob = makeZip(files);
        H.result = { name: 'ilji_marked_by_center.zip', blob, pages: pages.length, note: '센터 ' + files.length + '곳' };
      } else {
        const bytes = await buildPdf(pages, prog), blob = new Blob([bytes], { type: 'application/pdf' });
        H.result = { name: H.kind === 'values' ? 'ilji_from_excel.pdf' : 'ilji_marked.pdf', blob, pages: pages.length, note: '' };
      }
      $('#h-done-title').textContent = H.result.pages + '쪽 완성' + (H.result.note ? ' · ' + H.result.note : '') + ' · ' + mb(H.result.blob.size);
      $('#h-preview').hidden = H.result.name.endsWith('.zip'); $('#h-frame').innerHTML = '';
      show('#h-done', true);
    } catch (e) { console.error(e); $('#h-error').textContent = '만들지 못했습니다: ' + (e.message || e); }
    show('#h-prog', false); H.busy = false;
  }
  async function handleFile(file) {
    if (H.busy || !file) return;
    resetHome(); H.file = file; $('#h-error').textContent = '';
    try {
      H.book = await readBook(file); H.kind = detect(H.book);
      if (!H.kind) throw new Error('이 엑셀이 어떤 종류인지 알아보지 못했습니다. 구급일지 값 엑셀(시트 이름: 일지값) 또는 월별 오류 엑셀(앞 4열 + 항목별 0/1)을 올려 주세요');
    } catch (e) { $('#h-error').textContent = e.message || String(e); return; }
    const d = describe(H.book, H.kind), values = H.kind === 'values';
    $('#h-file-name').textContent = file.name;
    $('#h-kind').textContent = values ? '값 엑셀로 인식했어요' : '오류 엑셀(0/1)로 인식했어요';
    $('#h-kind-sub').textContent = d.text + (d.centers ? ' · 센터 ' + d.centers + '곳' : '');
    $('#h-goal').textContent = values ? '→ 구급일지·세부상황표 PDF로 바꿉니다 (값을 채운 일지)' : '→ 고칠 칸이 빨갛게 표시된 구급일지 PDF로 바꿉니다 (환자 값은 비움)';
    show('#h-opts', !values); show('#h-drop', false); show('#h-samples', false); show('#h-card', true);
    await convert();
  }
  function bindHome() {
    const drop = $('#h-drop'), input = $('#h-file');
    input.addEventListener('change', () => { if (input.files[0]) handleFile(input.files[0]); });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    ['dragenter', 'dragover'].forEach((ev) => window.addEventListener(ev, (e) => { if ($('#x-home').hidden) return; stop(e); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach((ev) => window.addEventListener(ev, (e) => { if ($('#x-home').hidden) return; stop(e); if (ev === 'drop' || e.target === document.documentElement || e.relatedTarget === null) drop.classList.remove('over'); }));
    window.addEventListener('drop', (e) => { if ($('#x-home').hidden) return; const f = e.dataTransfer && e.dataTransfer.files[0]; if (f && !H.busy) handleFile(f); });
    $('#h-reset').addEventListener('click', resetHome);
    $('#h-again').addEventListener('click', resetHome);
    $('#h-exc').addEventListener('change', () => { if (H.kind === 'errors') convert(); });
    document.querySelectorAll('input[name=h-out]').forEach((r) => r.addEventListener('change', () => { if (H.kind === 'errors') convert(); }));
    $('#h-save').addEventListener('click', () => { if (H.result) saveBlob(H.result.name, H.result.blob); });
    $('#h-preview').addEventListener('click', () => {
      const box = $('#h-frame'); if (box.firstChild) { box.innerHTML = ''; return; }
      const f = document.createElement('iframe'); f.src = URL.createObjectURL(H.result.blob); box.appendChild(f);
    });
    // 연습용 파일: 값 엑셀 / 오류 엑셀 3건
    const sample = (which) => async () => {
      const sets = await genMany(3, 'both', 1, 20260101);
      saveBlob(which === 'values' ? 'ilji_sample_values.xlsx' : 'ilji_sample_errors.xlsx', xlsxBlob(which === 'values' ? valuesWorkbook(sets) : errorWorkbook(sets)));
    };
    $('#h-sample-v').addEventListener('click', sample('values'));
    $('#h-sample-e').addEventListener('click', sample('errors'));
    // 탭
    document.querySelectorAll('.x-tab').forEach((t) => t.addEventListener('click', () => {
      document.querySelectorAll('.x-tab').forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      $('#x-home').hidden = t.dataset.tab !== 'home'; $('#x-gen').hidden = t.dataset.tab !== 'gen';
    }));
  }

  /* ================= 시험용 일지 만들기 탭의 엑셀 내보내기 ================= */
  let busy = false;
  async function run(fn) {
    if (busy) return; busy = true;
    try { await fn(); } catch (e) { console.error(e); $('#x-state').textContent = '만들지 못했습니다: ' + (e.message || e); }
    busy = false;
  }
  function exportExcel(which) {
    return run(async () => {
      const n = Math.max(1, Math.min(500, +$('#x-n').value || 1)), kind = $('#kind').value, level = +$('#level').value, s = $('#seed').value.trim();
      const base = s ? (parseInt(s, 10) || [...s].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7)) : Math.floor(Math.random() * 1e8);
      const sets = await genMany(n, kind, level, base, (k, t) => { $('#x-state').textContent = '일지 만드는 중 ' + k + ' / ' + t; });
      saveBlob(which === 'values' ? 'ilji_values.xlsx' : 'ilji_errors_01.xlsx', xlsxBlob(which === 'values' ? valuesWorkbook(sets) : errorWorkbook(sets)));
      $('#x-state').textContent = n + '건(시드 ' + base + '~)을 저장했습니다. 값 엑셀과 오류 엑셀은 같은 시드·구성·오류 수준이면 같은 일지입니다. 첫 화면에 올리면 PDF가 됩니다.';
    });
  }
  $('#x-val').addEventListener('click', () => exportExcel('values'));
  $('#x-err').addEventListener('click', () => exportExcel('errors'));
  bindHome();

  // 시험·확인용
  window.__xl = { FORMS, FORM_KEYS, genSet, genMany, valuesWorkbook, errorWorkbook, readBook, detect, valuePages, errorPages, buildPdf, openStream, readValues, readMeta, handleFile, H };
})();
