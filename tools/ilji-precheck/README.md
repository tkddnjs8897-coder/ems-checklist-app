# 구급일지 수정 요청 도구 (ilji-precheck)

오류 엑셀(0/1)로 **수정 요청 자료**를 만든다. 값을 추정해 채우지 않고, 고쳐야 할 항목만 알려 준다.
인터넷 연결 없이 로컬에서만 동작한다. 개발·시험은 가상 데이터(`make_dummy.py`)로 한다.

## 사용
```
pip install -r requirements.txt
python precheck.py 오류.xlsx --out out                      # 목록 엑셀 + 센터별 수정요청서 PDF
python precheck.py 오류.xlsx --pdf 일지.pdf --out out        # + 원본 일지에 빨간 박스 표시
python make_dummy.py dummy                                  # 시험용 가짜 엑셀/PDF 생성
```
옵션: `--layout layout.json`(항목 위치 직접 지정), `--guidance guidance.json`(항목별 안내문), `--font`(한글 ttf)

## 가정
- 엑셀 앞 4열은 보고서번호·소방서·출동센터·신고일시, 나머지는 항목별 0/1(1=수정 필요)
- 일지 한 건 = PDF 한 쪽, 쪽 안에 보고서번호가 텍스트로 있음 (스캔 이미지면 OCR 필요)
- 항목 위치는 PDF 안 라벨 텍스트("18.환자직업" 또는 "환자직업")로 자동 검색. 못 찾으면 쪽 상단 문구로만 안내하고 목록을 출력한다.

## layout.json 예 (PDF 좌표, 위쪽 기준 pt)
```
{"18.환자직업": {"x0": 60, "top": 300, "x1": 400, "bottom": 325}}
```

## HTML 버전 (설치 불필요)
`ilji-precheck.html` 한 파일을 브라우저로 열고 오류 엑셀을 끌어다 놓으면 된다.
- 건별 목록 · 센터/항목/보고서번호 필터 · 항목별 집계
- `엑셀로 저장`(ilji_fix_list.xlsx), `센터별 수정요청서 인쇄/PDF`(브라우저 인쇄 → PDF로 저장)
- 외부 통신 차단(CSP). 엑셀 읽기(SheetJS 0.18.5, Apache-2.0)와 PDF 만들기(pdf-lib 1.17.1, MIT) 라이브러리를 파일 안에 포함
- **수정 칸 표시 일지 PDF**: 엑셀만으로, 건마다 구급정보시스템 출력 구급활동일지(2025 서식)와 똑같은 한 쪽을 만든다.
  환자 값은 모두 비우고(체크도 해제, 가상 서명 그림 삭제), 엑셀로 아는 것(보고서번호·소방서·센터·신고일시)만 채운 뒤 고칠 칸을 빨간 박스+항목 번호로 표시한다. `센터별 PDF 묶음(ZIP)`도 지원.
  서식은 구급빨간펜 시험용 생성기(ems-random.html)의 서식 PDF(`tpl-log.pdf`)를 쓰고, PDF 글자 편집은 같은 생성기의 엔진(`stream.js`)을 옮겼다. 칸 좌표는 구급빨간펜(team.json) 34개(`form_layout.json`).
  서식 PDF에 한글 글꼴이 들어 있지 않아 PDF 보는 PC에 맑은 고딕이 있어야 글자가 제대로 보인다.
- `18.환자직업`은 2025 서식에서 칸이 삭제돼(구급빨간펜 결정 2026-10-31) 기본으로 오류에서 제외한다(체크박스로 해제 가능). 칸이 없어 PDF에는 표시되지 않는다.
- 원본 일지 PDF에 박스 표시는 파이썬 버전(`precheck.py --pdf`)에서만 지원
- 다시 만들기: `python build_html.py <xlsx.mini.min.js 경로>` (템플릿 `ilji-precheck.template.html` + `form_layout.json` + `tpl-log.pdf` + `stream.js` + `vendor/pdf-lib.min.js`)
- 좌표 다시 뽑기: `python make_layout.py <team.json 경로>`

## 랜덤 일지 생성기에 넣은 버전 (`generator/ems-random-plus.html`)
구급빨간펜 시험용 랜덤 일지 생성기에 "엑셀 ↔ 일지 변환" 카드를 추가한 파일. 원본 생성기 기능은 그대로다.
- ① 만든 일지 N건 → **값 엑셀**(`일지값` 시트, 일지 칸마다 한 열) / **일부러 넣은 오류 위치 엑셀(0/1)**(`오류위치`·`정답표` 시트)
- ② **값 엑셀 → 구급활동일지 PDF** (한 줄 = 한 쪽)
- ③ **오류 엑셀(0/1) → 수정 칸 표시 일지 PDF** (위 `ilji-precheck.html` 기능과 같음, 센터별 ZIP 선택 가능)
- 왕복 시험: 생성기 일지 → 엑셀(xlsx로 쓰고 다시 읽음) → PDF 가 원래 일지와 글자 덩어리 288개 모두 일치(오류 수준 0~3, 48건).
- 값 엑셀의 체크 칸은 선택한 항목 이름을 쉼표로 적는다. 한 칸 안에서 이름이 겹치면 #2, #3 을 붙인다.
- 만드는 법: `python generator/build_generator.py <원본 ems-random.html> <xlsx.mini.min.js>` (원본은 수정하지 않음)
- 일지 칸 변환표는 `generator/extras.js` 의 `F` 배열. 서식 PDF 글자 덩어리 번호 기준이라 서식이 바뀌면 다시 맞춰야 한다.
