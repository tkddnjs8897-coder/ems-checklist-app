"""구급일지 오류 엑셀(0/1)로 수정 요청 자료를 만든다. 전부 로컬에서만 처리한다.

만드는 것
  1. 수정요청_목록.xlsx   건별 목록 / 항목별 집계 / 출동센터별 시트
  2. 수정요청서_<센터>.pdf  센터(또는 대원)에 배포할 수정 필요 목록
  3. (--pdf 지정 시) 표시_<센터>.pdf  원본 일지 PDF에 틀린 항목을 빨간 박스로 표시

값을 추정해서 채우지 않는다. 어떤 항목을 고쳐야 하는지만 알려 준다.
"""
import argparse
import io
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

META_COLS = 4  # 보고서번호, 소방서, 출동센터, 신고일시
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\malgun.ttf",
    "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
]
FONT = "KR"


def load_font(path=None):
    for p in ([path] if path else []) + FONT_CANDIDATES:
        if p and Path(p).exists():
            kwargs = {"subfontIndex": 0} if p.lower().endswith(".ttc") else {}
            pdfmetrics.registerFont(TTFont(FONT, p, **kwargs))
            return p
    sys.exit("한글 폰트를 찾지 못했습니다. --font 로 .ttf 경로를 지정하세요.")


def fmt_time(s):
    m = re.fullmatch(r"(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})", str(s or ""))
    return "{}-{}-{} {}:{}:{}".format(*m.groups()) if m else str(s or "")


def read_errors(xlsx):
    ws = openpyxl.load_workbook(xlsx).active
    rows = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h is not None else "" for h in next(rows)]
    items = header[META_COLS:]
    reports, clean = [], 0
    for r in rows:
        if not r or not r[0]:
            continue
        errs = [items[i] for i, v in enumerate(r[META_COLS:META_COLS + len(items)])
                if str(v).strip() == "1"]
        if not errs:
            clean += 1
            continue
        reports.append({"id": str(r[0]).strip(), "station": r[1] or "", "center": r[2] or "",
                        "time": fmt_time(r[3]), "errs": errs})
    return items, reports, clean


def write_xlsx(path, reports, guidance):
    wb = openpyxl.Workbook()
    head_fill = PatternFill("solid", fgColor="DDDDDD")

    def sheet(ws, header, rows, widths):
        ws.append(header)
        for c in ws[1]:
            c.font, c.fill = Font(bold=True), head_fill
        for r in rows:
            ws.append(r)
        for col, w in zip("ABCDEFGH", widths):
            ws.column_dimensions[col].width = w
        for row in ws.iter_rows(min_row=2):
            for c in row:
                c.alignment = Alignment(wrap_text=True, vertical="top")
        ws.freeze_panes = "A2"

    def row(r):
        notes = [guidance.get(e, "") for e in r["errs"]]
        return [r["id"], r["station"], r["center"], r["time"], len(r["errs"]),
                ", ".join(r["errs"]), " / ".join(n for n in notes if n)]

    header = ["보고서번호", "소방서", "출동센터", "신고일시", "오류 수", "수정 필요 항목", "안내"]
    widths = [24, 14, 18, 20, 8, 40, 40]
    ws = wb.active
    ws.title = "건별목록"
    sheet(ws, header, [row(r) for r in reports], widths)

    cnt = Counter(e for r in reports for e in r["errs"])
    sheet(wb.create_sheet("항목별집계"), ["항목", "오류 건수"], sorted(cnt.items()), [30, 12])

    by_center = defaultdict(list)
    for r in reports:
        by_center[r["center"] or "미분류"].append(r)
    for center, rs in sorted(by_center.items()):
        sheet(wb.create_sheet(center[:31]), header, [row(r) for r in rs], widths)
    wb.save(path)
    return by_center


def write_request_pdf(path, center, rs, guidance):
    st = lambda n, **k: ParagraphStyle(n, fontName=FONT, **k)
    body, small = st("b", fontSize=9, leading=12), st("s", fontSize=8, leading=11)
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm,
                            topMargin=15 * mm, bottomMargin=15 * mm, title=f"수정요청서 {center}")
    data = [[Paragraph(h, body) for h in ("보고서번호", "신고일시", "수정 필요 항목")]]
    for r in rs:
        lines = "<br/>".join(f"□ {e}" + (f" - {guidance[e]}" if e in guidance else "")
                             for e in r["errs"])
        data.append([Paragraph(r["id"], small), Paragraph(r["time"], small),
                     Paragraph(lines, small)])
    table = Table(data, colWidths=[52 * mm, 38 * mm, 90 * mm], repeatRows=1)
    table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
                               ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                               ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    title = st("t", fontSize=14, leading=18)
    doc.build([Paragraph(f"구급일지 수정 요청서 - {center}", title),
               Paragraph(f"수정 필요 일지 {len(rs)}건. 표시된 항목을 확인해 수정해 주세요.", body),
               Spacer(1, 6 * mm), table])


def locate(page, label, layout):
    if label in layout:
        return layout[label]
    name = re.sub(r"^\d+(\.\d+)*\.?", "", label)
    for key in (label, name):
        hits = page.search(key, regex=False)
        if hits:
            h = hits[0]
            return {k: h[k] for k in ("x0", "top", "x1", "bottom")}
    return None


def annotate(pdf_paths, reports, layout, out_dir):
    import pdfplumber
    from pypdf import PdfReader, PdfWriter

    by_id = {r["id"]: r for r in reports}
    found, misses = {}, []
    for p in pdf_paths:
        with pdfplumber.open(p) as pl:
            reader = PdfReader(str(p))
            for i, page in enumerate(pl.pages):
                text = page.extract_text() or ""
                rid = next((k for k in by_id if k in text), None)
                if not rid or rid in found:
                    continue
                r = by_id[rid]
                buf = io.BytesIO()
                c = canvas.Canvas(buf, pagesize=(page.width, page.height))
                c.setStrokeColor(colors.red)
                c.setFillColor(colors.red)
                c.setLineWidth(1.2)
                for e in r["errs"]:
                    box = locate(page, e, layout)
                    if not box:
                        misses.append((rid, e))
                        continue
                    pad = 2
                    c.rect(box["x0"] - pad, page.height - box["bottom"] - pad,
                           box["x1"] - box["x0"] + 2 * pad, box["bottom"] - box["top"] + 2 * pad)
                c.setFont(FONT, 8)
                c.drawString(12, page.height - 10, "수정 필요: " + ", ".join(r["errs"]))
                c.save()
                buf.seek(0)
                base = reader.pages[i]
                base.merge_page(PdfReader(buf).pages[0])
                found[rid] = base

    out_dir.mkdir(parents=True, exist_ok=True)
    by_center = defaultdict(list)
    for rid in sorted(found):
        by_center[by_id[rid]["center"] or "미분류"].append(found[rid])
    for center, pages in by_center.items():
        w = PdfWriter()
        for pg in pages:
            w.add_page(pg)
        with open(out_dir / f"표시_{center}.pdf", "wb") as f:
            w.write(f)
    return found, misses


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("xlsx", help="오류 엑셀(0/1)")
    ap.add_argument("--out", default="out", help="출력 폴더")
    ap.add_argument("--pdf", nargs="*", default=[], help="원본 일지 PDF (여러 개 가능)")
    ap.add_argument("--layout", help="항목 위치 지정 JSON (자동 검색이 안 될 때)")
    ap.add_argument("--guidance", help="항목별 안내문 JSON")
    ap.add_argument("--font", help="한글 .ttf 경로")
    a = ap.parse_args()

    print("폰트:", load_font(a.font))
    load = lambda p: json.loads(Path(p).read_text(encoding="utf-8")) if p else {}
    layout, guidance = load(a.layout), load(a.guidance)

    items, reports, clean = read_errors(a.xlsx)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    by_center = write_xlsx(out / "수정요청_목록.xlsx", reports, guidance)
    for center, rs in by_center.items():
        write_request_pdf(out / f"수정요청서_{center}.pdf", center, rs, guidance)
    print(f"오류 있는 일지 {len(reports)}건 / 오류 없음 {clean}건 / 센터 {len(by_center)}곳")

    if a.pdf:
        found, misses = annotate([Path(p) for p in a.pdf], reports, layout, out)
        lost = [r["id"] for r in reports if r["id"] not in found]
        print(f"원본 PDF 표시 완료 {len(found)}건")
        if lost:
            print(f"PDF에서 보고서번호를 찾지 못함 {len(lost)}건:", ", ".join(lost[:10]), "...")
        if misses:
            print(f"항목 위치를 못 찾아 상단 문구로만 안내한 곳 {len(misses)}곳 (layout.json 지정 필요)")
            for rid, e in misses[:10]:
                print("  ", rid, e)


if __name__ == "__main__":
    main()
