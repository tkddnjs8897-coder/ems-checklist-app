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
- 외부 통신 차단(CSP). 엑셀 읽기 라이브러리(SheetJS 0.18.5, Apache-2.0)를 파일 안에 포함
- **수정 칸 표시 일지 인쇄/PDF**: 엑셀만으로, 건마다 한 쪽씩 "일지 칸 배치도"를 그리고 고칠 칸을 빨갛게 표시한다(원본 PDF·환자 정보 불필요).
  칸 좌표는 구급빨간펜(team.json)의 구급정보시스템 출력 서식(2025) 이송 일지 좌표 34개(`form_layout.json`). 공식 서식이 아니라 위치 안내용 배치도다.
- `18.환자직업`은 2025 서식에서 칸이 삭제돼(구급빨간펜 결정 2026-10-31) 기본으로 오류에서 제외한다(체크박스로 해제 가능).
- 원본 일지 PDF에 박스 표시는 파이썬 버전(`precheck.py --pdf`)에서만 지원
- 다시 만들기: `python build_html.py <xlsx.mini.min.js 경로>` (템플릿 `ilji-precheck.template.html` + 좌표 `form_layout.json`)
- 좌표 다시 뽑기: `python make_layout.py <team.json 경로>`
