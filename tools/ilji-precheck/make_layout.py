"""구급빨간펜 team.json 의 이송 일지 칸 좌표 -> form_layout.json
사용: python make_layout.py <team.json 경로>
출력 좌표는 PDF 점(pt) 단위, 쪽 왼쪽 위가 (0,0): box = [x0, y0, x1, y1]
칸이 없는 항목(폐지)은 포함하지 않는다.
"""
import json
import sys
from pathlib import Path

team = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
oz = team["tpl"]["oz2025"]
maps = oz["maps"]["transport"]
out = {"page": oz["page"], "form": oz["label"], "items": {k: {"box": v["box"]} for k, v in maps.items() if v}}
Path(__file__).with_name("form_layout.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("항목", len(out["items"]), "/ 제외", [k for k, v in maps.items() if not v])
