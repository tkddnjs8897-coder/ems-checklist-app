"""스마트 구급일지 복원기 단일 HTML 만들기 (기존 변환기와 별개)
사용: python build_smart.py <xlsx.mini.min.js 경로>
부품: smart.html, smart.js, ../stream.js, ../tpl-log.pdf, ../vendor/pdf-lib.min.js
"""
import base64
import gzip
import sys
from pathlib import Path

here = Path(__file__).parent
rd = lambda p: Path(p).read_text(encoding="utf-8")
safe = lambda js: js.replace("</script", "<\\/script")
html = rd(here / "smart.html")
tpl = base64.b64encode(gzip.compress((here.parent / "tpl-log.pdf").read_bytes(), 9)).decode()
parts = {
    "/*__PDFLIB__*/": safe(rd(here.parent / "vendor" / "pdf-lib.min.js")),
    "/*__XLSX__*/": safe(rd(sys.argv[1])),
    "/*__STREAM__*/": safe(rd(here.parent / "stream.js")),
    "/*__SMART__*/": safe(rd(here / "smart.js").replace("'/*__TPL__*/'", "'" + tpl + "'")),
}
for k, v in parts.items():
    assert html.count(k) == 1, k
    html = html.replace(k, v)
(here / "smart-ilji-restore.html").write_text(html, encoding="utf-8")
print("OK", (here / "smart-ilji-restore.html").stat().st_size, "bytes")
