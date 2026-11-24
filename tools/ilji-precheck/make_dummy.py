"""시험용 가짜 데이터 생성. 실제 환자·기관 정보는 전혀 쓰지 않는다.

사용: python make_dummy.py <출력폴더>
  -> dummy_errors.xlsx (오류 엑셀 모양), dummy_form.pdf (가짜 구급일지 서식 5장)
"""
import sys
from pathlib import Path

import openpyxl
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from precheck import FONT, load_font

ITEMS = ["1.소속", "2.차량번호", "3.구급구분", "4.신고일시", "5.출동일시", "6.현장도착일시",
         "14.환자성명", "15.환자나이", "16.환자성별", "17.환자주소", "18.환자직업",
         "21.환자증상", "23.의식상태(1차)", "25.활력징후", "26.환자분류", "28.응급처치"]
HEADER = ["보고서번호", "소방서", "출동센터", "신고일시"] + ITEMS
CENTERS = ["가상센터A", "가상센터B"]
ERRORS = {0: ["18.환자직업", "26.환자분류"], 1: ["25.활력징후"], 2: [], 3: ["18.환자직업"],
          4: ["21.환자증상", "28.응급처치"]}


def main(out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    load_font()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(HEADER)
    for i in range(5):
        flags = ["1" if it in ERRORS[i] else "0" for it in ITEMS]
        ws.append([f"TEST{i + 1:04d}", "가상소방서", CENTERS[i % 2], f"2026110{i + 1}120000"] + flags)
    wb.save(out / "dummy_errors.xlsx")

    c = canvas.Canvas(str(out / "dummy_form.pdf"), pagesize=A4)
    for i in range(5):
        c.setFont(FONT, 14)
        c.drawString(60, 800, "구급활동일지 (가상 서식)")
        c.setFont(FONT, 10)
        c.drawString(60, 780, f"보고서번호 TEST{i + 1:04d}")
        for n, it in enumerate(ITEMS):
            y = 740 - 40 * n
            c.drawString(60, y, it)
            c.drawString(200, y, "(가상 입력값)")
            c.rect(190, y - 6, 200, 20)
        c.showPage()
    c.save()
    print("생성:", out)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "dummy")
