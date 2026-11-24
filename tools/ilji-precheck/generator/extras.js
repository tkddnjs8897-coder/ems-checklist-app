/* 랜덤 구급일지 생성기 추가 기능 — 엑셀 ↔ 일지 변환
   ① 만든 일지 → 값 엑셀 / 일부러 넣은 오류 위치 엑셀(0/1)
   ② 값 엑셀 → 구급활동일지 PDF
   ③ 오류 엑셀(0/1) → 고칠 칸을 빨갛게 표시한 구급활동일지 PDF
   생성기 쪽 전역(loadTemplate, Stream, makeZip, makeCtx, makeRng, buildLog, pickErrors, ERR)과 PDFLib, XLSX 를 쓴다.
   모든 처리는 이 브라우저 안에서만 한다. */
(() => {
  const $ = (s) => document.querySelector(s);
  const LAYOUT = /*__LAYOUT__*/{};
  const tick = () => new Promise((r) => setTimeout(r, 0));

  /* ---------- 일지 칸 변환표 ----------
     [열 이름, 오류 엑셀의 항목 이름(없으면 ''), 종류, 서식 PDF 글자 덩어리 번호들, 보조값]
     종류: text 글자 · join 여러 덩어리를 이어 붙임 · paren (값) · prefix 앞 글자+값 · onset 발생시간 ·
           lines 여러 줄 · chunks 글자 수로 줄바꿈 · multi 칸마다 ' | ' · datetime 날짜+시각 · check 체크 칸 */
  const F = [
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
  // 오류 엑셀(구급정보시스템 완결성 점검)의 항목 열 35개
  const ITEMS = ['1.소속', '2.차량번호', '3.구급구분', '4.신고일시', '5.출동일시', '6.현장도착일시', '7.환자접촉일시', '8.현장과의거리',
    '9.현장출발일시', '10.병원도착일시', '11.귀소일시', '12.신고자번호', '13.신고방법', '14.환자성명', '15.환자나이', '16.환자성별',
    '17.환자주소', '18.환자직업', '19.환자발생 위치', '20.환자발생 장소', '21.환자증상', '22.환자발생유형', '23.의식상태(1차)',
    '24.1.동공상태_좌(1차)', '24.2.동공상태_우(1차)', '24.3.동공반응_좌(1차)', '24.4.동공반응_우(1차)', '25.활력징후', '26.환자분류',
    '27.평가소견', '28.응급처치', '29.의료지도', '30.환자이송', '31.이송자', '32.장애요인'];
  const META = ['보고서번호', '소방서', '출동센터', '신고일시'];
  const RUN_ITEM = {};
  F.forEach((f) => { if (f[1]) f[3].forEach((i) => { RUN_ITEM[i] = f[1]; }); });
  const DELETED_ITEM = '18.환자직업'; // 2025 서식에서 칸이 삭제됨(구급빨간펜 결정 2026-10-31)

  /* ---------- 읽기·쓰기 보조 ---------- */
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
      case 'join': return clean(R.map((r) => r.text).join(''));
      case 'chunks': return clean(R.map((r) => r.text).join(''));
      case 'paren': { const m = /^\((.*)\)$/.exec(R[0].text.trim()); return clean(m ? m[1] : R[0].text); }
      case 'prefix': return clean(R[0].text.replace(new RegExp('^\\s*' + reEsc(arg) + '\\s*'), ''));
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

  // 일지(PDF 글자 편집 엔진) 에서 보고서번호·소속·신고일시
  function readMeta(S) {
    const sn = clean(S.runs[282].text), aff = /^소속\s*:\s*(\S+)\s*(.*)$/.exec(clean(S.runs[286].text)) || [];
    const dt = readField(S, F.find((f) => f[0] === '4.신고일시')), o = parseDT(dt);
    return { id: sn, station: aff[1] || '', center: clean(aff[2] || ''), time: o && o.h ? o.y + o.mo + o.d + o.h + o.mi + '00' : '' };
  }
  function writeMeta(S, m) {
    S.set(S.runs[282], m.id || ' ');
    S.set(S.runs[286], '소속 : ' + (m.station || '') + ' ' + (m.center || ''));
  }

  // 가상 서명 그림(Im1~Im4) 삭제 + 체크 모두 해제 (사고부위 인체 그림 Im0 은 서식의 일부라 남김)
  function prepareBlank(S) {
    S.src = S.src.replace(/\/Im[1-4] Do/g, (m) => ' '.repeat(m.length));
    S.runs.forEach((r) => { if (r.text.indexOf('[√]') >= 0) S.uncheck(r); });
  }
  // values: { 열 이름: 값 }, meta: {id, station, center, time}
  function fillFromRow(S, meta, values) {
    prepareBlank(S);
    F.forEach((f) => writeField(S, f, values ? values[f[0]] : ''));
    writeMeta(S, meta);
    if (!(values && clean(values['4.신고일시'])) && meta.time) {
      writeField(S, F.find((f) => f[0] === '4.신고일시'), meta.time);
    }
  }

  async function finishZ(t) { // 글자 스트림을 압축해서 저장 (쪽당 용량 1/2.5)
    const ref = t.doc.context.register(t.doc.context.flateStream(t.stream.serialize()));
    t.page.node.set(PDFLib.PDFName.of('Contents'), ref);
    return await t.doc.save();
  }

  function drawMarks(page, font, items) {
    const H = page.getHeight(), red = PDFLib.rgb(0.78, 0.16, 0.16);
    items.forEach((e) => {
      const it = LAYOUT.items && LAYOUT.items[e];
      if (!it) return;
      const b = it.box, pad = 1.5, num = (/^\d+(?:\.\d+)?(?=\.\D)/.exec(e) || [e])[0];
      page.drawRectangle({ x: b[0] - pad, y: H - b[3] - pad, width: b[2] - b[0] + 2 * pad, height: b[3] - b[1] + 2 * pad,
        color: red, opacity: 0.14, borderColor: red, borderWidth: 1.5, borderOpacity: 1 });
      page.drawText(num, { x: Math.max(1, b[0] - 11), y: H - b[1] - 7, size: 8, font, color: red });
    });
  }

  // rows: [{meta, values, marks}] -> PDF 한 개(건마다 한 쪽)
  async function buildPdf(rows, label) {
    const out = await PDFLib.PDFDocument.create();
    for (let n = 0; n < rows.length; n++) {
      $('#x-state').textContent = label + ' 만드는 중 ' + (n + 1) + ' / ' + rows.length;
      await tick();
      const t = await loadTemplate('log');
      fillFromRow(t.stream, rows[n].meta, rows[n].values);
      const d = await PDFLib.PDFDocument.load(await finishZ(t));
      if (rows[n].marks && rows[n].marks.length) drawMarks(d.getPage(0), await d.embedFont(PDFLib.StandardFonts.HelveticaBold), rows[n].marks);
      out.addPage((await out.copyPages(d, [0]))[0]);
    }
    return await out.save();
  }

  /* ---------- ① 일지 만들기 → 엑셀 ---------- */
  // generate({kind:'log'}) 와 같은 순서로 난수를 써서 같은 일지를 만들고, 일부러 넣은 오류가 바꾼 글자 덩어리를 항목으로 기록한다
  async function genLog(seed, level) {
    const rng = makeRng(seed), c = makeCtx(rng, rng() < 0.5 ? 'stroke' : 'trauma');
    const chosen = pickErrors(c, ERR.log, level);
    chosen.forEach((e) => e.plan && e.plan(c, level));
    const t = await loadTemplate('log'), refs = buildLog(t.stream, c), flags = new Set(), notes = [];
    chosen.forEach((e) => {
      const before = t.stream.runs.map((r) => r.text);
      const detail = e.apply(t.stream, refs, c);
      t.stream.runs.forEach((r, i) => { if (r.text !== before[i] && RUN_ITEM[i]) flags.add(RUN_ITEM[i]); });
      notes.push(e.desc + ': ' + detail);
    });
    const values = {};
    F.forEach((f) => { values[f[0]] = readField(t.stream, f); });
    return { seed, serial: c.serial, meta: readMeta(t.stream), values, flags, notes };
  }
  async function genMany(n) {
    const level = +$('#level').value, s = $('#seed').value.trim();
    const base = s ? (parseInt(s, 10) || [...s].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7)) : Math.floor(Math.random() * 1e8);
    const rows = [];
    for (let k = 0; k < n; k++) {
      $('#x-state').textContent = '일지 만드는 중 ' + (k + 1) + ' / ' + n;
      await tick();
      rows.push(await genLog(base + k, level));
    }
    return { base, rows };
  }
  const widths = (cols) => cols.map((c) => ({ wch: Math.min(40, Math.max(8, String(c).length * 2)) }));
  function xlsxBlob(wb) { return new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); }
  function saveBlob(name, blob) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function valuesWorkbook(rows) {
    const cols = META.concat(F.map((f) => f[0])), wb = XLSX.utils.book_new();
    const aoa = [cols].concat(rows.map((r) => [r.meta.id, r.meta.station, r.meta.center, r.meta.time].concat(F.map((f) => r.values[f[0]]))));
    const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = widths(cols); ws['!freeze'] = { xSplit: 1, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, ws, '일지값');
    const help = [['구급일지 값 엑셀 안내'], [''],
      ['· 한 줄이 일지 한 장입니다. 앞 4열(보고서번호·소방서·출동센터·신고일시)은 오류 엑셀과 같은 모양입니다.'],
      ['· 체크 칸은 선택한 항목 이름을 쉼표로 적습니다. 예: 13.신고방법 = 휴대전화 / 21.환자증상 = 흉통, 어지러움'],
      ['· 같은 이름이 한 칸 안에 두 번 나오면 두 번째부터 이름 뒤에 #2 를 붙입니다.'],
      ['· 25.활력징후는 시각 | 혈압 | 맥박 | 호흡 | 체온 | SpO2 순서이고 | 로 나눕니다.'],
      ['· 27.발생시간 앞에 추정 이 있으면 추정 체크입니다. 27.평가소견은 줄바꿈 없이 써도 알아서 3줄로 나눕니다.'],
      ['· 이 파일의 값은 모두 가상입니다. 이 엑셀을 [값 엑셀 → 구급활동일지 PDF]에 올리면 같은 일지가 PDF로 만들어집니다.']];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(help), '안내');
    return wb;
  }
  function errorWorkbook(rows) {
    const cols = META.concat(ITEMS), wb = XLSX.utils.book_new();
    const aoa = [cols].concat(rows.map((r) => [r.meta.id, r.meta.station, r.meta.center, r.meta.time].concat(ITEMS.map((it) => (r.flags.has(it) ? '1' : '0')))));
    const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = widths(cols);
    XLSX.utils.book_append_sheet(wb, ws, '오류위치');
    const notes = [['보고서번호', '일부러 넣은 오류']];
    rows.forEach((r) => { if (r.notes.length) r.notes.forEach((n) => notes.push([r.meta.id, n])); else notes.push([r.meta.id, '(없음)']); });
    const ns = XLSX.utils.aoa_to_sheet(notes); ns['!cols'] = [{ wch: 24 }, { wch: 90 }];
    XLSX.utils.book_append_sheet(wb, ns, '정답표');
    return wb;
  }

  /* ---------- 엑셀 읽기 ---------- */
  async function readSheet(file, preferred) {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const name = wb.SheetNames.find((n) => n === preferred) || wb.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: false, defval: '' });
    if (data.length < 2) throw new Error('데이터가 없는 엑셀입니다');
    return { head: data[0].map((h) => String(h).trim()), rows: data.slice(1).filter((r) => String(r[0]).trim()) };
  }

  /* ---------- ② 값 엑셀 → PDF ---------- */
  async function valuesToPdf(file) {
    const { head, rows } = await readSheet(file, '일지값');
    const col = (r, name) => { const i = head.indexOf(name); return i < 0 ? '' : String(r[i]).trim(); };
    const list = rows.map((r) => {
      const values = {}; F.forEach((f) => { values[f[0]] = col(r, f[0]); });
      return { meta: { id: col(r, '보고서번호'), station: col(r, '소방서'), center: col(r, '출동센터'), time: col(r, '신고일시') }, values, marks: [] };
    });
    return { bytes: await buildPdf(list, '일지'), n: list.length };
  }

  /* ---------- ③ 오류 엑셀(0/1) → 수정 칸 표시 PDF ---------- */
  async function errorsToPdf(file, excludeDeleted, zip) {
    const { head, rows } = await readSheet(file, '오류위치');
    const items = head.slice(META.length), list = [];
    rows.forEach((r) => {
      const marks = items.filter((it, i) => String(r[META.length + i]).trim() === '1' && !(excludeDeleted && it === DELETED_ITEM));
      if (marks.length) list.push({ meta: { id: String(r[0]).trim(), station: String(r[1]).trim(), center: String(r[2]).trim(), time: String(r[3]).trim() }, values: null, marks });
    });
    if (!list.length) throw new Error('수정이 필요한 일지(1로 표시된 칸)가 없습니다');
    list.sort((a, b) => ((a.meta.center + a.meta.id) < (b.meta.center + b.meta.id) ? -1 : 1));
    if (!zip) return { bytes: await buildPdf(list, '수정 칸 표시 일지'), n: list.length, zip: false };
    const files = [], centers = [...new Set(list.map((x) => x.meta.center))];
    for (const c of centers) files.push({ name: '일지_' + (c || '센터없음') + '.pdf', data: await buildPdf(list.filter((x) => x.meta.center === c), c || '센터없음') });
    return { zip: makeZip(files), n: list.length, centers: centers.length };
  }

  /* ---------- 화면 ---------- */
  let busy = false;
  async function run(fn) {
    if (busy) return;
    busy = true;
    try { await fn(); } catch (e) { console.error(e); $('#x-state').textContent = '만들지 못했습니다: ' + (e.message || e); }
    busy = false;
  }
  $('#x-val').addEventListener('click', () => run(async () => {
    const n = Math.max(1, Math.min(500, +$('#x-n').value || 1)), g = await genMany(n);
    saveBlob('ilji_values.xlsx', xlsxBlob(valuesWorkbook(g.rows)));
    $('#x-state').textContent = '일지 ' + n + '건(시드 ' + g.base + '~)의 값을 ilji_values.xlsx 로 저장했습니다.';
  }));
  $('#x-err').addEventListener('click', () => run(async () => {
    const n = Math.max(1, Math.min(500, +$('#x-n').value || 1)), g = await genMany(n);
    saveBlob('ilji_errors_01.xlsx', xlsxBlob(errorWorkbook(g.rows)));
    $('#x-state').textContent = '일부러 넣은 오류 위치(0/1) ' + n + '건(시드 ' + g.base + '~)을 ilji_errors_01.xlsx 로 저장했습니다. 같은 시드·오류 수준이면 값 엑셀과 같은 일지입니다.';
  }));
  $('#x-go1').addEventListener('click', () => run(async () => {
    const f = $('#x-f1').files[0]; if (!f) { $('#x-state').textContent = '값 엑셀 파일을 먼저 고르세요.'; return; }
    const r = await valuesToPdf(f);
    saveBlob('ilji_from_excel.pdf', new Blob([r.bytes], { type: 'application/pdf' }));
    $('#x-state').textContent = '일지 ' + r.n + '쪽을 ilji_from_excel.pdf 로 저장했습니다.';
  }));
  $('#x-go2').addEventListener('click', () => run(async () => {
    const f = $('#x-f2').files[0]; if (!f) { $('#x-state').textContent = '오류 엑셀 파일을 먼저 고르세요.'; return; }
    const zip = $('#x-mode').value === 'zip', r = await errorsToPdf(f, $('#x-exc').checked, zip);
    if (r.zip) { saveBlob('ilji_marked_by_center.zip', r.zip); $('#x-state').textContent = '센터 ' + r.centers + '곳(일지 ' + r.n + '건)을 ilji_marked_by_center.zip 으로 저장했습니다.'; }
    else { saveBlob('ilji_marked.pdf', new Blob([r.bytes], { type: 'application/pdf' })); $('#x-state').textContent = '수정이 필요한 일지 ' + r.n + '쪽을 ilji_marked.pdf 로 저장했습니다.'; }
  }));

  // 시험·확인용
  window.__xl = { F, ITEMS, genLog, genMany, valuesWorkbook, errorWorkbook, valuesToPdf, errorsToPdf, readField, parseOpts, fieldOpts };
})();
