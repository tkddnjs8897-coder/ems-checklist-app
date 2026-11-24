/* 구급빨간펜 시험/ems-random.html(랜덤 구급일지 생성기)의 PDF 글자 편집 엔진·ZIP 만들기를 옮긴 것. 글자마다 Td/Tj 로 저장된 OZ Report PDF 용. */
/* ---------- PDF 글자 편집 엔진 (OZ Report PDF: 글자마다 Td/Tj 로 저장됨) ---------- */
const bin = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return s; };
const toU8 = (s) => { const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; };
function readStr(b, i) { // b[i-1] 가 '(' . 반환: [바이트문자열, 다음위치]
  let out = '', depth = 1;
  while (i < b.length) {
    const c = b[i];
    if (c === '\\') {
      const n = b[i + 1];
      if ('nrtbf'.includes(n)) { out += { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' }[n]; i += 2; }
      else if (n >= '0' && n <= '7') { let j = i + 1, v = 0, k = 0; while (k < 3 && j < b.length && b[j] >= '0' && b[j] <= '7') { v = v * 8 + (b.charCodeAt(j) - 48); j++; k++; } out += String.fromCharCode(v & 255); i = j; }
      else { out += n; i += 2; }
    } else if (c === '(') { depth++; out += c; i++; }
    else if (c === ')') { depth--; if (!depth) return [out, i + 1]; out += c; i++; }
    else { out += c; i++; }
  }
  throw new Error('문자열 끝을 찾지 못함');
}
const esc = (ch) => { const code = ch.charCodeAt(0); return '(' + [code >> 8, code & 255].map((x) => (x < 32 || x > 126 || x === 40 || x === 41 || x === 92 ? '\\' + x.toString(8).padStart(3, '0') : String.fromCharCode(x))).join('') + ')'; };

class Stream {
  constructor(u8, pageH) {
    this.src = bin(u8); this.H = pageH; this.runs = [];
    const BLK = /BT\r?\n([\s\S]*?)ET/g; let m;
    while ((m = BLK.exec(this.src))) {
      const body = m[1], tm = /([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) Tm/.exec(body); if (!tm) continue;
      const tf = /\/(\w+) ([\d.]+) Tf/.exec(body);
      const run = { s: m.index, e: m.index + m[0].length, head: body.slice(0, tm.index + tm[0].length), size: tf ? +tf[2] : 8, x: +tm[5], y: +tm[6], g: [], dirty: false };
      let pos = tm.index + tm[0].length;
      for (;;) {
        const j = body.indexOf('(', pos); if (j < 0) break;
        const dm = /([-\d.]+) ([-\d.]+) Td/.exec(body.slice(pos, j)); const dx = dm ? +dm[1] : 0;
        const [raw, np] = readStr(body, j + 1); pos = np; const tj = /^\s*Tj/.exec(body.slice(pos)); if (tj) pos += tj[0].length;
        run.g.push([dx, raw.length === 2 ? String.fromCharCode((raw.charCodeAt(0) << 8) | raw.charCodeAt(1)) : raw]);
      }
      run.text = run.g.map((a) => a[1]).join(''); this.runs.push(run);
    }
    const cnt = new Map();
    for (const r of this.runs) for (let i = 0; i < r.g.length - 1; i++) { const k = r.size + '|' + r.g[i][1], d = Math.round(r.g[i + 1][0] * 1e5) / 1e5; const c = cnt.get(k) || new Map(); c.set(d, (c.get(d) || 0) + 1); cnt.set(k, c); }
    this.advt = new Map(); for (const [k, c] of cnt) this.advt.set(k, [...c.entries()].sort((a, b) => b[1] - a[1])[0][0]);
  }
  top(r) { return this.H - r.y; }
  adv(ch, size) { const a = this.advt.get(size + '|' + ch); return a !== undefined ? a : (ch.charCodeAt(0) > 0x7f ? size : size * 0.55078125); }
  width(text, size = 8) { let w = 0; for (const c of text) w += this.adv(c, size); return w; }
  at(x, y, hint, tol = 3.2) {
    const c = this.runs.filter((r) => Math.abs(r.x - x) < tol + 2 && Math.abs(this.top(r) - y) < tol && (!hint || (hint instanceof RegExp ? hint.test(r.text) : r.text.includes(hint))));
    if (!c.length) throw new Error(`위치 (${x},${y}) ${hint || ''} 칸을 못 찾음`);
    return c[0];
  }
  find(rx) { const r = this.runs.find((q) => rx.test(q.text)); if (!r) throw new Error('칸 못 찾음 ' + rx); return r; }
  set(run, text) { if (!text.length) text = ' '; run.g = [[0, text[0]]]; for (let i = 1; i < text.length; i++) run.g.push([this.adv(text[i - 1], run.size), text[i]]); run.text = text; run.dirty = true; }
  uncheck(run) { this.set(run, run.text.replace(/\[√\]/g, '[ ]')); }
  check(run, label, on = true) {
    const t = run.text, i = t.indexOf(label); if (i < 0) throw new Error(`'${label}' 없음: ${t.slice(0, 40)}`);
    const k = t.lastIndexOf('[', i); if (k < 0 || t[k + 2] !== ']') throw new Error(`'${label}' 앞 체크칸 없음`);
    this.set(run, t.slice(0, k + 1) + (on ? '√' : ' ') + t.slice(k + 2));
  }
  choose(run, ...labels) { this.uncheck(run); labels.forEach((l) => this.check(run, l, true)); }
  serialize() {
    let out = '', last = 0;
    for (const r of this.runs) {
      if (!r.dirty) continue;
      out += this.src.slice(last, r.s) + 'BT\r\n' + r.head + '\r\n';
      r.g.forEach(([dx, ch], n) => { if (n) out += dx.toFixed(5) + ' 0.00000 Td\r\n'; out += esc(ch) + ' Tj\r\n'; });
      out += 'ET'; last = r.e;
    }
    return toU8(out + this.src.slice(last));
  }
}

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (u) => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function makeZip(files) {
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const u16 = (v) => [v & 255, (v >> 8) & 255], u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  for (const f of files) {
    const nm = enc.encode(f.name), data = f.data, crc = crc32(data);
    const lh = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), 0, 0]);
    parts.push(lh, nm, data);
    cen.push(new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(off)]), nm);
    off += lh.length + nm.length + data.length;
  }
  const cs = cen.reduce((a, b) => a + b.length, 0);
  parts.push(...cen, new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(files.length), ...u16(files.length), ...u32(cs), ...u32(off), 0, 0]));
  return new Blob(parts, { type: 'application/zip' });
}
