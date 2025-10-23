
const commonChoices = ["a", "pi", "c", "s", "b"];
const quizList = [];

// ———— レイアウト定数 ————
const codeX        = 80;
const codeY        = 40;
const codeMaxWidth = 420;
const choiceX      = 850; // 選択肢の位置（右寄せ）
const buttonX      = 750; // ボタンの位置（元の位置に戻す）
const choiceBaseY  = 120;
const choiceGap    = 60;

const extendButtonX = buttonX - 220; // やり直しボタンの左に配置
const extendButtonY = 524;
const extendButtonW = 200;
const extendButtonH = 48;

const reduceButtonX = extendButtonX - 220; // 時間延長ボタンの左
const reduceButtonY = extendButtonY;
const reduceButtonW = 200;
const reduceButtonH = 48;

class Quizclass{
    constructor({question, code, choices, answer, blanks}) {
        this.question = question; // 問題文
        this.code = code;         // 穴あきCコード（文字列、_____で穴あき）
        this.choices = choices;   // 選択肢（配列）
        this.answer = answer;     // 正解インデックス
        this.blanks = blanks;     // 穴の説明（配列）
    }
}


const bgImageKanban    = new Image();
bgImageKanban.src      = './img/quiz_bg/scenery2_kanban.png';      // 1問目

const bgImageKusa      = new Image();
bgImageKusa.src        = './img/quiz_bg/scenery1_kusa.png';        // 2問目

const bgImageHasi      = new Image();
bgImageHasi.src        = './img/quiz_bg/scenery3_hasi.png';        // 3,4問目

const bgImageKuromaku  = new Image();
bgImageKuromaku.src    = './img/quiz_bg/scenery4_kuromaku.png';    // 5問目

const bgImageTakarabako= new Image();
bgImageTakarabako.src  = './img/quiz_bg/scenery5_takarabako.png';  // 6問目

// const bgImage = new Image();
// bgImage.src = '../gazo/quiz_wood.png'; // デフォルト

const seCorrect   = new Audio('./sound/クイズ正解1.mp3');
const seWrong     = new Audio('./sound/クイズ不正解1.mp3');
const seTimeout   = new Audio('./sound/試合終了のゴング.mp3');
const seClick     = new Audio('./sound/クリック.mp3');      // ←追加
const seKeyboard2 = new Audio('./sound/キーボード2.mp3');   // ←追加
const seGauge     = new Audio('./sound/ゲージ回復1.mp3');

let codeScrollY = 0;
//
//各NPCの問題実体化
//
const kanbanQuiz = new Quizclass({
        question: "正しい選択肢を選んで，看板を完成させよう！",
        code: `
#include <stdio.h>

int main() {
    int distance = 3;
    char where[] = "green island";
    // 看板に文字を表示する
    _________("%sまで%dキロ\\n", _________, _________);

    return 0;
}
    `.trim(),
    // 選択肢の配列（インデックス 0～3）
    choices: ["printf","scanf","distance","where"],
  // idx プロパティをなくして answer のみ
    blanks: [
    { answer: 0 },  // 1つめの「_____」の正解は choices[0]（"printf"）
    { answer: 3 },  // 2つめの「_____」は choices[3]（"where"）
    { answer: 2 }   // 3つめの「_____」は choices[2]（"distance"）
    ],
    reduceIdx: [1] // 例: "scanf"（インデックス1）を削減
  })

const kusaQuiz = new Quizclass({
        question: "草を5本刈るプログラムを完成させよう!",
        code: `
#include <stdio.h>

int main() {
    // 草を5本刈るプログラム

    int i;
    _________ ( i=0 ; i<=_________ ; i++ ) {
        _________("草を%d本刈りました\\n",_________);
    }

    return 0;
}
        `.trim(),
        choices: ["printf","for","4","5","i","i+1"],
        blanks: [
            { answer: 1 }, // "for"
            { answer: 2 }, // "4"
            { answer: 0 }, // "printf"
            { answer: 5 }  // "i+1"
        ],
        reduceIdx: [3] // 例: "5"（インデックス3）を削減
  })

const hasiQuiz_1 = new Quizclass({
        question: "橋の状態を確認するプログラムを完成させよう!",
        code: `
#include <stdio.h>

int main() {
    int bridge[] = {2, 2, 1, 0, 2, 1, 0, 2};
    int n = sizeof(bridge) / sizeof(bridge[0]);

    _________ (int i = 0; i < n; i++) {
        _________ (bridge[_________] == 0) {
            _________("橋の%d番目 → 完全に壊れています！危険！\\n", i);
        } _________ (bridge[_________] == 1) {
            _________("橋の%d番目 → ヒビがあります。修理が必要です。\\n", i);
        } _________ (bridge[_________] == 2) {
            _________("橋の%d番目 → 問題ありません。\\n", i);
        }
    }

    return 0;
}
        `.trim(),
        choices: ["printf","for","if","else if","i","i+1"],
        blanks: [
            { answer: 1 }, // "for"
            { answer: 2 }, // "if"
            { answer: 4 }, // "i"
            { answer: 0 }, // "printf"
            { answer: 3 }, // "else if"
            { answer: 4 }, // "i"
            { answer: 0 }, // "printf"
            { answer: 3 }, // "else if"
            { answer: 4 }, // "i"
            { answer: 0 }, // "printf"
        ],
        reduceIdx: [6] // 例: "i+1"（インデックス6）を削減
    })
const hasiQuiz_2 = new Quizclass({
        question: "材料の数を数えるプログラムを完成させよう!",
        code: `
    int materials[] = {0, 1, 3, 2, 1, 0, 4, 3, 2, 1, 4, 0};
    int n = sizeof(materials) / sizeof(materials[0]);
    int stone = 0, iron = 0, sand = 0, wood = 0, clay = 0;

    _________ (int i = 0; i < n; i++) {
        _________ (materials[i] == 0) {
            stone++;
        } _________ (materials[i] == 1) {
            iron++;
        } _________ (materials[i] == 2) {
            sand++;
        } _________ (materials[i] == 3) {
            wood++;
        } _________ (materials[i] == 4) {
            clay++;
        }
    }
    printf("石: %d個\\n", stone);
    printf("鉄: %d個\\n", iron);
    printf("砂: %d個\\n", sand);
    printf("木: %d個\\n", wood);
    printf("粘土: %d個\\n", clay);

    return 0;

        `.trim(),
        choices: ["printf","for","if","else if",],
        blanks: [
            { answer: 1 }, // "for"
            { answer: 2 }, // "if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
        ],
        reduceIdx: [0] // 例: "printf"（インデックス0）を削減
    })

const bossQuiz = new Quizclass({
        question: "首謀者を倒すためのプログラムを完成させよう!",
        code: `
    int i,hit;
    _________ (i = 0; i <= 30; i++) {
        hit = 0; 

        _________ (i % 2 == 0) { // 頭部の弱点
            printf("%d: 頭部に命中！\\n", i);
            hit = 1;
        }
        _________ (i % 3 == 0) { // 胴体の弱点
            printf("%d: 胴体に命中！\\n", i);
            hit = 1;
        }
        _________ (i % 4 == 0) { // 手の弱点
            printf("%d: 手に命中！\\n", i);
            hit = 1;
        }
        _________ (i % 5 == 0) { // 足の弱点
            printf("%d: 足に命中！\\n", i);
            hit = 1;
        }
        if (hit == 0) printf("%d: 攻撃は外れた...\\n", i);
    };printf("黒幕を倒した！\\n");

        `.trim(),
        choices: ["printf","for","if","else if",],
        blanks: [
            { answer: 1 }, // "for"
            { answer: 2 }, // "if"
            { answer: 2 }, // "if"
            { answer: 2 }, // "if"
            { answer: 2 }, // "if"
        ],
        reduceIdx: [3] // 例: "else if"（インデックス3）を削減
    })
const treasureQuiz = new Quizclass({
        question: "暗証番号を総当たりで探すプログラムを完成させよう!",
        code: `
#include <stdio.h>

int main() {
    int code = 0;
    int answer = ????;

    // 総当たりで正しい暗証番号を探す
    _________ ( code != answer ) {
        _________ (code == answer) {
            printf("暗証番号 %d を発見！宝箱が開いた！\\n", code);
        } _________{
            printf("暗証番号 %d は違いました\\n", code);
        }
        code++;
    }
    return 0;
}
        `.trim(),
        choices: ["printf","while","if","else"],
        blanks: [
            { answer: 1 }, // "while"
            { answer: 2 }, // "if"
            { answer: 3 }  // "else"
        ],
        reduceIdx: [0] // 例: "printf"（インデックス0）を削減
    })

const KANBAN = 500;
const KUSA = 501;
const HASI = 503;
const SYUBOUSYA = 506
const TREASURE = 777

// ———— ドラッグ用変数 ————
let dragging   = null;
let dragOrigin = null;

function startTimer() {
  clearInterval(timerId);
  timeLeft = 60;
  if(whoseQuiz == SYUBOUSYA) timeLeft = 60 * 2
  isTimeout = false;
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 0;
      isTimeout = true;
      clearInterval(timerId);
      seTimeout.currentTime = 0; // ←追加
      seTimeout.play();         // ←追加
      drawQuiz();
    } else {
      drawQuiz();
    }
  }, 1000);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  if (typeof text !== "string") {
    console.warn("wrapText: text is not a string", text);
    text = String(text ?? "");
  }

  const words = text.split(' ');
  let line = '', lines = 0;

  for (let w of words) {
    const test = line + w + ' ';
    if (c.measureText(test).width > maxWidth && line) {
      c.fillText(line, x, y);
      line = w + ' ';
      y += lineHeight;
      lines++;
    } else {
      line = test;
    }
  }

  c.fillText(line, x, y);
  return lines + 1;
}
