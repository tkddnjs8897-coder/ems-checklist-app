"""템플릿 + SheetJS(xlsx.mini.min.js) -> 단일 파일 ilji-precheck.html
사용: python build_html.py <xlsx.mini.min.js 경로>
"""
import sys
from pathlib import Path

here = Path(__file__).parent
lib = Path(sys.argv[1]).read_text(encoding="utf-8")
html = (here / "ilji-precheck.template.html").read_text(encoding="utf-8")
assert "/*__XLSX__*/" in html and "/*__LAYOUT__*/{}" in html
layout = (here / "form_layout.json").read_text(encoding="utf-8")
html = html.replace("/*__LAYOUT__*/{}", layout).replace("/*__XLSX__*/", lib.replace("</script", "<\\/script"))
(here / "ilji-precheck.html").write_text(html, encoding="utf-8")
print("OK", (here / "ilji-precheck.html").stat().st_size, "bytes")
