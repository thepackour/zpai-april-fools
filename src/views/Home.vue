<template>
  <span class="april-fools">이 사이트는 만우절 이벤트 목적으로 제작되었습니다. 자세한 사항은
  <router-link to="/april-fools">ai.zeropage.org/april-fools</router-link>
  을 확인하세요.</span>
  <div :style="{ fontFamily: randomFont }" class="title" :class="['slide-up', { show: showTitle }]">ZPAI</div>
  <div class="terminal" v-if="showTerminal">
    <div class="chat" ref="chatContainer">
      <div v-for="(line, index) in output" :key="index">
        {{ line }} <span v-if="isLoggedIn && index === 0" @click="handleClick()" style="cursor: pointer; font-size: 8px;">.</span>
      </div>
    </div>
    <div class="inputText" v-if="isIdle">
      <label for="cmd">{{ inputMode }}</label>
      <input
        v-model="inputText"
        @keyup.enter="runCommand"
        placeholder="명령어를 입력하세요..."
        autofocus
      />
    </div>
  </div>
</template>

<script>
import asciiData from '@/assets/asciiArt.json';
import longCommandAnswer from '@/assets/commands.json';

export default {
  name: 'HomePage',
  data() {
    return {
      inputText: "",
      output: [],
      fonts : [
        "'Hurricane', cursive",
        "'Bitcount', system-ui",
        "'Black Ops One', system-ui"
      ],
      randomFont: '',
      showTitle: false,
      mode: 'command',
      isLoggedIn: false,
      showTerminal: false,
      inputMode: '$',
      isIdle: true,
      tmiList: [],
      showSecretButton: true,
      isBeta: false,
      errorCode: null
    }
  },
  methods: {
    drawAsciiArt() {
      for (const line of asciiData.logo) {
        this.output.push(line);
      }
    },
    initTerminal(loginWith) {
      setTimeout(() => {
        for (const line of asciiData.logo) {
          this.output.push(line);
        }
       }, 500);
       setTimeout(() => this.output.push("\n" + loginWith), 1000);
       setTimeout(() => this.output.push("help를 입력하여 사용 가능한 명령어를 조회하세요!"), 1200);
    },
    loginErrorHandle(error) {
      console.error('Error:', error);
      this.output.push("잘못된 요청입니다.");
      this.inputMode = '$';
      this.mode = 'command';
      this.isIdle = true;
    },
    autoScrollDown() {
      this.$nextTick(() => {
        const el = this.$refs.chatContainer;
        el.scrollTop = el.scrollHeight;
      });
    },
    runCommand() {
      const command = this.inputText.trim();
      if (!command) return;

      if (this.isBeta) {
        this.output.push("에러가 발생했습니다. (에러 코드: " + this.errorCode + ")");
        this.autoScrollDown();
        this.inputText = "";
        return;
      }

      if (this.mode === 'command') {
        this.output.push("$ " + command);

        const commands = {
          about: () => longCommandAnswer['about'],
          event: () => {
            if (!this.isLoggedIn) {
              return "권한이 없습니다.";
            }
            return longCommandAnswer['event']
          },
          help: () => longCommandAnswer['help'][this.isLoggedIn ? 1 : 0 ],
          homepage: () => "https://zeropage.org",
          logo: () => {
            if (!this.isLoggedIn) {
              return "권한이 없습니다.";
            }
            this.output.push("\n");
            for (const line of asciiData.logo) {
             this.output.push(line);
            }
            return "";
          },
          login: () => {
            if (this.isLoggedIn) {
              return "이미 로그인 상태입니다.";
            }
            this.mode = 'login-id';
            this.inputMode = 'id: ';
          },
          logout: () => {
            if (!this.isLoggedIn) {
              return "이미 로그아웃 상태입니다.";
            }
            this.output = [];
            this.isLoggedIn = false;
            this.inputMode = '$';
            this.initTerminal("게스트로 로그인 중입니다.");
          },
          lounge: () => "https://lounge.zeropage.org",
          now: () => new Date().toLocaleString(),
          oms: () => longCommandAnswer['oms'],
          portal: () => "https://portal.zeropage.org",
          sprout: () => longCommandAnswer['sprout'],
          tmi: () => {
            if (this.tmiList.length === 0) {
              this.tmiList = longCommandAnswer['tmi'].slice();
              for (let i = 0; i < longCommandAnswer['tmi'].length - 2; i++) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.tmiList[i], this.tmiList[j]] = [this.tmiList[j], this.tmiList[i]];
              }
            }
            return this.tmiList.shift();
          },
          whoareyou: () => "저는 지파이 입니다."
        };
        
        const response = commands[command]
        ? commands[command]()
        : ["업데이트 예정입니다.", "다시 시도해주세요,"][Math.floor(Math.random() * 2)];
        this.output.push(response);
        // 스크롤 최하단으로 이동 코드 원래 여기임
      } else if (this.mode === 'login-id') {
        this.output.push("id: " + command);

        if (command === 'zeropage') {
          this.mode = 'login-password';
          this.inputMode = 'password: ';
        } else {
          this.output.push("아이디가 일치하지 않습니다.");
          this.mode = 'command';
          this.inputMode = '$';
        }
      }
      else if (this.mode === 'login-password') {
        this.output.push("요청 중...");
        this.isIdle = false;
        fetch('/api/v99/validate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: command })
        })
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            this.output = [];
            this.isLoggedIn = true;
            this.inputMode = '#';
            this.mode = 'command';
            setTimeout(() => {
              this.output.push()
              this.initTerminal("테스트 계정으로 로그인 중입니다.");
            }, 500);
          } else {
            this.output.push("비밀번호가 일치하지 않습니다.");
            this.autoScrollDown();
            this.inputMode = '$';
            this.mode = 'command';
          }
        })
        .then(() => {
          this.isIdle = true;
        })
        .catch( error => {
          this.loginErrorHandle(error);
          this.autoScrollDown();
        });
      }
      this.autoScrollDown();
      this.inputText = "";
    },
    handleClick() {
      this.output.push("요청 중...");
      this.isIdle = false;
      fetch('/api/v99/activate-beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.status == "ok") {
          this.errorCode = data.errorCode;
          this.output.push("베타 모드가 활성화 되었습니다.");
          this.isBeta = true;
        } else {
          this.output.push("잘못된 요청입니다.");
        }
        this.mode = 'command';
        this.isIdle = true;
      })
      .catch( error => {
        this.loginErrorHandle(error);
        this.autoScrollDown();
        this.mode = 'command';
        this.isIdle = true;
      });
      this.autoScrollDown();
      this.inputText = "";
    }
  },
  mounted() {
    const randomIndex = Math.floor(Math.random() * this.fonts.length);
    this.randomFont = this.fonts[randomIndex];

    this.initTerminal("게스트로 로그인 중입니다.");

    // 0.5초 뒤 애니메이션 시작
    setTimeout(() => {
      this.showTitle = true;
    }, 500);

    setTimeout(() => {
      this.showTerminal = true;
    }, 1200)
    setTimeout(() => {
      this.showTerminal = false;
    }, 1250)
    setTimeout(() => {
      this.showTerminal = true;
    }, 1300)
    setTimeout(() => {
      this.showTerminal = false;
    }, 1350)
    setTimeout(() => {
      this.showTerminal = true;
    }, 1400)
  }
};
</script>

<style scoped>
/* 전체 페이지 배경 */

.title {
  display: block;
  text-align: center;
  margin-top: 48px;
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
  font-size: 64px;
  color: white;
  font-family: 'Nanum Brush Script', cursive;
}

.slide-up {
  opacity: 0;
  transform: translateY(30px); /* 아래에서 시작 */
  transition: all 1s ease;     /* 1초 동안 위로 올라오면서 페이드인 */
}

.slide-up.show {
  opacity: 1;
  transform: translateY(0);    /* 원래 위치 */
}

.terminal {
  background-color: #000;       /* 검은 배경 */
  color: white;              /* 녹색 글자 */
  padding: 40px 100px;
  white-space: pre-wrap;       /* 줄바꿈 유지 */
}

.terminal .chat {
  height: 530px;
  overflow-y: auto;           /* 내용이 많아지면 스크롤 */
}

.terminal .chat::-webkit-scrollbar {
  width: 8px;
}

.terminal .chat::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);           /* 스크롤바 색상 */
  border-radius: 4px;
  transition: background-color 1s;
}

.terminal .chat::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);           /* 스크롤바 색상 */
  border-radius: 4px;
}

.terminal .chat::-webkit-scrollbar-track {
  background: transparent;
}

.terminal label {
  margin-right: 5px;
}

.terminal input {
  background-color: transparent; /* 배경 투명 */
  border: none;                  /* 테두리 제거 */
  color: white;
  font-family: inherit;          /* 부모 폰트 상속 */
  outline: none;                 /* 포커스 테두리 제거 */
  flex: 1;
  margin-top: 30px;
}

/* 커서 깜빡이는 효과 */
.terminal input::placeholder {
  opacity: 0.5;
}

.april-fools {
    color: white;
    font-size: 12px;
}

.april-fools a {
    color: white;
    text-decoration: underline;
}


</style>
