"""구급빨간펜 시험용 랜덤 일지 생성기(ems-random.html)에 엑셀 ↔ 일지·세부상황표 변환기(첫 화면 + 탭)를 넣어 ems-random-plus.html 을 만든다.
사용: python build_generator.py <원본 ems-random.html> <xlsx.mini.min.js>
원본은 바꾸지 않는다. 넣는 것: ui_head/ui_home/ui_gen.html + ui.css(화면), extras.js(기능), SheetJS(엑셀 읽기·쓰기), ../form_layout.json(칸 좌표)
"""
import sys
from pathlib import Path

here = Path(__file__).parent
rd = lambda p: Path(p).read_text(encoding="utf-8")
safe = lambda js: js.replace("</script", "<\\/script")

html = rd(sys.argv[1])
import re
assert html.count("</main>") == 1 and html.count("</body>") == 1 and html.count("<main>") == 1 and html.count("</head>") == 1, "원본 구조가 예상과 다릅니다"
extras = rd(here / "extras.js").replace("/*__LAYOUT__*/{}", rd(here.parent / "form_layout.json"))
html = html.replace("</head>", "<style>\n" + rd(here / "ui.css") + "</style>\n</head>", 1)
html, n = re.subn(r"<header>.*?</header>", lambda m: rd(here / "ui_head.html"), html, count=1, flags=re.S)
assert n == 1, "원본 header 를 찾지 못했습니다"
html = html.replace("</main>", rd(here / "ui_gen.html") + "</main>", 1)  # 원본 main 끝에 먼저 넣고
html = html.replace("<main>", rd(here / "ui_home.html") + '\n<main id="x-gen" hidden>', 1)  # 그 앞에 첫 화면을 붙인다
html = html.replace(
    "</body>",
    "<script>\n/* SheetJS Community Edition 0.18.5 (Apache-2.0) https://sheetjs.com */\n" + safe(rd(sys.argv[2])) + "\n</script>\n"
    "<script>\n" + safe(extras) + "\n</script>\n</body>",
    1,
)
html = html.replace("<title>구급기록 시험용 일지 생성기</title>", "<title>구급일지 변환기</title>", 1)
out = here / "ems-random-plus.html"
out.write_text(html, encoding="utf-8")
print("OK", out, out.stat().st_size, "bytes")
