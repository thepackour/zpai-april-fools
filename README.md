# zpai-april-fools
2026년 ZP 만우절 이벤트

- FE : Vue
- BE : Flask
- 인프라 : Oracle Cloud (클라우드) , Nginx (리버스 프록시)

## 시나리오

챗봇에는 다음 명령어가 있음

- about : ZP 소개
- homepage : ZP 홈페이지 링크
- portal : ZP 포탈 링크
- lounge : ZP 라운지 링크
- help : 도움말
- whoareyou : 전 지파이 입니다.
- sprout : 현재 개설된 새싹 교실
- oms : 이번 학기 OMS 목록
- now : 현재 시간 출력
- tmi : 랜덤한 TMI를 알려줌 (테트리스 가방처럼)
    - 이번 CPC의 7번째 문제를 푼 사람 중 절반이 11중첩 for문으로 풀었습니다.
    - ZeroPage 정회원이 되면 굉장한 혜택을 누릴 수 있습니다.
    - JAVA와 Javascript는 다른 언어입니다.
    - 2026년 4월 1일은 308관에서 화재대피훈련 하는 날입니다.
    - ZeroPage는 1991년부터 시작되었습니다.
    - ZeroPage 초대 회장님은 김승태 교수님입니다.
    - ZPAI 발음은 '지파이' 입니다.
    - 64진수는 0-9, A-Z, a-z, 그리고 특수문자 2개로 이루어진 수 체계입니다.
    - *브라우저에서 F12를 누르면 개발자 도구를 열 수 있습니다. (마지막에)
- login : 로그인 (테스트 계정)
    - 아이디 : zeropage
    - 비번 : 5100f1!rpa
- 그 이외 : 업데이트 예정입니다. 다시 시도해주세요.

처음 들어가면 ASCII 아트와 함께 “게스트로 로그인 중입니다.” “help를 입력하여 사용 가능한 명령어를 조회하세요!”가 나옴

tmi 8번 입력하면 F12를 누르라는 힌트가 나오고, F12를 누르면 주석으로 “내가 까먹을까봐 적어놓는 테스트 계정 정보” “208 4F LOCKER 4” 적혀있음

208관 4층 004번 사물함에 포스트잇으로 아이디랑 비번 적어놓고 떼지 말라는 문구 붙여놓음

login에서 아이디 비번 입력하면 화면이 초기화되면서 “테스트 계정으로 로그인 중입니다.” “help를 입력하여 사용 가능한 명령어를 조회하세요!” 나옴

help 치면 다음 명령어와 함께 “아직 완성되지 않은 명령어는 표시하지 않습니다.” 나옴

- logout : 로그아웃
- logo : ASCII 아트 출력
- event : 1학기 행사 목록
    - 개강총회 (3/16)
    - MT (5/9 ~ 5/10 예상)
    - 새싹 교실 (상시)
    - 일반 스터디 (조만간 열릴 예정)
    - OMS (상시) (”라운지에서 가장 최근 OMS 자료도 확인 가능합니다!!!!!”)
    - 백준킹 (상시)

식목일 기념 트리 OMS 자료 맨 마지막에 다음 내용 적기

“지파이 관련 참고사항”

“테스트 계정으로 로그인 하면 화면이 초기화되고 ASCII 아트가 등장합니다.”

“ASCII 아트 우측 상단의 점을 누르면 베타 모드가 활성화됩니다. 베타 모드는 ‘매우’ 불안정하므로 주의하시기 바랍니다.”

베타 모드가 활성화된 상태에서 아무거나 치면 에러코드와 함께 에러 발생

### 본인 확인 방안

    ##### 백엔드 #####
    from flask import Flask, request, jsonify
    import jwt
    import datetime
    
    app = Flask(__name__)
    SECRET_KEY = "youfoundsecretkeysowhat"
    
    @app.route("/api/v99/activate-beta", methods=["GET", "POST"])
    def activate_beta():
        client_ip = request.remote_addr
    
        payload = {
            "ip": client_ip,  # IP
            "iat": datetime.datetime.utcnow()  # 생성 시각
        }
    
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
        # body에 담아 반환
        return jsonify({"status": "ok", "errorCode": token})
    
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)
---
    ##### 복호화 코드 #####
    import jwt
    
    SECRET_KEY = "youfoundsecretkeysowhat"
    
    token = "ERRORCODE" # 에러 코드
    
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(decoded)
    except jwt.InvalidTokenError:
        print("유효하지 않은 코드")
