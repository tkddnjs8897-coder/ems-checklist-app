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
