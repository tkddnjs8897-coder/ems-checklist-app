"""템플릿 + 부품 -> 단일 파일 ilji-precheck.html
사용: python build_html.py <xlsx.mini.min.js 경로>
부품: form_layout.json(칸 좌표), tpl-log.pdf(구급활동일지 서식), stream.js(PDF 글자 편집), vendor/pdf-lib.min.js
"""
import base64
import gzip
import sys
from pathlib import Path

here = Path(__file__).parent
rd = lambda p: Path(p).read_text(encoding="utf-8")
safe = lambda js: js.replace("</script", "<\\/script")

html = rd(here / "ilji-precheck.template.html")
parts = {
    "/*__LAYOUT__*/{}": rd(here / "form_layout.json"),
    "'/*__TPL__*/'": "'" + base64.b64encode(gzip.compress((here / "tpl-log.pdf").read_bytes(), 9)).decode() + "'",
    "/*__PDFLIB__*/": safe(rd(here / "vendor" / "pdf-lib.min.js")),
    "/*__STREAM__*/": safe(rd(here / "stream.js")),
    "/*__XLSX__*/": safe(rd(sys.argv[1])),
}
for key, val in parts.items():
    assert html.count(key) == 1, key
    html = html.replace(key, val)
(here / "ilji-precheck.html").write_text(html, encoding="utf-8")
print("OK", (here / "ilji-precheck.html").stat().st_size, "bytes")
