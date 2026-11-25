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
  function pageContent(doc, page) {
    const arr = page.node.normalizedEntries().Contents, parts = [];
    arr.asArray().forEach((ref) => {
      const st = doc.context.lookup(ref), u = st instanceof PDFLib.PDFRawStream ? PDFLib.decodePDFRawStream(st).decode() : st.getContents();
      parts.push(u, new Uint8Array([10]));
    });
    const out = new Uint8Array(parts.reduce((a, u) => a + u.length, 0)); let o = 0;
    parts.forEach((u) => { out.set(u, o); o += u.length; });
    return out;
  }
  async function openStream(bytes, pageNo) {
    const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true }), page = doc.getPage(pageNo || 0);
    return new Stream(pageContent(doc, page), page.getHeight());
  }
  // 서식 PDF 의 글자 덩어리 수와 제목으로 어느 서식인지 알아본다 (다르면 null)
  function identify(S) {
    const n = S.runs.length, t = (i) => (S.runs[i] ? S.runs[i].text : '');
    if (n === 288 && clean(t(3)) === '구급활동일지') return 'log';
    if (n === 268 && t(0).indexOf('심뇌혈관질환자') >= 0) return 'cv';
    if (n === 234 && t(0).indexOf('중증외상환자') >= 0) return 'trauma';
    return null;
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
  async function genSet(kind, level, seed, withPdf) {
    const rng = makeRng(seed), cfg = CONFIGS[kind] || CONFIGS.both;
    const c = makeCtx(rng, cfg.scen || (rng() < 0.5 ? 'stroke' : 'trauma')), want = cfg.want, chosen = {};
    want.forEach((f) => { chosen[f] = pickErrors(c, ERR[f], level); });
    Object.values(chosen).flat().forEach((e) => e.plan && e.plan(c, level));
    const out = { seed, serial: c.serial, forms: {}, notes: [], pdfs: [] };
    for (const f of want) {
      const t = await loadTemplate(FORMS[f].tpl);
      const refs = f === 'log' ? buildLog(t.stream, c) : f === 'cv' ? buildCv(t.stream, c) : buildTrauma(t.stream, c), flags = new Set();
      chosen[f].forEach((e) => {
        const before = t.stream.runs.map((r) => r.text), detail = e.apply(t.stream, refs, c);
        t.stream.runs.forEach((r, i) => { if (r.text !== before[i] && FORMS[f].runField[i]) flags.add(FORMS[f].runField[i].item); });
        out.notes.push([FORMS[f].title, e.desc, detail, (e.rules.length && e.id === 'L-SP' ? Array(c.spBad).fill('SP') : e.rules).join('·')]);
      });
      out.forms[f] = { meta: readMeta(f, t.stream), values: readValues(f, t.stream), flags };
      if (withPdf) out.pdfs.push({ name: '랜덤_' + ({ log: '일지', cv: '심뇌혈관', trauma: '중증외상' })[f] + '_' + c.serial + '.pdf', bytes: await finishZ(t) });
    }
    return out;
  }
  async function genMany(n, kind, level, base, onProgress, withPdf) {
    const sets = [];
    for (let k = 0; k < n; k++) { if (onProgress) onProgress(k + 1, n); await tick(); sets.push(await genSet(kind, level, base + k, withPdf)); }
    return sets;
  }
  const colWidths = (cols) => cols.map((c) => ({ wch: Math.min(40, Math.max(8, String(c).length * 2)) }));
  const xlsxBlob = (wb) => new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // rowsBy: { log: [{meta, values}], cv: [...], trauma: [...] }
  function workbookFromRows(rowsBy, badPages) {
    const wb = XLSX.utils.book_new();
    FORM_KEYS.forEach((k) => {
      const rows = rowsBy[k] || []; if (!rows.length) return;
      const cols = META.concat(FORMS[k].F.map((f) => f[0]));
      const aoa = [cols].concat(rows.map((x) => [x.meta.id, x.meta.station, x.meta.center, x.meta.time].concat(FORMS[k].F.map((f) => x.values[f[0]]))));
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
      ['· 열에 없는 칸(서식 고정 글자 등)은 서식 기본 모양 그대로 나옵니다. 이 엑셀을 [엑셀 → PDF]에 올리면 같은 서식의 PDF가 됩니다.']];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(help), '안내');
    if (badPages && badPages.length) {
      const bad = [['파일', '쪽', '이유']].concat(badPages.map((x) => [x.file, x.page, x.reason]));
      const bs = XLSX.utils.aoa_to_sheet(bad); bs['!cols'] = [{ wch: 40 }, { wch: 6 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, bs, '읽지못한쪽');
    }
    return wb;
  }
  function valuesWorkbook(sets) {
    const rowsBy = {};
    FORM_KEYS.forEach((k) => { rowsBy[k] = sets.filter((s) => s.forms[k]).map((s) => ({ meta: Object.assign({}, s.forms[k].meta, { id: s.forms[k].meta.id || s.serial }), values: s.forms[k].values })); });
    return workbookFromRows(rowsBy);
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
    const notes = [['보고서번호', '서식', '일부러 넣은 오류', '내용', '기대 지적']];
    sets.forEach((s) => { if (s.notes.length) s.notes.forEach((n) => notes.push([s.serial, n[0], n[1], n[2], n[3]])); else notes.push([s.serial, '', '(없음)', '', '']); });
    const ns = XLSX.utils.aoa_to_sheet(notes); ns['!cols'] = [{ wch: 24 }, { wch: 22 }, { wch: 40 }, { wch: 60 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ns, '정답표');
    return wb;
  }
  function saveBlob(name, blob) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }


  /* ================= 화면: 한 화면 세 부분 (① 만들기 · ② 엑셀 → PDF · ③ PDF → 엑셀) ================= */
  const mb = (n) => (n / 1048576).toFixed(1) + 'MB';
  const xlsxBytes = (wb) => new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }));
  function panel(id) {
    const q = (k) => $('#' + id + '-' + k), P = { id, q, res: null, busy: false };
    P.err = (m) => { q('err').textContent = m || ''; };
    P.prog = (label, n, t) => { q('prog').hidden = false; q('plabel').textContent = label + ' ' + n + ' / ' + t; q('bar').style.width = Math.round((n / t) * 100) + '%'; };
    P.endProg = () => { q('prog').hidden = true; };
    P.done = (title, sub, res) => { P.res = res; q('title').textContent = title; q('sub').textContent = sub || ''; q('done').hidden = false; };
    P.clear = () => { P.res = null; P.err(''); q('done').hidden = true; q('prog').hidden = true; };
    q('save').addEventListener('click', () => { if (P.res) saveBlob(P.res.name, P.res.blob); });
    if (q('open')) q('open').addEventListener('click', () => { if (P.res) window.open(URL.createObjectURL(P.res.blob), '_blank'); });
    return P;
  }
  // 파일 놓기: 부분(section) 전체가 놓는 자리
  function wireDrop(id, onFiles, multiple) {
    const sec = $('#' + id), drop = $('#' + id + '-drop'), input = $('#' + id + '-file');
    input.addEventListener('change', () => { if (input.files.length) onFiles([...input.files]); input.value = ''; });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    ['dragenter', 'dragover'].forEach((ev) => sec.addEventListener(ev, (e) => { e.preventDefault(); sec.classList.add('over'); }));
    sec.addEventListener('dragleave', (e) => { if (!sec.contains(e.relatedTarget)) sec.classList.remove('over'); });
    sec.addEventListener('drop', (e) => {
      e.preventDefault(); sec.classList.remove('over');
      const fs = [...e.dataTransfer.files]; if (fs.length) onFiles(multiple ? fs : fs.slice(0, 1));
    });
  }
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  /* ---------- ② 엑셀 → PDF ---------- */
  const P2 = panel('p2');
  let B2 = { book: null, kind: null };
  function p2Reset() {
    B2 = { book: null, kind: null }; P2.clear();
    P2.q('card').hidden = true; P2.q('drop').hidden = false; P2.q('samples').hidden = false;
  }
  function p2Describe(book, kind) {
    const parts = [], ids = new Set(), centers = new Set();
    FORM_KEYS.forEach((k) => {
      const sh = book[kind === 'values' ? FORMS[k].sheet : FORMS[k].errSheet]; if (!sh) return;
      sh.rows.forEach((r) => { ids.add(String(r[0]).trim()); if (String(r[2]).trim()) centers.add(String(r[2]).trim()); });
      parts.push(FORMS[k].title + ' ' + sh.rows.length + '건');
    });
    return parts.join(' · ') + (centers.size ? ' · 센터 ' + centers.size + '곳' : '');
  }
  async function p2Convert() {
    if (P2.busy || !B2.book) return;
    P2.busy = true; P2.clear();
    try {
      const zip = B2.kind === 'errors' && $('input[name=p2-out]:checked').value === 'zip';
      const pages = B2.kind === 'values' ? valuePages(B2.book) : errorPages(B2.book, $('#p2-exc').checked);
      if (!pages.length) throw new Error(B2.kind === 'errors' ? '수정이 필요한 일지(1로 표시된 칸)가 없습니다' : '변환할 줄이 없습니다');
      let res;
      if (zip) {
        const files = [], groups = byCenter(pages); let done = 0;
        for (const c of Object.keys(groups).sort()) { files.push({ name: '일지_' + c + '.pdf', data: await buildPdf(groups[c], (n) => P2.prog('만드는 중', done + n, pages.length)) }); done += groups[c].length; }
        res = { name: 'ilji_marked_by_center.zip', blob: makeZip(files) };
        P2.done(pages.length + '쪽 완성 · ' + mb(res.blob.size), '센터 ' + files.length + '곳의 PDF를 ZIP으로 묶었어요', res);
      } else {
        const bytes = await buildPdf(pages, (n, t) => P2.prog('만드는 중', n, t));
        res = { name: B2.kind === 'values' ? 'ilji_from_excel.pdf' : 'ilji_marked.pdf', blob: new Blob([bytes], { type: 'application/pdf' }) };
        P2.done(pages.length + '쪽 완성 · ' + mb(res.blob.size), B2.kind === 'values' ? '값을 채운 구급일지·세부상황표예요' : '고칠 칸이 빨갛게 표시됐어요', res);
      }
      P2.q('open').hidden = res.name.endsWith('.zip');
    } catch (e) { console.error(e); P2.err('만들지 못했습니다: ' + (e.message || e)); }
    P2.endProg(); P2.busy = false;
  }
  async function p2Handle(files) {
    if (P2.busy || !files.length) return;
    p2Reset();
    const file = files[0];
    if (/\.pdf$/i.test(file.name)) { P2.err('PDF는 오른쪽 ③ 부분에 놓아 주세요. 이 부분은 엑셀 전용입니다'); return; }
    try {
      B2.book = await readBook(file); B2.kind = detect(B2.book);
      if (!B2.kind) throw new Error('이 엑셀이 어떤 종류인지 알아보지 못했습니다. 값 엑셀(시트 이름: 일지값) 또는 월별 오류 엑셀(앞 4열 + 항목별 0/1)을 올려 주세요');
    } catch (e) { P2.err(e.message || String(e)); B2.book = null; return; }
    const values = B2.kind === 'values';
    P2.q('name').textContent = file.name;
    P2.q('kind').textContent = values ? '값 엑셀로 인식했어요' : '오류 엑셀(0/1)로 인식했어요';
    P2.q('info').textContent = p2Describe(B2.book, B2.kind);
    P2.q('opts').hidden = values;
    P2.q('drop').hidden = true; P2.q('samples').hidden = true; P2.q('card').hidden = false;
    await p2Convert();
  }

  /* ---------- 일지 점검 (PDF → 0/1 엑셀) ----------
     구급빨간펜의 기준을 일지 값(readValues)에 적용한다. 공식 완결성 점검 기준이 아니라 빨간펜 기준이다. */
  const LOG_RULES = [
    ['필수 칸 비어 있음', '구급빨간펜 oz2025.REQ 와 같은 기준으로 항목이 비어 있으면 1. 29.의료지도는 선택, 18.환자직업은 2025 서식에서 삭제돼 점검하지 않음. 미이송으로 판단되면 현장출발·병원도착·환자분류·이송기관은 제외'],
    ['L-05 시각 순서', '신고 → 출동 → 현장도착 → 환자접촉 → 현장출발 → 병원도착 순서에서 뒤 시각이 앞보다 빠르면 뒤 항목을 1 (자정 넘김은 같은 날로 보지 않음)'],
    ['L-06 활력징후 범위', '맥박 20~250, 호흡 4~60, 체온 30~43, SpO2 50~100 밖이면 25.활력징후를 1'],
    ['L-07 혈압', '수축기 40~300, 이완기 20~200, 이완기가 수축기 이상이면 25.활력징후를 1 (0/0 제외)'],
    ['L-04 주호소', '주호소가 비어 있으면 27.평가소견을 1. 혈압이 1·2회 모두 비어 있으면(측정불가·거부 체크가 없을 때) 25.활력징후를 1'],
    ['L-10 측정 시각', '의식상태·활력징후 측정 시각이 환자접촉보다 앞서거나 병원도착보다 늦으면 23.의식상태 / 25.활력징후를 1'],
    ['L-11 의식상태 체크', '의식상태 1차·2차에 두 개 이상 체크했거나, 2차 시각은 있는데 체크가 없으면 23.의식상태를 1'],
  ];
  function checkLog(v) {
    const flags = new Set(), why = [], g = (k) => String(v[k] == null ? '' : v[k]).trim();
    const add = (item, rule, text) => { flags.add(item); why.push([item, rule, text]); };
    const tok = (val, ign) => val.split(' ').filter((t) => t && ign.indexOf(t) < 0).some((t) => /[0-9A-Za-z가-힣]/.test(t));
    const tm = (x) => { const m = /(\d{1,2}):(\d{2})/.exec(x || ''); return m ? +m[1] * 60 + +m[2] : null; };
    // 이송 / 미이송 판단 (구급빨간펜 teamDecide 와 같은 순서)
    const has = (k, re) => new RegExp(re).test(g(k));
    const transport = g('30.이송기관명(1차)') ? true : g('미이송') ? false : has('22.질병외 세부', '자연재해|단순주취') ? false : !!g('22.환자발생유형');
    const need = (item, ok, what) => { if (!ok) add(item, '필수 칸 비어 있음', what + ' 칸이 비어 있습니다'); };
    need('1.소속', !!g('1.소속'), '소속');
    need('2.차량번호', /\d/.test(g('2.차량번호')), '차량번호');
    need('3.구급구분', !!g('3.구급구분'), '구급구분');
    need('4.신고일시', tm(g('4.신고일시')) != null, '신고일시');
    need('5.출동일시', tm(g('5.출동일시')) != null, '출동일시');
    need('6.현장도착일시', tm(g('6.현장도착일시')) != null, '현장도착일시');
    need('7.환자접촉일시', tm(g('7.환자접촉일시')) != null, '환자접촉일시');
    need('8.현장과의거리', /\d/.test(g('8.현장과의거리')), '현장과의 거리');
    if (transport) { need('9.현장출발일시', tm(g('9.현장출발일시')) != null, '현장출발일시'); need('10.병원도착일시', tm(g('10.병원도착일시')) != null, '병원도착일시'); }
    need('11.귀소일시', tm(g('11.귀소일시')) != null, '귀소일시');
    need('12.신고자번호', /\d/.test(g('12.신고자번호')), '신고자 전화번호');
    need('13.신고방법', !!g('13.신고방법'), '신고방법');
    need('14.환자성명', !!g('14.환자성명'), '환자 성명');
    need('15.환자나이', /\d/.test(g('15.환자나이')), '환자 나이');
    need('16.환자성별', !!g('16.환자성별'), '환자 성별');
    need('17.환자주소', tok(g('17.환자주소'), ['(Tel', ':', ')', '(Tel:)', '동', '호']), '환자 주소');
    need('19.환자발생 위치', tok(g('19.환자발생 위치'), ['동', '호']), '환자발생 위치');
    need('20.환자발생 장소', !!g('20.환자발생 장소'), '환자발생 장소');
    need('21.환자증상', !!g('21.환자증상'), '환자증상');
    need('22.환자발생유형', !!g('22.환자발생유형'), '환자발생유형');
    need('23.의식상태(1차)', !!g('23.의식상태(1차)'), '의식상태');
    ['24.1.동공상태_좌(1차)', '24.2.동공상태_우(1차)', '24.3.동공반응_좌(1차)', '24.4.동공반응_우(1차)'].forEach((k) => need(k, !!g(k), k.replace(/^\d+\.\d+\./, '').replace('(1차)', '')));
    need('25.활력징후', /\d/.test(g('25.활력징후(1회)') + g('25.활력징후(2회)')), '활력징후');
    if (transport) need('26.환자분류', !!g('26.환자분류'), '환자분류');
    need('27.평가소견', !!g('27.평가소견'), '구급대원 평가소견');
    if (!g('27.주호소')) add('27.평가소견', 'L-04 주호소', '주호소가 비어 있습니다');
    need('28.응급처치', !!g('28.응급처치'), '응급처치');
    if (transport) need('30.환자이송', !!g('30.이송기관명(1차)'), '이송기관명');
    need('31.이송자', ['31.구급대원(1) 자격', '31.구급대원(2) 자격', '31.운전요원 자격', '31.기타 자격'].some((k) => !!g(k)), '출동인원 자격');
    need('32.장애요인', !!g('32.장애요인'), '장애요인');
    // L-05 시각 순서
    const seq = [['4.신고일시', '신고'], ['5.출동일시', '출동'], ['6.현장도착일시', '현장도착'], ['7.환자접촉일시', '환자접촉'], ['9.현장출발일시', '현장출발'], ['10.병원도착일시', '병원도착']];
    let prev = null;
    seq.forEach(([k, nm]) => {
      const t = tm(g(k)); if (t == null) return;
      if (prev && t < prev[0]) add(k, 'L-05 시각 순서', nm + ' ' + g(k).replace(/^.* /, '') + '이(가) ' + prev[1] + ' ' + prev[2] + '보다 빠릅니다');
      prev = [t, nm, g(k).replace(/^.* /, '')];
    });
    // L-10 측정 시각 (환자접촉 ~ 병원도착 사이여야 함)
    const tc = tm(g('7.환자접촉일시')), th = tm(g('10.병원도착일시')), within = (item, label, t) => {
      if (t == null) return;
      if (tc != null && t < tc) add(item, 'L-10 측정 시각', label + ' 측정 시각이 환자접촉보다 앞섭니다');
      else if (th != null && t > th) add(item, 'L-10 측정 시각', label + ' 측정 시각이 병원도착보다 늦습니다');
    };
    within('23.의식상태(1차)', '의식상태 1차', tm(g('23.의식상태(1차) 시각')));
    within('23.의식상태(1차)', '의식상태 2차', tm(g('23.의식상태(2차) 시각')));
    within('25.활력징후', '활력징후 1회', tm(g('25.활력징후(1회)').split('|')[0]));
    within('25.활력징후', '활력징후 2회', tm(g('25.활력징후(2회)').split('|')[0]));
    // L-11 의식상태 체크
    [['23.의식상태(1차)', '1차'], ['23.의식상태(2차)', '2차']].forEach(([k, nm]) => { if (g(k).split(',').filter((x) => x.trim()).length >= 2) add('23.의식상태(1차)', 'L-11 의식상태 체크', '의식상태 ' + nm + '에 두 개 이상 체크했습니다'); });
    if (tm(g('23.의식상태(2차) 시각')) != null && !g('23.의식상태(2차)')) add('23.의식상태(1차)', 'L-11 의식상태 체크', '의식상태 2차 시각은 있는데 A·V·P·U 체크가 없습니다');
    // L-04b 혈압이 모두 비어 있음
    if (!g('25.활력징후 측정불가/거부') && !/\d+\s*\/\s*\d+/.test(g('25.활력징후(1회)').split('|')[1] || '') && !/\d+\s*\/\s*\d+/.test(g('25.활력징후(2회)').split('|')[1] || '') && /\d/.test(g('25.활력징후(1회)') + g('25.활력징후(2회)'))) add('25.활력징후', 'L-04 주호소', '혈압이 1·2회차 모두 비어 있습니다(측정 불가·거부면 그 칸 체크)');
    // L-06, L-07 활력징후
    [['25.활력징후(1회)', '1회'], ['25.활력징후(2회)', '2회']].forEach(([k, nm]) => {
      const p = g(k).split('|').map((x) => x.trim()), num = (x) => { const m = /(\d+(?:\.\d+)?)/.exec(x || ''); return m ? +m[1] : null; };
      const chk = (label, val, lo, hi) => { if (val != null && (val < lo || val > hi)) add('25.활력징후', 'L-06 활력징후 범위', nm + ' ' + label + ' ' + val + '이(가) 입력 범위(' + lo + '~' + hi + ')를 벗어남'); };
      chk('맥박', num(p[2]), 20, 250); chk('호흡', num(p[3]), 4, 60); chk('체온', num(p[4]), 30, 43); chk('SpO2', num(p[5]), 50, 100);
      const bp = /(\d+)\s*\/\s*(\d+)/.exec(p[1] || '');
      if (bp && !(+bp[1] === 0 && +bp[2] === 0)) {
        const sy = +bp[1], di = +bp[2];
        if (sy < 40 || sy > 300 || di < 20 || di > 200 || di >= sy) add('25.활력징후', 'L-07 혈압', nm + ' 혈압 ' + sy + '/' + di + '이(가) 형식·범위에 맞지 않습니다');
      }
    });
    return { flags, why, transport };
  }
  // rows: [{meta, values}] (일지만) → 0/1 엑셀 (시트 오류위치 · 점검사유 · 점검기준)
  function checkWorkbook(rows) {
    const wb = XLSX.utils.book_new(), cols = META.concat(ITEMS), res = rows.map((r) => checkLog(r.values));
    const aoa = [cols].concat(rows.map((r, i) => [r.meta.id, r.meta.station, r.meta.center, r.meta.time].concat(ITEMS.map((it) => (res[i].flags.has(it) ? '1' : '0')))));
    const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = colWidths(cols);
    XLSX.utils.book_append_sheet(wb, ws, FORMS.log.errSheet);
    const why = [['보고서번호', '항목', '기준', '내용']];
    rows.forEach((r, i) => res[i].why.forEach((w) => why.push([r.meta.id, w[0], w[1], w[2]])));
    const wsw = XLSX.utils.aoa_to_sheet(why); wsw['!cols'] = [{ wch: 24 }, { wch: 22 }, { wch: 22 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, wsw, '점검사유');
    const rules = [['점검 기준', '설명']].concat(LOG_RULES, [['한계', '구급일지(이송·미이송) 한 종류만 점검합니다. 세부상황표는 점검하지 않습니다. 구급빨간펜의 기준이며 구급정보시스템 공식 완결성 점검 기준과 같지 않을 수 있습니다. 이 엑셀을 ②에 올리면 1인 칸이 빨갛게 표시된 PDF가 됩니다']]);
    const wsr = XLSX.utils.aoa_to_sheet(rules); wsr['!cols'] = [{ wch: 22 }, { wch: 120 }];
    XLSX.utils.book_append_sheet(wb, wsr, '점검기준');
    return { wb, res };
  }

  /* ---------- ③ PDF → 엑셀 ---------- */
  const P3 = panel('p3');
  function p3Reset() { P3.clear(); P3.q('card').hidden = true; P3.q('drop').hidden = false; P3.q('samples').hidden = false; }
  async function p3Handle(files) {
    if (P3.busy || !files.length) return;
    p3Reset(); P3.res2 = null;
    const pdfs = files.filter((f) => /\.pdf$/i.test(f.name));
    if (!pdfs.length) { P3.err('PDF 파일을 놓아 주세요. 엑셀은 가운데 ② 부분에 놓습니다'); return; }
    P3.busy = true;
    P3.q('name').textContent = pdfs.length === 1 ? pdfs[0].name : pdfs[0].name + ' 외 ' + (pdfs.length - 1) + '개';
    P3.q('kind').textContent = 'PDF ' + pdfs.length + '개를 읽는 중';
    P3.q('info').textContent = '';
    P3.q('drop').hidden = true; P3.q('samples').hidden = true; P3.q('card').hidden = false;
    try {
      const rowsBy = { log: [], cv: [], trauma: [] }, bad = [], docs = [];
      for (const f of pdfs) {
        try { docs.push({ f, doc: await PDFLib.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true }) }); }
        catch (e) { bad.push({ file: f.name, page: '', reason: 'PDF를 열지 못했습니다' }); }
      }
      const total = docs.reduce((a, d) => a + d.doc.getPageCount(), 0); let n = 0;
      for (const { f, doc } of docs) {
        for (let i = 0; i < doc.getPageCount(); i++) {
          P3.prog('읽는 중', ++n, total); await tick();
          try {
            const page = doc.getPage(i), S = new Stream(pageContent(doc, page), page.getHeight()), form = identify(S);
            if (!form) { bad.push({ file: f.name, page: i + 1, reason: '알려진 서식이 아닙니다(글자 덩어리 ' + S.runs.length + '개). 구급정보시스템 출력본이나 이 변환기가 만든 PDF만 읽습니다' }); continue; }
            rowsBy[form].push({ meta: readMeta(form, S), values: readValues(form, S) });
          } catch (e) { bad.push({ file: f.name, page: i + 1, reason: '읽지 못했습니다: ' + (e.message || e) }); }
        }
      }
      const read = rowsBy.log.length + rowsBy.cv.length + rowsBy.trauma.length;
      if (!read) throw new Error('읽을 수 있는 구급일지·세부상황표가 없습니다. ' + (bad[0] ? bad[0].reason : ''));
      const blob = new Blob([xlsxBytes(workbookFromRows(rowsBy, bad))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      P3.q('kind').textContent = '구급일지 PDF로 인식했어요';
      P3.q('info').textContent = '일지 ' + rowsBy.log.length + ' · 심뇌혈관 ' + rowsBy.cv.length + ' · 중증외상 ' + rowsBy.trauma.length + (bad.length ? ' · 읽지 못한 쪽 ' + bad.length : '');
      let sub = bad.length ? '읽지 못한 쪽은 엑셀의 [읽지못한쪽] 시트에 적었어요' : '값 엑셀 시트: 일지값 · 심뇌혈관 · 중증외상';
      if (rowsBy.log.length) {
        const ck = checkWorkbook(rowsBy.log), bad1 = ck.res.filter((x) => x.flags.size).length;
        P3.res2 = { name: 'ilji_errors_from_pdf.xlsx', blob: new Blob([xlsxBytes(ck.wb)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) };
        sub += ' · 일지 점검: 고칠 곳 있는 일지 ' + bad1 + '건 / 이상 없음 ' + (rowsBy.log.length - bad1) + '건';
      }
      P3.q('save2').hidden = !P3.res2;
      P3.done(read + '쪽을 엑셀로 옮겼어요 · ' + mb(blob.size), sub, { name: 'ilji_values_from_pdf.xlsx', blob });
    } catch (e) { console.error(e); P3.err(e.message || String(e)); P3.q('card').hidden = true; P3.q('drop').hidden = false; P3.q('samples').hidden = false; }
    P3.endProg(); P3.busy = false;
  }

  /* ---------- ① 랜덤 일지 만들기 ---------- */
  const P1 = panel('p1');
  function keyText(sets) {
    const L = [];
    sets.forEach((s) => {
      L.push('[정답표] 시드 ' + s.seed + ' · 일련번호 ' + s.serial, '교정지에 이 PDF들을 올렸을 때, 아래 "일부러 넣은 오류"가 모두 지적으로 나와야 합니다.', '');
      Object.keys(s.forms).forEach((k) => {
        L.push('■ ' + FORMS[k].title);
        const ns = s.notes.filter((x) => x[0] === FORMS[k].title);
        if (!ns.length) L.push('  (일부러 넣은 오류 없음 — 정상본: 지적 0건이어야 함)');
        ns.forEach((x) => L.push('  - ' + x[1] + ': ' + x[2] + '  → 기대 지적: ' + x[3]));
        L.push('');
      });
    });
    return L.join('\n');
  }
  // 연습용 파일 한 가지를 만들어 바로 받는다. which: 'pdf'(PDF) | 'xv'(값 엑셀) | 'xe'(오류 위치 0/1 엑셀)
  async function p1Make(which) {
    if (P1.busy) return;
    P1.busy = true; P1.clear();
    const btns = ['#p1-pdf', '#p1-xv', '#p1-xe'].map((x) => $(x)); btns.forEach((x) => { x.disabled = true; });
    try {
      const wantPdf = which === 'pdf', zip = wantPdf && $('#p1-zip').checked;
      const kind = $('#p1-kind').value, level = +$('#p1-level').value, maxN = wantPdf ? 100 : 500;
      const n = Math.max(1, Math.min(maxN, +$('#p1-n').value || 1)); $('#p1-n').value = n;
      let s = $('#p1-seed').value.trim();
      if (!s) { s = String(Math.floor(Math.random() * 1e8)); $('#p1-seed').value = s; } // 세 버튼이 같은 일지가 되도록 시드를 칸에 남긴다
      const base = parseInt(s, 10) || [...s].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7);
      const sets = await genMany(n, kind, level, base, (k, t) => P1.prog('일지 세트 만드는 중', k, t), wantPdf);
      let res, what;
      if (which === 'xv') { res = { name: 'ilji_values.xlsx', blob: xlsxBlob(valuesWorkbook(sets)) }; what = '값 엑셀'; }
      else if (which === 'xe') { res = { name: 'ilji_errors_01.xlsx', blob: xlsxBlob(errorWorkbook(sets)) }; what = '0/1 엑셀'; }
      else if (zip) {
        const files = []; sets.forEach((x) => x.pdfs.forEach((p) => files.push({ name: p.name, data: p.bytes })));
        files.push({ name: '정답표.txt', data: new TextEncoder().encode(keyText(sets)) });
        res = { name: 'ilji_random_' + base + '.zip', blob: makeZip(files) }; what = '문서별 PDF + 정답표 ZIP';
      } else {
        const all = sets.flatMap((x) => x.pdfs), out = await PDFLib.PDFDocument.create();
        for (let i = 0; i < all.length; i++) { P1.prog('PDF 합치는 중', i + 1, all.length); await tick(); out.addPage((await out.copyPages(await PDFLib.PDFDocument.load(all[i].bytes), [0]))[0]); }
        res = { name: 'ilji_random_' + base + '.pdf', blob: new Blob([await out.save()], { type: 'application/pdf' }) }; what = 'PDF 한 개(' + all.length + '쪽)';
      }
      saveBlob(res.name, res.blob);
      P1.done(what + ' 저장 · ' + mb(res.blob.size), '시드 ' + base + (n > 1 ? '~' + (base + n - 1) : '') + ' · 시드·구성·오류 수준이 같으면 세 파일은 같은 일지예요', res);
    } catch (e) { console.error(e); P1.err('만들지 못했습니다: ' + (e.message || e)); }
    P1.endProg(); P1.busy = false; btns.forEach((x) => { x.disabled = false; });
  }

  /* ---------- 연결 ---------- */
  wireDrop('p2', p2Handle, false);
  wireDrop('p3', p3Handle, true);
  $('#p2-again').addEventListener('click', p2Reset);
  $('#p3-again').addEventListener('click', p3Reset);
  $('#p3-save2').addEventListener('click', () => { if (P3.res2) saveBlob(P3.res2.name, P3.res2.blob); });
  $('#p2-exc').addEventListener('change', p2Convert);
  document.querySelectorAll('input[name=p2-out]').forEach((r) => r.addEventListener('change', p2Convert));
  $('#p1-pdf').addEventListener('click', () => p1Make('pdf'));
  $('#p1-xv').addEventListener('click', () => p1Make('xv'));
  $('#p1-xe').addEventListener('click', () => p1Make('xe'));
  $('#p1-again').addEventListener('click', () => P1.clear());
  const orig = $('#x-gen'), tog = $('#x-orig');
  if (orig && tog) tog.addEventListener('click', () => { orig.hidden = !orig.hidden; tog.textContent = orig.hidden ? '원래 생성기 화면(문서별 미리보기·정답표) 열기' : '원래 생성기 화면 닫기'; });

  // 시험·확인용
  window.__xl = { FORMS, FORM_KEYS, genSet, genMany, valuesWorkbook, errorWorkbook, workbookFromRows, readBook, detect, valuePages, errorPages, buildPdf, openStream, readValues, readMeta, identify, pageContent, checkLog, checkWorkbook, p1Make, p2Handle, p3Handle };
})();
