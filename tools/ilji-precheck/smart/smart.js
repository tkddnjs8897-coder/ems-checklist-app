/* 스마트 시스템 구급일지 엑셀 → 구급활동일지 PDF 복원
   · 엑셀의 시스템 항목(271열)을 구급정보시스템 출력 서식(2025)의 칸에 맞춰 넣는다
   · 서식 PDF 글자 편집은 구급빨간펜 생성기의 엔진(stream.js)을 옮겨 쓴다
   · 모든 처리는 이 브라우저 안에서만 한다(엑셀 내용은 어디로도 보내지 않는다) */
(() => {
  const $ = (s) => document.querySelector(s);
  const TPL_B64 = '/*__TPL__*/';
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /* ================= 서식 칸 변환표 =================
     [칸 이름, 종류, 서식 PDF 글자 덩어리 번호들, 보조값]  (종류: 생성기 변환기와 같은 규칙) */
  const F = [
    ['1.소속', 'join', [0, 1]], ['1.소속(지역대)', 'text', [2]], ['센터전화', 'text', [7]],
    ['2.차량번호', 'text', [9]], ['3.구급구분', 'check', [11]], ['4.신고일시', 'datetime', [15, 21]],
    ['12.신고자번호', 'text', [18]], ['13.신고방법', 'check', [20]],
    ['5.출동일시', 'text', [34]], ['6.현장도착일시', 'text', [39]], ['7.환자접촉일시', 'text', [41]], ['8.현장과의거리', 'text', [52]],
    ['9.현장출발일시', 'text', [57]], ['10.병원도착일시', 'text', [60]], ['11.귀소일시', 'text', [69]],
    ['14.환자성명', 'text', [26]], ['15.환자나이', 'text', [28]], ['16.환자성별', 'check', [30]], ['환자생년월일', 'text', [32]],
    ['17.환자주소', 'text', [36]], ['17.외국인', 'check', [37]],
    ['보호자성명', 'text', [44]], ['보호자관계', 'text', [46]], ['보호자전화', 'text', [48]],
    ['19.환자발생 위치', 'text', [50]], ['20.환자발생 장소', 'check', [55, 58]],
    ['21.환자증상', 'check', [65, 67, 70, 74, 78]], ['출동유형', 'check', [72, 73, 75, 76, 77]],
    ['22.환자발생유형', 'check', [82, 87, 97]], ['22.병력', 'check', [84, 85, 86]],
    ['22.질병외 세부', 'check', [88, 90, 91, 92, 93, 94, 95, 96, 98]],
    ['23.의식상태(1차)', 'check', [104]], ['23.의식상태(1차) 시각', 'paren', [103]],
    ['23.의식상태(2차)', 'check', [107]], ['23.의식상태(2차) 시각', 'paren', [106]],
    ['24.1.동공상태_좌(1차)', 'check', [111]], ['24.2.동공상태_우(1차)', 'check', [114]],
    ['24.3.동공반응_좌(1차)', 'check', [112]], ['24.4.동공반응_우(1차)', 'check', [115]],
    ['25.활력징후 측정불가/거부', 'check', [117, 118]],
    ['25.활력징후(1회)', 'multi', [126, 127, 128, 129, 130, 131]], ['25.활력징후(2회)', 'multi', [133, 134, 135, 136, 137, 138]],
    ['26.환자분류', 'check', [141]],
    ['27.주호소', 'prefix', [144], 'ㆍ주 호소:'], ['27.발생시간', 'onset', [145]], ['27.평가소견', 'lines', [146, 147, 148]],
    ['28.산소투여 유량(L/min)', 'lpm', [155]], ['28.응급처치', 'check', [154, 155, 156, 157, 158]],
    ['29.의료지도', 'check', [162, 166, 169, 173, 174, 175, 176, 181, 182, 183]], ['29.의료지도 의사성명', 'text', [180]],
    ['30.이송기관명(1차)', 'chunks', [194, 195, 196, 197]], ['30.관할(1차)', 'check', [198]], ['30.타시도(1차)', 'check', [212]],
    ['30.도착시간(1차)', 'text', [199]], ['30.거리(1차)', 'paren', [214]], ['30.선정자(1차)', 'check', [200, 201, 202]],
    ['30.재이송사유(1차)', 'check', [203, 204, 205, 206]], ['30.인수자(1차)', 'check', [207, 208, 209, 210]], ['30.인수자성명(1차)', 'text', [211]],
    ['30.이송기관명(2차)', 'text', [217]], ['30.관할(2차)', 'check', [218]], ['30.타시도(2차)', 'check', [232]],
    ['30.도착시간(2차)', 'text', [219]], ['30.거리(2차)', 'paren', [233]], ['30.선정자(2차)', 'check', [220, 221, 222]],
    ['30.재이송사유(2차)', 'check', [223, 224, 225, 226]], ['30.인수자(2차)', 'check', [227, 228, 229, 230]], ['30.인수자성명(2차)', 'text', [231]],
    ['공동대응', 'check', [236, 239]], ['미이송', 'check', [244]],
    ['31.구급대원(1) 자격', 'check', [251]], ['31.구급대원(1) 계급', 'text', [253]], ['31.구급대원(1) 성명', 'text', [255]],
    ['31.구급대원(2) 자격', 'check', [258]], ['31.구급대원(2) 계급', 'text', [260]], ['31.구급대원(2) 성명', 'text', [262]],
    ['31.운전요원 자격', 'check', [265]], ['31.운전요원 계급', 'text', [267]], ['31.운전요원 성명', 'text', [269]], ['31.기타 자격', 'check', [272]],
    ['32.장애요인', 'check', [278, 279]], ['재난번호', 'text', [284]],
    ['출력자', 'prefix', [285], '출력자 :'], ['출력일시', 'prefix', [287], '출력 일시 :'],
  ];
  const FIELD = {}; F.forEach((f) => { FIELD[f[0]] = f; });

  /* ================= 칸 읽기·쓰기 보조 (생성기 변환기와 같은 방식) ================= */
  function parseOpts(text) {
    const re = /\[\s*(√?)\s*\]/g, hits = []; let m;
    while ((m = re.exec(text))) hits.push({ at: m.index, len: m[0].length, on: m[1] === '√' });
    return hits.map((h, i) => {
      const end = i + 1 < hits.length ? hits[i + 1].at : text.length;
      const lab = text.slice(h.at + h.len, end).split(/[()■]|\s{2,}/)[0].replace(/\s+/g, ' ').trim();
      return Object.assign({ lab }, h);
    });
  }
  function fieldOpts(S, f) {
    const seen = {}, out = [];
    f[2].forEach((ri, pos) => parseOpts(S.runs[ri].text).forEach((o, k) => {
      const base = o.lab || ('옵션' + (pos + 1) + '-' + (k + 1));
      seen[base] = (seen[base] || 0) + 1;
      out.push(Object.assign({ ri, name: seen[base] > 1 ? base + '#' + seen[base] : base }, o));
    }));
    return out;
  }
  function setChecks(S, f, want) {
    const opts = fieldOpts(S, f);
    f[2].forEach((ri) => {
      let t = S.runs[ri].text;
      opts.filter((o) => o.ri === ri).sort((a, b) => b.at - a.at).forEach((o) => { t = t.slice(0, o.at) + '[' + (want.has(o.name) ? '√' : ' ') + ']' + t.slice(o.at + o.len); });
      S.set(S.runs[ri], t);
    });
  }
  function parseDT(v) {
    const s = String(v || '').trim();
    let m = /^(\d{4})\D?(\d{1,2})\D?(\d{1,2})\D*(\d{1,2})\D?(\d{2})/.exec(s);
    if (m) return { y: m[1], mo: String(m[2]).padStart(2, '0'), d: String(m[3]).padStart(2, '0'), h: String(m[4]).padStart(2, '0'), mi: m[5] };
    m = /^(\d{4})\D+(\d{1,2})\D+(\d{1,2})/.exec(s);
    return m ? { y: m[1], mo: String(m[2]).padStart(2, '0'), d: String(m[3]).padStart(2, '0'), h: '', mi: '' } : null;
  }
  function writeField(S, f, raw) {
    const [, kind, idx, arg] = f, R = idx.map((i) => S.runs[i]), val = clean(raw);
    switch (kind) {
      case 'text': S.set(R[0], val || ' '); break;
      case 'join': {
        let k = 0; while (k < val.length && S.width(val.slice(0, k + 1), R[0].size) <= 62) k++;
        S.set(R[0], val.slice(0, k) || ' '); R.slice(1).forEach((r, i) => S.set(r, i === 0 ? (val.slice(k) || ' ') : ' ')); break;
      }
      case 'paren': S.set(R[0], /^km$/i.test(val) ? '(   km)' : val === ':' ? '( : )' : '(' + (val || '     ') + ')'); break;
      case 'prefix': S.set(R[0], arg + ' ' + val); break;
      case 'onset': { const m = /^(추정)?\s*(.*)$/.exec(val); S.set(R[0], !m[1] && !m[2] ? 'ㆍ발생시간(' : 'ㆍ발생시간([' + (m[1] ? '√' : ' ') + ']추정): ' + m[2]); break; } // 발생시각이 없으면 실제 출력본은 'ㆍ발생시간(' 까지만 찍는다
      case 'lpm': S.set(R[0], R[0].text.replace(/\d+(?:\.\d+)?L\/min/, (val || '0') + 'L/min')); break;
      case 'chunks': {
        const ch = Array.from(val), n = R.length, parts = [];
        for (let i = 0; i < n; i++) parts.push(ch.slice(i * 6, i === n - 1 ? ch.length : (i + 1) * 6).join(''));
        R.forEach((r, i) => S.set(r, parts[i] || ' ')); break;
      }
      case 'multi': { const p = String(raw == null ? '' : raw).split('|').map((x) => x.trim()); R.forEach((r, i) => S.set(r, p[i] || ' ')); break; }
      case 'lines': { const lines = String(raw == null ? '' : raw).split('\n'); R.forEach((r, i) => S.set(r, clean(lines[i]) || ' ')); break; }
      case 'datetime': {
        const o = parseDT(raw);
        S.set(R[0], o ? o.y + '. ' + Number(o.mo) + '. ' + Number(o.d) : ' '); S.set(R[1], o && o.h ? o.h + ':' + o.mi : ' '); break;
      }
      case 'check': setChecks(S, f, new Set(Array.isArray(raw) ? raw : String(raw == null ? '' : raw).split(/[,，\n;]/).map((x) => x.trim()).filter(Boolean))); break;
    }
  }
  // 괄호 안 자유 입력: 선택지 이름 뒤의 첫 (…) 를 바꾼다
  function fillParen(S, ri, label, txt) {
    const t = S.runs[ri].text, i = t.indexOf(label); if (i < 0) return false;
    const rest = t.slice(i + label.length), m = /\([^)]*\)/.exec(rest);
    if (!m) { if (rest.trim()) return false; S.set(S.runs[ri], t + '(' + txt + ')'); return true; } // 괄호 자리가 없고 줄 끝이면 뒤에 붙인다
    const at = i + label.length + m.index;
    S.set(S.runs[ri], t.slice(0, at) + '(' + txt + ')' + t.slice(at + m[0].length)); return true;
  }
  function moveX(run, x, topY) { // 글자 덩어리의 가로(와 세로) 위치를 바꾼다. topY 는 쪽 위에서부터의 거리
    run.head = run.head.replace(/([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) Tm/, (m, a, b, c, d, e, f) => a + ' ' + b + ' ' + c + ' ' + d + ' ' + x + ' ' + (topY == null ? f : (842 - topY).toFixed(2)) + ' Tm');
  }
  // 서식 예시 글자를 기준으로 가운데·오른쪽 정렬 (실제 출력본이 칸 안에서 값을 이렇게 정렬한다)
  function place(S, i, mode, topY) {
    const r = S.runs[i], o = S.orig[i], w = S.width(r.text, r.size);
    moveX(r, (mode === 'right' ? o.x + o.w - w : o.x + o.w / 2 - w / 2).toFixed(2), topY);
  }
  // 글자 단위 줄바꿈: 공백을 그대로 두고 폭이 차면 끊는다 (실제 출력본의 평가소견 방식)
  function charWrap(S, text, size, lim) {
    const out = [];
    String(text).split(/\r?\n/).forEach((para) => { let cur = ''; for (const ch of Array.from(para)) { if (cur && S.width(cur + ch, size) > lim) { out.push(cur); cur = ch; } else cur += ch; } out.push(cur); });
    return out;
  }

  /* ================= 서식 불러오기 ================= */
  let tplBytes = null;
  const b64ToU8 = (b64) => { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
  async function gunzipU8(u8) { return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()); }
  async function loadTemplate() {
    if (!tplBytes) tplBytes = await gunzipU8(b64ToU8(TPL_B64));
    const doc = await PDFLib.PDFDocument.load(tplBytes), page = doc.getPage(0), cs = page.node.Contents();
    const stream = new Stream(cs.getContents ? cs.getContents() : cs.contents, page.getHeight());
    stream.orig = stream.runs.map((r) => ({ x: r.x, w: stream.width(r.text, r.size) })); // 서식 예시 글자의 위치·폭(정렬 기준)
    return { doc, page, stream };
  }

  /* ================= 스마트 엑셀 한 줄 → 일지 값 ================= */
  const norm = (s) => String(s).replace(/[\s·ㆍ]/g, '').replace(/[()]/g, '');
  const hm = (s) => { const m = /(\d{1,2}):(\d{2})/.exec(String(s || '')); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };
  const hm12 = (s) => (/^\d{12}$/.test(s) ? s.slice(8, 10) + ':' + s.slice(10, 12) : '');
  const dt12 = (s) => (/^\d{12}$/.test(s) ? s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) + ' ' + s.slice(8, 10) + ':' + s.slice(10, 12) : '');
  const maskName = (s) => { const a = Array.from(clean(s)); return a.length ? a[0] + '○'.repeat(Math.max(1, a.length - 1)) : ''; };

  // opts: { mask }
  function mapRow(g, opts) {
    const yes = (k) => g(k) === '예', text = {}, checks = {}, paren = [], notes = [];
    const nm = (k) => (opts.mask ? maskName(g(k)) : g(k));
    // 소속: 열이 한 단계씩 밀려 있어 '소방서'로 끝나는 값을 소방서, 마지막 열을 센터/지역대로 본다
    const lv = [g('출동소방본부'), g('출동소방서'), g('출동안전센터_지역대')];
    const station = lv.find((x) => /소방서$/.test(x)) || lv[0], last = lv[2], parent = lv.find((x) => /센터$/.test(x) && x !== last);
    const A = /지역대$/.test(last) ? (parent || last) : last, B = /지역대$/.test(last) ? last : '';
    text['1.소속'] = A; text['1.소속(지역대)'] = B;
    text['2.차량번호'] = g('차량번호');
    checks['3.구급구분'] = [g('구급활동구분')];
    text['4.신고일시'] = g('신고년월일') && g('신고시각') ? g('신고년월일') + ' ' + hm(g('신고시각')) : '';
    checks['13.신고방법'] = [g('접수경로')];
    const tm = (k) => hm(g(k)) || ':'; // 비어 있으면 실제 출력본처럼 ':'
    text['5.출동일시'] = tm('출동시각'); text['6.현장도착일시'] = tm('현장도착시각'); text['7.환자접촉일시'] = tm('환자접촉시각');
    text['8.현장과의거리'] = g('현장과의거리') ? g('현장과의거리') + 'km' : '';
    text['9.현장출발일시'] = tm('현장출발시각'); text['10.병원도착일시'] = tm('병원도착시각'); text['11.귀소일시'] = tm('귀소시각');
    const hasPt = !!g('환자명');
    text['14.환자성명'] = nm('환자명') || '-'; text['15.환자나이'] = (g('환자연령') || '') + '세';
    checks['16.환자성별'] = [g('환자성별')];
    text['환자생년월일'] = opts.mask && g('환자주민등록번호') ? g('환자주민등록번호').slice(0, 4) + '****' : g('환자주민등록번호');
    // 주소: '시 구 동 리 번지번지 상세' 순서이고 상세주소 글자는 엑셀에 있는 그대로 쓴다 (실제 출력본 모양)
    const addr = (k) => ['시', '구', '동', '리'].map((x) => g(k + x)).filter(Boolean).join(' ') + (g(k + '번지') ? ' ' + g(k + '번지') + '번지' : '') + (g(k + '상세주소') ? ' ' + g(k + '상세주소') : '');
    const adrShort = (k) => ['시', '구', '동', '리'].map((x) => g(k + x)).filter(Boolean).join(' ');
    text['17.환자주소'] = '(Tel : ) ' + (g('환자시') ? (opts.mask ? adrShort('환자') : addr('환자')) : '');
    checks['17.외국인'] = g('외국인유무') === 'Y' ? ['외국인'] : [];
    text['19.환자발생 위치'] = opts.mask ? adrShort('긴급구조') : addr('긴급구조');
    // 발생장소: '상업시설(티롤호텔)' 처럼 괄호가 붙은 값은 선택지 + 괄호 안 글자로 나눈다
    const pl = /^([^(]+)(?:\(([^)]*)\))?$/.exec(g('발생장소'));
    if (pl) { checks['20.환자발생 장소'] = [pl[1]]; if (pl[2]) paren.push({ ri: 58, label: pl[1].trim() === '기타' ? '기타' : pl[1], txt: pl[2] }); }
    // 증상
    const SYM = { 기타통증: '그 밖의 통증', 그밖의통증기타: '그 밖의 통증' }, sym = ['환자증상1', '환자증상2', '환자증상3', '환자증상4', '환자증상5'].map(g).filter(Boolean).map((x) => SYM[x] || x);
    checks['21.환자증상'] = sym;
    if (g('구급환자증상기타내역')) {
      if (sym.indexOf('그 밖의 통증') >= 0) paren.push({ ri: 65, label: '그 밖의 통증', txt: g('구급환자증상기타내역') });
      else paren.push({ ri: 78, label: '기타', txt: g('구급환자증상기타내역') });
    }
    checks['출동유형'] = [g('긴급구조종결구분')];
    checks['22.환자발생유형'] = hasPt ? [g('환자발생유형')] : []; // 환자가 없으면 유형을 체크하지 않는다(실제 출력본)
    // 병력
    const hx = [];
    if (g('병력없음') === '예') hx.push('없음'); else if (g('병력없음') === '미상') hx.push('미상');
    [['고혈압', '고혈압'], ['당뇨', '당뇨'], ['뇌혈관질환', '뇌혈관질환'], ['폐질환', '폐질환'], ['심장질환', '심장질환'], ['결핵', '결핵'], ['간염', '간염'], ['간경화', '간경화'], ['알레르기', '알레르기'], ['암', '암'], ['신부전증', '신부전']].forEach(([c, n]) => { if (yes(c)) hx.push(n); });
    if (g('감염병(의심)')) hx.push('감염병');
    if (yes('병력기타') || g('병력기타') === '예') hx.push('기타');
    checks['22.병력'] = hx;
    if (g('암기타')) paren.push({ ri: 86, label: '암', txt: g('암기타') });
    if (g('병력기타내용')) paren.push({ ri: 86, label: '기타', txt: g('병력기타내용') });
    // 질병외 세부
    const ox = [], TR = { 자전거사고: '자전거', 오토바이사고: '오토바이', 개인형이동장치: '개인형 이동장치' };
    if (g('질병외_교통사고')) ox.push('교통사고', TR[g('질병외_교통사고')] || g('질병외_교통사고'));
    if (g('질병외_그밖의탈것')) ox.push('교통사고', '그 밖의 탈 것');
    const ac = g('질병외_사고부상');
    if (ac) { if (ac === '물') ox.push('물'); else ox.push('그 외 외상', ac === '기타 둔상' ? '그 밖의 둔상' : ac); }
    if (g('질병외_동물곤충')) ox.push('동물/곤충');
    if (g('질병외_비외상성손상')) { ox.push('비외상성 손상', '기타'); if (g('질병외_비외상성손상_기타')) paren.push({ ri: 96, label: '기타', txt: g('질병외_비외상성손상_기타') }); }
    if (g('질병외_비외상성손상_온열손상')) ox.push('온열손상');
    checks['22.질병외 세부'] = ox;
    // 의식·동공
    const av = (k) => (g(k) ? g(k).charAt(0) : '');
    checks['23.의식상태(1차)'] = [av('1차진단 의식상태')]; text['23.의식상태(1차) 시각'] = hm(g('1차진단 시간')) || ':';
    checks['23.의식상태(2차)'] = [av('2차진단 의식상태')]; text['23.의식상태(2차) 시각'] = hm(g('2차진단 시간')) || ':';
    checks['24.1.동공상태_좌(1차)'] = [g('동공상태_좌')]; checks['24.2.동공상태_우(1차)'] = [g('동공상태_우')];
    checks['24.3.동공반응_좌(1차)'] = [g('동공반응_좌')]; checks['24.4.동공반응_우(1차)'] = [g('동공반응_우')];
    checks['25.활력징후 측정불가/거부'] = g('활력징후') === '거부' ? ['거부'] : g('활력징후') === '불가' ? ['불가'] : [];
    // 활력징후: 값이 없어도 단위는 찍힌다(실제 출력본). 혈압은 비면 비워 둔다
    const vit = (n) => {
      const bp = g('최고혈압' + n) || g('최저혈압' + n) ? (g('최고혈압' + n) + '/' + g('최저혈압' + n) + 'mmHg') : '';
      return [g('측정시간' + n) || ':', bp, (g('맥박수' + n) || '') + '회/min', (g('호흡수' + n) || '') + '회/min', (g('체온' + n) || '') + '℃', (g('SpO2_' + n) || '') + '%'].join(' | ');
    };
    text['25.활력징후(1회)'] = vit('1'); text['25.활력징후(2회)'] = vit('2');
    // 환자분류: 엑셀의 환자분류 칸이 비어 있어도 실제 출력본은 KTAS 최종값의 끝자리(1~5)를 LEVEL로 쓴다
    const kt = /([1-5])$/.exec(g('KTAS최종값'));
    checks['26.환자분류'] = g('환자분류') ? ['LEVEL ' + g('환자분류')] : kt ? ['LEVEL ' + kt[1]] : [];
    // 평가소견
    text['27.주호소'] = g('평가소견주호소');
    text['27.발생시간'] = (g('평가소견추정여부') === 'Y' ? '추정 ' : '') + dt12(g('평가소견발생시각'));
    // 응급처치
    const ep = [], Y = (k, n) => { if (yes(k)) ep.push(n); };
    [['기도확보_도수조작', '도수조작'], ['기도확보_기도유지기', '기도유지기'], ['기도확보_기도삽관', '기도삽관'], ['기도확보_흡인기', '흡인기'], ['기도폐쇠처치', '기도폐쇄처치'],
      ['비관', '비관'], ['안면마스크', '안면마스크'], ['비재호흡마스크', '비재호흡마스크'], ['BVM', 'BVM'], ['산소소생기', '산소소생기'], ['포켓마스크', '포켓마스크'], ['네블라이저', '네뷸라이저'], ['산소투여_기타', '기타'],
      ['CPR', '실시'], ['CPR거부', '거부'], ['DNR', 'DNR'], ['CPR_유보', '유보'], ['ECG', 'ECG'], ['AED_Shock', 'Shock'], ['AED_MONITORING', 'Monitoring'],
      ['정맥로확보', '정맥로 확보'], ['수액공급', '수액공급'], ['경추고정', '목뼈'], ['척추고정', '척추'], ['부목고정', '부목'], ['머리고정', '머리'],
      ['지혈', '지혈'], ['상처드레싱', '상처 소독 처치'], ['분만', '분만']].forEach(([c, n]) => Y(c, n));
    if (['성문외기도유지기_후두마스크', '성문외기도유지기_KingAirway', '성문외기도유지기_Combitube', '성문외기도유지기_I-gel', '성문외기도유지기_기타'].some(yes)) ep.push('성문외 기도유지기');
    if (yes('약물투여 여부') || ['약물투여(NTG)', '약물투여(기관지확장제)', '약물투여(아미오다론)', '약물투여(트라마돌)', '약물투여(항히스타민)', '약물투여(에피네프린)'].some(yes) || g('약물투여-기타') === '예') ep.push('약물투여');
    if (yes('보온-온')) ep.push('보온', '온'); if (yes('보온-냉')) ep.push('보온', '냉');
    if (yes('기타')) { ep.push('기타#2'); if (g('기타사항')) paren.push({ ri: 156, label: '기타', txt: g('기타사항') + ' ' }); }
    checks['28.응급처치'] = ep;
    text['28.산소투여 유량(L/min)'] = g('산소투여');
    // 의료지도
    const mg = [];
    if (g('의료지도연결상태') === '연결') mg.push('연결'); else if (g('의료지도연결상태')) mg.push('미연결');
    const rm = g('의료지도요청방법'); if (rm) { const mm = /^([^(]+)(?:\(([^)]*)\))?/.exec(rm); mg.push(mm[1]); if (mm[2]) mg.push(mm[2]); }
    if (g('의료지도기관')) mg.push(g('의료지도기관'));
    [['병원선정', '병원선정'], ['환자평가', '환자평가'], ['CPR유보/중단', 'CPR유보ㆍ중단'], ['응급처치_intubation', '기관삽관'], ['응급처치_IV', '정맥로확보'], ['약물투여_N/S', 'N/S'], ['약물투여_D/W', 'D/W'], ['약물투여_NTG', 'NTG'], ['약물투여_기관지확장제', '기관지확장제'], ['약물투여_에피네프린', '에피네프린'], ['약물투여_아미오다론', '아미오다론']].forEach(([c, n]) => { if (yes(c)) mg.push(n); });
    if (['성문외기도유지기_후두마스크', '성문외기도유지기_kingAirway', '성문외기도유지기_I-gel', '성문외기도유지기_기타'].some((k) => g(k) === '예')) mg.push('성문외 기도유지기');
    const rj = g('이송거절/거부').split('/'); if (rj[0] === '예') mg.push('이송거절'); if (rj[1] === '예') mg.push('이송거부');
    checks['29.의료지도'] = mg;
    text['29.의료지도 의사성명'] = (opts.mask ? maskName(g('의료지도의사')) : g('의료지도의사')) || '-';
    // 이송
    text['30.이송기관명(1차)'] = g('병원명1');
    checks['30.관할(1차)'] = g('병원관할1') === '관할' ? ['관할'] : []; checks['30.타시도(1차)'] = g('병원관할1') === '타시도' ? ['타 시ㆍ'] : [];
    text['30.도착시간(1차)'] = hm12(g('도착시간1')) || '-'; text['30.거리(1차)'] = (g('현장과의거리1') || '') + 'km';
    checks['30.선정자(1차)'] = [g('이송기관선정자1')]; checks['30.인수자(1차)'] = [g('환자인수자1')];
    text['30.인수자성명(1차)'] = nm('환자인수자명') || '-';
    checks['30.재이송사유(1차)'] = [g('재이송사유1')];
    text['30.이송기관명(2차)'] = g('병원명2') || '-'; checks['30.관할(2차)'] = g('병원관할2') === '관할' ? ['관할'] : []; checks['30.타시도(2차)'] = g('병원관할2') === '타시도' ? ['타 시ㆍ'] : [];
    text['30.도착시간(2차)'] = hm12(g('도착시간2')) || '-'; text['30.거리(2차)'] = (g('현장과의거리2') || '') + 'km';
    checks['30.선정자(2차)'] = [g('이송기관선정자2')]; checks['30.재이송사유(2차)'] = [g('재이송사유2')]; checks['30.인수자(2차)'] = [g('환자인수자2')]; text['30.인수자성명(2차)'] = nm('환자인수자명2') || '-';
    // 공동대응 · 미이송 · 소방활동
    const co = []; [['공동대응_헬기', '헬기'], ['공동대응_펌뷸런스', '펌뷸런스'], ['공동대응_경찰', '경찰'], ['공동대응_구급차', '구급차'], ['공동대응_기타', '기타']].forEach(([c, n]) => { if (yes(c)) co.push(n); });
    if (g('이송분류') === '소방활동') co.push('옵션2-1');
    checks['공동대응'] = co;
    const nt = [];
    if (g('이송분류') === '미이송') {
      const RS = { 환자없음: '환자 없음', 이송불필요: '이송 불필요' }, why = g('이송분류사유');
      nt.push(RS[why] || why);
      if (why === '기타' && g('이송분류상세사유')) paren.push({ ri: 244, label: '기타', txt: g('이송분류상세사유') });
    }
    checks['미이송'] = nt;
    // 출동인원
    const QL = { '응급구조사(1급)': '1급', '응급구조사(2급)': '2급' }, ql = (k) => QL[g(k)] || g(k);
    checks['31.구급대원(1) 자격'] = [ql('구급대원1_자격')]; text['31.구급대원(1) 성명'] = nm('구급대원1_성명');
    checks['31.구급대원(2) 자격'] = [ql('구급대원2_자격')]; text['31.구급대원(2) 성명'] = nm('구급대원2_성명');
    checks['31.운전요원 자격'] = [ql('운전요원_자격')]; text['31.운전요원 성명'] = nm('운전요원_성명');
    // 장애요인
    const jx = [];
    if (g('장애요인유무') === '없음') jx.push('없음');
    [['장거리_이송', '장거리 이송'], ['보호자요구', '보호자 요구'], ['원거리병원', '원거리 병원'], ['원거리출동', '원거리 출동'], ['만취자', '만취자'], ['폭행', '폭행'], ['언어폭력', '언어폭력'], ['환자_과체중', '환자 과체중'], ['관련기관_협조미흡', '기관협조 미흡'], ['환자위치_불명확', '환자위치 불명확'], ['교통정체', '교통정체'], ['폭우', '폭우'], ['폭설', '폭설'], ['장애요인_기타', '기타']].forEach(([c, n]) => { if (yes(c)) jx.push(n); });
    checks['32.장애요인'] = jx;
    text['재난번호'] = g('재난번호');
    text['센터전화'] = opts.centerTel || '';
    text['출력자'] = opts.printer || ''; text['출력일시'] = opts.printTime || '';
    // 한 줄 밖 항목
    const extra = {
      hasPt,
      id: g('구급보고서번호'), station, center: last, centerA: A,
      time: g('신고년월일') && g('신고시각') ? g('신고년월일').replace(/-/g, '') + hm(g('신고시각')).replace(':', '') + '00' : '',
      sugar: [g('혈당체크1'), g('혈당체크2')], medTime: hm12(g('의료지도요청일시')), narrative: g('평가소견내용'), kind: g('이송분류'),
    };
    return { text, checks, paren, extra, notes, g, mask: !!opts.mask };
  }

  // 선택지 이름 맞추기: 공백·가운뎃점을 빼고 같은 것을 찾는다
  function resolveChecks(S, f, want) {
    const opts = fieldOpts(S, f), names = [], miss = [];
    want.filter(Boolean).forEach((w) => {
      const nw = norm(w);
      const o = opts.find((x) => norm(x.name) === nw) || opts.find((x) => nw.length >= 2 && norm(x.name).startsWith(nw)) || opts.find((x) => norm(x.name).length >= 2 && nw.startsWith(norm(x.name)));
      if (o) names.push(o.name); else miss.push(w);
    });
    return { names, miss };
  }

  /* ================= 서식 한 쪽 채우기 + 이면 쪽 ================= */
  function wrapText(S, text, size, lim) {
    const out = [];
    String(text).split('\n').forEach((para) => {
      let cur = '';
      clean(para).split(' ').filter(Boolean).forEach((word) => {
        let w = word;
        const nx = cur ? cur + ' ' + w : w;
        if (S.width(nx, size) <= lim) { cur = nx; return; }
        if (cur) { out.push(cur); cur = ''; }
        while (S.width(w, size) > lim) { let k = 1; while (k < w.length && S.width(w.slice(0, k + 1), size) <= lim) k++; out.push(w.slice(0, k)); w = w.slice(k); }
        cur = w;
      });
      out.push(cur);
    });
    return out;
  }
  const LIM1 = 475; // 평가소견 한 줄 너비(pt): 실제 출력본에서 72·74·52자로 끊기는 값
  // 정렬 기준 (서식 예시 글자의 위치·폭 기준)
  const CENTER = [15, 21, 26, 239, 28, 34, 39, 41, 52, 57, 60, 69, 126, 133, 127, 134, 180, 194, 195, 196, 197, 199, 211, 214, 217, 219, 231, 233, 253, 255, 260, 262, 267, 269];
  const RIGHT = [128, 129, 130, 131, 135, 136, 137, 138, 132, 139];
  function fillRecord(S, rec, warn) {
    S.src = S.src.replace(/\/Im[1-4] Do/g, (m) => ' '.repeat(m.length)); // 가상 서명 그림 삭제
    S.runs.forEach((r) => { if (r.text.indexOf('[√]') >= 0) S.uncheck(r); });
    const x = rec.extra;
    // 평가소견: 3줄에 들어가면 그대로, 넘치면 1쪽에는 '이면참고', 전문은 다음 쪽
    const lines = charWrap(S, x.narrative, S.runs[146].size, LIM1);
    const more = lines.length > 3 ? x.narrative : null;
    F.forEach((f) => {
      const name = f[0];
      if (f[1] === 'check') {
        const { names, miss } = resolveChecks(S, f, rec.checks[name] || []);
        miss.forEach((m) => warn(name + ': 서식에 없는 값 "' + m + '"'));
        writeField(S, f, names);
      } else writeField(S, f, rec.text[name] == null ? '' : rec.text[name]);
    });
    // 평가소견 줄: 공백을 그대로 둔다
    [146, 147, 148].forEach((ri, i) => S.set(S.runs[ri], (more ? (i === 0 ? '이면참고' : '') : lines[i] || '') || ' '));
    // 서식 예시로 들어 있던 글자 정리
    fillParen(S, 156, '기타', ' '); // CPR 줄의 '기타(안위도모 )' 예시
    if (S.runs[82].text.indexOf('[√]') < 0) S.set(S.runs[82], '[ ]질 병'); // 체크 안 한 '질병' 은 실제 출력본이 '질 병' 으로 찍는다
    rec.paren.forEach((p) => { if (!fillParen(S, p.ri, p.label, p.txt)) warn('괄호 안에 쓸 칸이 없어 반영하지 못함: ' + p.label + '(' + p.txt + ')'); });
    // 이송기관명: 비면 가운데에 '-', 있으면 6글자씩 가운데 정렬(실제 출력본)
    const hn = clean(rec.text['30.이송기관명(1차)']);
    if (!hn) { S.set(S.runs[194], '-'); [195, 196, 197].forEach((i) => S.set(S.runs[i], ' ')); place(S, 194, 'center', 598); [195, 196, 197].forEach((i) => place(S, i, 'center')); }
    else { // 6글자씩 나눈 줄을 칸(위 4줄 높이) 세로 가운데에 놓는다: 1줄은 정중앙, 2줄은 2·3번째 줄 자리, 4줄은 모두
      const n = Math.min(4, Math.ceil(Array.from(hn).length / 6));
      for (let k = 0; k < n; k++) place(S, 194 + k, 'center', 598 + (k - (n - 1) / 2) * 11);
    }
    // 혈당은 숫자 뒤에 바로 단위를 붙이고 오른쪽 정렬
    [[132, x.sugar[0]], [139, x.sugar[1]]].forEach(([ri, v]) => { S.set(S.runs[ri], (v || '') + 'mg/dL'); });
    if (x.medTime) { S.set(S.runs[164], x.medTime); moveX(S.runs[164], 238); }
    CENTER.forEach((i) => place(S, i, 'center')); RIGHT.forEach((i) => place(S, i, 'right'));
    // 출동인원 이름은 세 줄 모두 같은 중심선(실제 출력본 기준). 서식 예시 글자 하나가 한 줄만 달라 따로 맞춘다
    [255, 262, 269].forEach((i) => moveX(S.runs[i], (492.7 - S.width(S.runs[i].text, S.runs[i].size) / 2).toFixed(2)));
    // 의식상태 시각이 비면 '( : )' 가 서식 예시보다 2.4pt 왼쪽에 찍힌다
    if (rec.text['23.의식상태(1차) 시각'] === ':') moveX(S.runs[103], (S.orig[103].x - 2.4).toFixed(2));
    if (rec.text['23.의식상태(2차) 시각'] === ':') moveX(S.runs[106], (S.orig[106].x - 2.4).toFixed(2));
    // '타 시ㆍ도' 는 체크했을 때만 '도' 가 다음 줄로 내려가고, 체크가 없으면 한 줄로 찍힌다
    if (!(rec.checks['30.타시도(1차)'] || []).length) { S.set(S.runs[212], S.runs[212].text.replace('타 시ㆍ', '타 시ㆍ도')); S.set(S.runs[213], ' '); }
    S.set(S.runs[282], x.id || ' ');
    S.set(S.runs[286], '소속 : ' + x.station + ' ' + x.centerA);
    return more;
  }

  // 이면 쪽: 서식과 같은 글꼴로 평가소견 전문을 적는다
  function contentFor(S, id, text) {
    const size = 9, lead = 13, X = 60, LIM = 475, H = 842, rows = wrapText(S, text, size, LIM), out = [];
    const put = (str, x, top, sz, font) => {
      let s = 'BT\r\n/' + font + ' ' + sz + ' Tf 100 Tz\r\n1 0 0 1 ' + x.toFixed(2) + ' ' + (H - top).toFixed(2) + ' Tm\r\n';
      Array.from(str).forEach((ch, i) => { if (i) s += S.adv(Array.from(str)[i - 1], sz).toFixed(5) + ' 0 Td\r\n'; s += esc(ch) + ' Tj\r\n'; });
      return s + 'ET\r\n';
    };
    out.push('0 0 0 rg\r\n' + put('구급활동일지 - 구급대원 평가소견(이면)', X, 50, 12, 'CJK1'));
    out.push(put('일련번호 ' + id, X, 66, 9, 'CJK2'));
    rows.forEach((r, i) => { if (r) out.push(put(r, X, 92 + i * lead, size, 'CJK2')); });
    return toU8(out.join(''));
  }

  // 만든 쪽을 다시 읽어 엑셀 원본 값과 칸마다 대조한다 (매핑 코드를 거치지 않고 엑셀 값에서 직접 기대값을 만든다)
  function verify(S, rec, more) {
    const g = rec.g, mask = rec.mask, V = new Stream(S.serialize(), 842), T = (i) => clean(V.runs[i].text), bad = [];
    const nmv = (k) => (mask ? maskName(g(k)) : g(k)), chk = new Set();
    V.runs.forEach((run) => (run.text.match(/\[√\]\s*[^\[]*/g) || []).forEach((m) => chk.add(norm(m.replace(/\[√\]/, '').split(/[()■]|\s{2,}/)[0]))));
    const eq = (name, a, e) => { if (a !== e) bad.push(name); };
    const on = (label, cond) => { if (chk.has(norm(label)) !== !!cond) bad.push('체크:' + label); };
    eq('보고서번호', T(282), g('구급보고서번호')); eq('재난번호', T(284), g('재난번호')); eq('차량번호', T(9), g('차량번호'));
    eq('환자명', T(26), nmv('환자명') || '-'); eq('나이', T(28), (g('환자연령') || '') + '세');
    [['출동', 34, '출동시각'], ['현장도착', 39, '현장도착시각'], ['환자접촉', 41, '환자접촉시각'], ['현장출발', 57, '현장출발시각'], ['병원도착', 60, '병원도착시각'], ['귀소', 69, '귀소시각']].forEach(([n, i, c]) => eq(n, T(i), hm(g(c)) || ':'));
    eq('신고시각', T(21), hm(g('신고시각'))); eq('거리', T(52), g('현장과의거리') ? g('현장과의거리') + 'km' : '');
    [[127, 128, 129, 130, 131, '1'], [134, 135, 136, 137, 138, '2']].forEach(([a, b, c, d, e, n]) => {
      eq('혈압' + n, T(a), g('최고혈압' + n) ? g('최고혈압' + n) + '/' + g('최저혈압' + n) + 'mmHg' : ''); eq('맥박' + n, T(b), (g('맥박수' + n) || '') + '회/min');
      eq('호흡' + n, T(c), (g('호흡수' + n) || '') + '회/min'); eq('체온' + n, T(d), (g('체온' + n) || '') + '℃'); eq('SpO2_' + n, T(e), (g('SpO2_' + n) || '') + '%');
    });
    eq('혈당1', T(132), (g('혈당체크1') || '') + 'mg/dL'); eq('혈당2', T(139), (g('혈당체크2') || '') + 'mg/dL');
    eq('주호소', T(144).replace(/^ㆍ주 호소:\s*/, ''), clean(g('평가소견주호소')));
    eq('이송기관명', g('병원명1') ? [194, 195, 196, 197].map((i) => V.runs[i].text).join('').replace(/\s+$/, '') : T(194), g('병원명1') ? g('병원명1').replace(/\s+$/, '') : '-');
    eq('인수자명', T(211), nmv('환자인수자명') || '-'); eq('대원1', T(255), nmv('구급대원1_성명')); eq('대원2', T(262), nmv('구급대원2_성명')); eq('운전요원', T(269), nmv('운전요원_성명'));
    eq('평가소견', more ? T(146) : [146, 147, 148].map((i) => V.runs[i].text).join('').replace(/\s+$/, ''), more ? '이면참고' : g('평가소견내용').replace(/\s+$/, ''));
    on('남', g('환자성별') === '남'); on('여', g('환자성별') === '여'); on('질병', rec.extra.hasPt && g('환자발생유형') === '질병'); on('질병외', rec.extra.hasPt && g('환자발생유형') === '질병외');
    on('고혈압', g('고혈압') === '예'); on('당뇨', g('당뇨') === '예'); on('심장질환', g('심장질환') === '예'); on('지혈', g('지혈') === '예');
    on('상처 소독 처치', g('상처드레싱') === '예'); on('ECG', g('ECG') === '예'); on('목뼈', g('경추고정') === '예'); on('척추', g('척추고정') === '예'); on('머리', g('머리고정') === '예');
    on('장거리 이송', g('장거리_이송') === '예'); on('원거리 병원', g('원거리병원') === '예'); on('관할', g('병원관할1') === '관할');
    on('환자 없음', g('이송분류') === '미이송' && g('이송분류사유') === '환자없음'); on('이송거부', g('이송분류') === '미이송' && g('이송분류사유') === '이송거부');
    on('펌뷸런스', g('공동대응_펌뷸런스') === '예'); on('휴대전화', g('접수경로') === '휴대전화'); on('일반전화', g('접수경로') === '일반전화');
    const lv = /([1-5])$/.exec(g('KTAS최종값')); [1, 2, 3, 4, 5].forEach((n) => on('LEVEL ' + n, lv && +lv[1] === n));
    return bad;
  }

  async function buildPdf(records, opts, onProgress, warnings, stats) {
    const out = await PDFLib.PDFDocument.create();
    let moreCount = 0;
    for (let n = 0; n < records.length; n++) {
      if (onProgress) onProgress(n + 1, records.length);
      if (n % 3 === 0) await tick();
      const rec = records[n], t = await loadTemplate();
      const warn = (m) => { warnings.set(m, (warnings.get(m) || 0) + 1); };
      const more = fillRecord(t.stream, rec, warn);
      const vb = verify(t.stream, rec, more); stats.checked++; if (vb.length) { stats.bad++; vb.forEach((x) => { stats.items[x] = (stats.items[x] || 0) + 1; }); stats.ids.push(rec.extra.id + ' (' + vb.join(', ') + ')'); }
      const ref = t.doc.context.register(t.doc.context.flateStream(t.stream.serialize()));
      t.page.node.set(PDFLib.PDFName.of('Contents'), ref);
      // 지운 서명 그림(Im1~Im4)은 자원 목록에서도 빼서 쪽마다 복사되지 않게 한다 (인체 그림 Im0 은 남김)
      const xo = t.page.node.Resources().lookup(PDFLib.PDFName.of('XObject'), PDFLib.PDFDict);
      ['Im1', 'Im2', 'Im3', 'Im4'].forEach((k) => xo.delete(PDFLib.PDFName.of(k)));
      const page = (await out.copyPages(t.doc, [0]))[0];
      out.addPage(page);
      if (more) {
        moreCount++;
        const p2 = out.addPage([595, 842]);
        p2.node.set(PDFLib.PDFName.of('Resources'), page.node.get(PDFLib.PDFName.of('Resources')));
        p2.node.set(PDFLib.PDFName.of('Contents'), out.context.register(out.context.flateStream(contentFor(t.stream, rec.extra.id, more))));
      }
    }
    return { bytes: await out.save(), pages: out.getPageCount(), moreCount };
  }

  /* ================= 실제 출력본과 비교 ================= */
  const RUNF = {}; F.forEach((f) => f[2].forEach((i) => { RUNF[i] = f[0]; }));
  const UNAV = new Set([7, 18, 44, 46, 48, 253, 260, 267, 285, 287]); // 엑셀에 없는 값: 전화번호·보호자·계급·출력자·출력일시
  const BAND = [51, 76, 138, 720, 732, 744, 806];
  const telNorm = (t) => t.replace(/\(Tel : [^)]*\)/, '(Tel : )');
  async function compareReal(files, row) {
    const out = [];
    for (const f of files) {
      let doc;
      try { doc = await PDFLib.PDFDocument.load(new Uint8Array(await f.arrayBuffer()), { ignoreEncryption: true }); } catch (e) { out.push({ file: f.name, err: 'PDF를 열지 못했습니다' }); continue; }
      for (let pg = 0; pg < doc.getPageCount(); pg++) {
        const page = doc.getPage(pg), parts = [];
        page.node.normalizedEntries().Contents.asArray().forEach((ref) => { const st = doc.context.lookup(ref); parts.push(st instanceof PDFLib.PDFRawStream ? PDFLib.decodePDFRawStream(st).decode() : st.getContents(), new Uint8Array([10])); });
        const u8 = new Uint8Array(parts.reduce((a, u) => a + u.length, 0)); let o = 0; parts.forEach((u) => { u8.set(u, o); o += u.length; });
        const R = new Stream(u8, 842), idRun = R.runs.find((r) => /^\d{11}M\d{5}$/.test(r.text.trim()));
        if (!idRun) { out.push({ file: f.name, page: pg + 1, err: '일련번호가 없는 쪽(이면 쪽이거나 다른 서식)' }); continue; }
        const id = idRun.text.trim(), r = S0.rows.find((x) => String(x[S0.H['구급보고서번호']]).trim() === id);
        if (!r) { out.push({ file: f.name, page: pg + 1, id, err: '엑셀에 없는 보고서번호' }); continue; }
        const g = (k) => (k in S0.H ? String(r[S0.H[k]] == null ? '' : r[S0.H[k]]).trim() : '');
        const rec = mapRow(g, { mask: false, centerTel: '', printer: '', printTime: '' }), t = await loadTemplate();
        fillRecord(t.stream, rec, () => {});
        const M = new Stream(t.stream.serialize(), 842), nz = (x) => clean(x), key = (S, run) => Math.round(run.x) + ',' + Math.round(S.top(run));
        const mine = new Map(), real = new Map(); R.runs.forEach((run) => { const k = key(R, run); real.set(k, (real.get(k) || []).concat(nz(run.text))); });
        M.runs.forEach((run, i) => { const k = key(M, run); mine.set(k, (mine.get(k) || []).concat([{ t: nz(run.text), i }])); });
        const near = (map, x, y) => { for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const v = map.get((x + dx) + ',' + (y + dy)); if (v) return v; } return null; };
        const diffs = [], skipped = new Set();
        R.runs.forEach((run) => {
          const t0 = nz(run.text), x = Math.round(run.x), y = Math.round(R.top(run)), v = near(mine, x, y);
          if (!t0) return;
          if (BAND.indexOf(y) >= 0 && (!v || UNAV.has(v[0].i))) { skipped.add(y); return; }
          if (!v) { diffs.push({ name: '위치 (' + x + ',' + y + ')', kind: '복원본에 없음' }); return; }
          if (UNAV.has(v[0].i)) { skipped.add(v[0].i); return; }
          if (!v.some((a) => telNorm(a.t) === telNorm(t0))) diffs.push({ name: RUNF[v[0].i] || '위치 (' + x + ',' + y + ')', kind: '다름' });
        });
        mine.forEach((arr, k) => arr.forEach((a) => { if (!a.t || UNAV.has(a.i)) return; const [x, y] = k.split(',').map(Number); if (!near(real, x, y)) diffs.push({ name: RUNF[a.i] || '위치 (' + x + ',' + y + ')', kind: '실제 출력본에 없음' }); }));
        out.push({ file: f.name, page: pg + 1, id, kind: g('이송분류'), diffs });
      }
    }
    return out;
  }

  /* ================= 화면 ================= */
  const mb = (n) => (n / 1048576).toFixed(1) + 'MB';
  const S0 = { head: null, rows: [], H: {}, file: null, result: null, busy: false };
  const show = (sel, on) => { $(sel).hidden = !on; };
  function saveBlob(name, blob) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function reset() {
    S0.rows = []; S0.result = null; show('#card', false); show('#drop', true); $('#err').textContent = ''; $('#file').value = '';
  }
  async function loadFile(file) {
    reset(); $('#err').textContent = '';
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' }), ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
      if (data.length < 2) throw new Error('데이터가 없는 엑셀입니다');
      const head = data[0].map((h) => String(h).trim()), H = {}; head.forEach((h, i) => { if (!(h in H)) H[h] = i; });
      const need = ['구급보고서번호', '구급활동구분', '신고년월일', '환자발생유형', '이송분류', '평가소견내용'], miss = need.filter((k) => !(k in H));
      if (miss.length) throw new Error('스마트 시스템 구급일지 엑셀이 아닙니다. 없는 열: ' + miss.join(', '));
      S0.head = head; S0.H = H; S0.file = file; S0.rows = data.slice(1).filter((r) => String(r[H['구급보고서번호']]).trim());
      if (!S0.rows.length) throw new Error('구급보고서번호가 있는 줄이 없습니다');
    } catch (e) { $('#err').textContent = e.message || String(e); return; }
    const kc = {}, cs = new Set(), ds = [];
    S0.rows.forEach((r) => { const k = String(r[S0.H['이송분류']]).trim() || '미분류'; kc[k] = (kc[k] || 0) + 1; cs.add(String(r[S0.H['출동안전센터_지역대']]).trim()); const d = String(r[S0.H['신고년월일']]).trim(); if (d) ds.push(d); });
    ds.sort();
    $('#fname').textContent = file.name;
    $('#sum').textContent = '구급일지 ' + S0.rows.length + '건 · ' + Object.keys(kc).map((k) => k + ' ' + kc[k]).join(' · ') + (ds.length ? ' · ' + ds[0] + ' ~ ' + ds[ds.length - 1] : '');
    const sel = $('#kind'); sel.textContent = '';
    [['', '전체 (' + S0.rows.length + '건)']].concat(Object.keys(kc).map((k) => [k, k + ' (' + kc[k] + '건)'])).forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; sel.appendChild(o); });
    show('#drop', false); show('#card', true); show('#done', false); show('#prog', false);
  }
  async function convert() {
    if (S0.busy) return;
    S0.busy = true; S0.result = null; show('#done', false); show('#prog', true); $('#err').textContent = '';
    $('#go').disabled = true;
    try {
      const kind = $('#kind').value, mask = $('#mask').checked, outMode = $('#out').value, zip = outMode !== 'pdf';
      const get = (r) => (k) => (k in S0.H ? String(r[S0.H[k]] == null ? '' : r[S0.H[k]]).trim() : '');
      const pad = (n) => String(n).padStart(2, '0'), d0 = new Date(), printTime = $('#ptime').checked ? d0.getFullYear() + '-' + pad(d0.getMonth() + 1) + '-' + pad(d0.getDate()) + ' ' + pad(d0.getHours()) + ':' + pad(d0.getMinutes()) + ':' + pad(d0.getSeconds()) : '';
      const copt = { mask, centerTel: $('#tel').value.trim(), printer: $('#printer').value.trim(), printTime };
      const recs = S0.rows.filter((r) => !kind || String(r[S0.H['이송분류']]).trim() === kind).map((r) => mapRow(get(r), copt));
      if (!recs.length) throw new Error('변환할 줄이 없습니다');
      const warnings = new Map(), stats = { checked: 0, bad: 0, items: {}, ids: [] }, prog = (n, t) => { $('#plabel').textContent = '만드는 중 ' + n + ' / ' + t; $('#bar').style.width = Math.round((n / t) * 100) + '%'; };
      let res, pages, more = 0;
      if (zip) {
        // 센터별 또는 월별로 나눠 PDF 여러 개를 ZIP 하나로 묶는다
        const keyOf = (x) => (outMode === 'month' ? (x.extra.time ? x.extra.time.slice(0, 4) + '-' + x.extra.time.slice(4, 6) : '날짜없음') : (x.extra.center || '센터없음'));
        const groups = {}; recs.forEach((x) => { (groups[keyOf(x)] = groups[keyOf(x)] || []).push(x); });
        const files = []; let done = 0; pages = 0;
        for (const c of Object.keys(groups).sort()) {
          const r = await buildPdf(groups[c], {}, (n) => prog(done + n, recs.length), warnings, stats);
          files.push({ name: '구급일지_' + c + '.pdf', data: new Uint8Array(r.bytes) }); done += groups[c].length; pages += r.pages; more += r.moreCount;
        }
        res = { name: outMode === 'month' ? 'ilji_restored_by_month.zip' : 'ilji_restored_by_center.zip', blob: makeZip(files) };
      } else {
        const r = await buildPdf(recs, {}, prog, warnings, stats); pages = r.pages; more = r.moreCount;
        res = { name: 'ilji_restored.pdf', blob: new Blob([r.bytes], { type: 'application/pdf' }) };
      }
      S0.result = res;
      $('#dtitle').textContent = recs.length + '건 복원 · ' + pages + '쪽 · ' + mb(res.blob.size);
      $('#dsub').textContent = (more ? '평가소견이 길어 이면 쪽을 붙인 일지 ' + more + '건 · ' : '') + (mask ? '개인정보 가리기 적용' : '개인정보가 그대로 들어 있으니 취급에 주의하세요');
      const wl = $('#warn'); wl.textContent = '';
      const arr = [...warnings.entries()].sort((a, b) => b[1] - a[1]);
      $('#wsum').textContent = arr.length ? '서식에 넣지 못한 값 ' + arr.length + '종 (' + arr.reduce((a, x) => a + x[1], 0) + '곳)' : '서식에 넣지 못한 값 없음';
      arr.slice(0, 60).forEach(([m, c]) => { const li = document.createElement('li'); li.textContent = m + ' — ' + c + '건'; wl.appendChild(li); });
      const vs = $('#verify'); vs.textContent = stats.bad ? '엑셀과 대조: 일치 ' + (stats.checked - stats.bad) + '건 / 불일치 ' + stats.bad + '건 → ' + stats.ids.slice(0, 5).join(' · ') : '엑셀과 대조: 만든 쪽을 다시 읽어 ' + stats.checked + '건 모두 엑셀 값과 일치했습니다';
      vs.style.color = stats.bad ? 'var(--err)' : 'var(--ok)';
      $('#open').hidden = zip; show('#done', true);
    } catch (e) { console.error(e); $('#err').textContent = '만들지 못했습니다: ' + (e.message || e); }
    show('#prog', false); $('#go').disabled = false; S0.busy = false;
  }
  function bind() {
    const drop = $('#drop'), input = $('#file'), stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    input.addEventListener('change', () => { if (input.files[0]) loadFile(input.files[0]); });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    ['dragenter', 'dragover'].forEach((ev) => window.addEventListener(ev, (e) => { stop(e); drop.classList.add('over'); }));
    window.addEventListener('dragleave', (e) => { if (e.relatedTarget === null) drop.classList.remove('over'); });
    window.addEventListener('drop', (e) => { stop(e); drop.classList.remove('over'); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f && !S0.busy) loadFile(f); });
    $('#again').addEventListener('click', reset); $('#go').addEventListener('click', convert);
    $('#cmpfile').addEventListener('change', async () => {
      const fs = [...$('#cmpfile').files]; $('#cmpfile').value = ''; if (!fs.length || !S0.rows.length) return;
      const ul = $('#cmpres'); ul.textContent = ''; $('#cmpsum').textContent = '비교하는 중…';
      try {
        const res = await compareReal(fs); let ok = 0, bad = 0;
        res.forEach((x) => {
          const li = document.createElement('li');
          if (x.err) { li.textContent = x.file + (x.page ? ' ' + x.page + '쪽' : '') + ' — ' + x.err; li.style.color = 'var(--warn)'; }
          else if (!x.diffs.length) { ok++; li.textContent = '…' + x.id.slice(-5) + ' (' + x.kind + ') — 엑셀로 알 수 있는 모든 칸이 실제 출력본과 같습니다'; li.style.color = 'var(--ok)'; }
          else { bad++; const u = [...new Set(x.diffs.map((d) => d.name + '(' + d.kind + ')'))]; li.textContent = '…' + x.id.slice(-5) + ' (' + x.kind + ') — 다른 곳 ' + x.diffs.length + ': ' + u.slice(0, 8).join(', '); li.style.color = 'var(--err)'; }
          ul.appendChild(li);
        });
        $('#cmpsum').textContent = '비교 결과: 같음 ' + ok + '쪽 / 다름 ' + bad + '쪽 (전화번호·보호자·계급·출력자·출력일시는 엑셀에 없어 제외)';
      } catch (e) { $('#cmpsum').textContent = '비교하지 못했습니다: ' + (e.message || e); }
    });
    $('#save').addEventListener('click', () => { if (S0.result) saveBlob(S0.result.name, S0.result.blob); });
    $('#open').addEventListener('click', () => { if (S0.result) window.open(URL.createObjectURL(S0.result.blob), '_blank'); });
  }
  bind();
  window.__smart = { compareReal, wrapText, verify, mapRow, resolveChecks, F, FIELD, loadFile, convert, readFieldName: null, S0, fieldOpts, loadTemplate, fillRecord };
})();
