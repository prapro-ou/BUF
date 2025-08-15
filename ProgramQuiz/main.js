// main.js

// ———— Canvas 初期化 ————
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width  = 1024;
canvas.height = 576;

// ———— クイズ状態 ————
let quizIndex     = 0;
let currentQuiz   = quizList[quizIndex];
let selectedBlank = null;
let userAnswers   = Array(currentQuiz.blanks.length).fill(null);
let result        = null;

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

// ———— BGM & 背景 ————
const bgm = new Audio('../sound/BUF_quiz.wav');
bgm.loop   = true;
bgm.volume = 0.5;
bgm.play();

const bgImageKanban    = new Image();
bgImageKanban.src      = '../gazo/scenery2_kanban.png';      // 1問目

const bgImageKusa      = new Image();
bgImageKusa.src        = '../gazo/scenery1_kusa.png';        // 2問目

const bgImageHasi      = new Image();
bgImageHasi.src        = '../gazo/scenery3_hasi.png';        // 3,4問目

const bgImageKuromaku  = new Image();
bgImageKuromaku.src    = '../gazo/scenery4_kuromaku.png';    // 5問目

const bgImageTakarabako= new Image();
bgImageTakarabako.src  = '../gazo/scenery5_takarabako.png';  // 6問目

const bgImage = new Image();
bgImage.src = '../gazo/quiz_wood.png'; // デフォルト

bgImage.onload = () => drawQuiz();

// ———— ドラッグ用変数 ————
let dragging   = null;
let dragOrigin = null;

// ———— テキスト折り返しヘルパー ————
function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '', lines = 0;
  for (let w of words) {
    const test = line + w + ' ';
    if (c.measureText(test).width > maxWidth && line) {
      c.fillText(line, x, y);
      line = w + ' ';
      y   += lineHeight;
      lines++;
    } else {
      line = test;
    }
  }
  c.fillText(line, x, y);
  return lines + 1;
}

let timeLeft = 60;         // 残り秒数
let timerId  = null;       // setInterval用
let isTimeout = false;     // 時間切れフラグ

function startTimer() {
  clearInterval(timerId);
  timeLeft = 60;
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

// ———— メイン描画ルーチン ————
function drawQuiz() {
  // 問題ごとに背景画像を切り替え
  if (quizIndex === 0) {
    if (bgImageKanban.complete) {
      c.drawImage(bgImageKanban, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (quizIndex === 1) {
    if (bgImageKusa.complete) {
      c.drawImage(bgImageKusa, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (quizIndex === 2 || quizIndex === 3) {
    if (bgImageHasi.complete) {
      c.drawImage(bgImageHasi, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (quizIndex === 4) {
    if (bgImageKuromaku.complete) {
      c.drawImage(bgImageKuromaku, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (quizIndex === 5) {
    if (bgImageTakarabako.complete) {
      c.drawImage(bgImageTakarabako, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    if (bgImage.complete) {
      c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      c.fillStyle = '#888'; c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // 問題文の色
  if (quizIndex === 0) {
    c.fillStyle = '#000000'; // 1問目だけ黒色
  } else if (quizIndex === 2 || quizIndex === 3) {
    c.fillStyle = '#000000'; // 3,4問目も黒色
  } else {
    c.fillStyle = 'white';
  }
  c.font         = '24px sans-serif';
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  // 問題文の行数取得
  const qLines = wrapText(
    currentQuiz.question,
    codeX, codeY,
    codeMaxWidth, 28
  );

  // クリッピング範囲を先に定義（4問目以外でも使えるように）
  const clipX = codeX;
  const clipY = codeY + qLines * 28 + 10;
  const clipW = 420;
  const clipH = 450; // 必要に応じて調整

  // プログラム描画エリアのクリッピング（4問目と5問目のみ）
  if (quizIndex === 3 || quizIndex === 4) {
    c.save();
    c.beginPath();
    c.rect(clipX, clipY, clipW, clipH);
    c.clip();
  }

  // コード描画
  if (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) {
    c.fillStyle = '#000000'; // 1,3,4問目は黒色
  } else {
    c.fillStyle = 'white';
  }
  c.font         = "18px monospace";
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  const rawCodeLines = currentQuiz.code.trim().split('\n');
  let codeLines = rawCodeLines.slice();
  const codeYStart = codeY + qLines * 28 + 10 - ((quizIndex === 3 || quizIndex === 4) ? codeScrollY : 0);
  codeLines.forEach((line, i) => {
    // \\n を \n に変換して表示
    const displayLine = line.replace(/\\\\n/g, '\\n');
    c.fillText(displayLine, codeX, codeYStart + i * 22);
  });

  // クリッピング解除
  if (quizIndex === 3 || quizIndex === 4) {
    c.restore();
  }

  // — 空欄（_____）処理 —
  const tag = currentQuiz.code.match(/_{2,}/)[0];
  const tagWidth = c.measureText(tag).width;

  currentQuiz.blanks.forEach((blank, bidx) => {
    for (let i = 0; i < codeLines.length; i++) {
      const pos = codeLines[i].indexOf(tag);
      if (pos === -1) continue;

      // 幅測定は rawCodeLines から
      const prefix = rawCodeLines[i].slice(0, pos);
      const px     = codeX + c.measureText(prefix).width;
      const py     = codeYStart + i * 22 - 10;

      const radiusX = tagWidth / 2;
      const radiusY = 14;
      const centerX = px + tagWidth / 2;
      const centerY = py + radiusY;

      // ★ 4問目と5問目のclip範囲外なら描画しない
      if (
        (quizIndex === 3 || quizIndex === 4) &&
        (centerY < clipY || centerY > clipY + clipH)
      ) {
        // clip範囲外なので何も描画しない
      } else {
        // ■ 回答前のみ枠線を描く
        if (userAnswers[bidx] === null) {
          c.save();
          c.beginPath();
          c.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          // 1,3,4問目は黒色
          c.strokeStyle = (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) ? '#000000' : '#fff';
          c.lineWidth   = 2;
          c.stroke();
          c.restore();
        }

        // ■ 回答済みなら文字だけ中央に描画
        if (userAnswers[bidx] !== null) {
          c.save();
          // 1,3,4問目は黒色
          c.fillStyle = (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) ? '#000000' : '#fff';
          c.font         = '18px monospace';
          c.textAlign    = 'center';
          c.textBaseline = 'middle';
          c.fillText(
            currentQuiz.choices[userAnswers[bidx]],
            centerX, centerY
          );
          c.restore();
        }
      }

      // クリック判定用矩形をセット
      blank.rect = {
        x:  px,
        y:  py,
        w:  tagWidth,
        h:  radiusY * 2,
        cx: centerX,
        cy: centerY
      };

      codeLines[i] = codeLines[i].replace(tag, ' '.repeat(tag.length));
      break;
    }
  });

  // — 選択肢描画 —
  c.font         = '22px sans-serif';
  c.textAlign    = 'center';
  c.textBaseline = 'middle';
  if (!currentQuiz.choiceRects) currentQuiz.choiceRects = [];
  currentQuiz.choices.forEach((choice, i) => {
    const cx = choiceX;
    const cy = choiceBaseY + i * choiceGap;
    c.save();
    c.beginPath();
    c.ellipse(cx, cy, 70, 28, 0, 0, 2 * Math.PI);
    // ★ 5問目だけ濃い赤色、それ以外は茶色
    c.fillStyle = (quizIndex === 4) ? '#8B0000' : '#A0522D';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle = (quizIndex === 0 || quizIndex === 2 || quizIndex === 3) ? '#000000' : '#fff';
    c.fillText(choice, cx, cy);
    c.restore();
    currentQuiz.choiceRects[i] = {
      x:  cx - 70,
      y:  cy - 28,
      w:  140,
      h:  56,
      cx, cy
    };
  });

  // — ドラッグ中プレビュー —
  if (dragging) {
    c.save();
    c.beginPath();
    c.ellipse(dragging.x, dragging.y, 70, 28, 0, 0, 2 * Math.PI);
    c.fillStyle   = '#66f';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle   = '#fff';
    c.font        = '22px sans-serif';
    c.textAlign   = 'center';
    c.textBaseline= 'middle';
    c.fillText(
      currentQuiz.choices[dragging.choiceIdx],
      dragging.x, dragging.y
    );
    c.restore();
  }

  // — 答え合わせボタン —
  if (userAnswers.every(a => a !== null)) {
    c.fillStyle = '#444';
    c.fillRect(buttonX, 470, 200, 48);
    c.fillStyle = 'white';
    c.font       = '24px sans-serif';
    c.textAlign  = 'center';
    c.textBaseline = 'middle';
    c.fillText('答え合わせ', buttonX + 100, 470 + 24);
  }

  // — 時間延長ボタン —
  c.fillStyle = '#444';
  c.fillRect(extendButtonX, extendButtonY, extendButtonW, extendButtonH);
  c.fillStyle = 'white';
  c.font       = '24px sans-serif';
  c.textAlign  = 'center';
  c.textBaseline = 'middle';
  c.fillText('時間延長', extendButtonX + extendButtonW / 2, extendButtonY + extendButtonH / 2);

  // — 選択肢削減ボタン —
  c.fillStyle = '#444';
  c.fillRect(reduceButtonX, reduceButtonY, reduceButtonW, reduceButtonH);
  c.fillStyle = 'white';
  c.font       = '24px sans-serif';
  c.textAlign  = 'center';
  c.textBaseline = 'middle';
  c.fillText('選択肢削減', reduceButtonX + reduceButtonW / 2, reduceButtonY + reduceButtonH / 2);

  // — やり直しボタン —
  c.fillStyle = '#444';
  c.fillRect(buttonX, 524, 200, 48);
  c.fillStyle = 'white';
  c.font       = '24px sans-serif';
  c.textAlign  = 'center';
  c.textBaseline = 'middle';
  c.fillText('やり直し', buttonX + 100, 524 + 24);

  // — 正誤表示 —
  if (result !== null) {
    c.font      = '28px sans-serif';
    c.fillStyle = result ? 'lime' : 'red';
    c.fillText(
      result ? '全問正解！' : '間違いがあります',
      choiceX, 80
    );
  }

  // — タイマー表示 —
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  c.font = '24px sans-serif';
  c.fillStyle = isTimeout
    ? 'red'
    : (quizIndex === 0 ? 'blue' : 'yellow'); // 1問目だけ青色
  c.textAlign = 'right';
  c.fillText(`残り時間: ${min}分${sec}秒`, canvas.width - 40, 40);

  // — 時間切れ表示 —
  if (isTimeout) {
    c.font = '48px sans-serif';
    c.fillStyle = 'red';
    c.textAlign = 'center';
    c.fillText('時間切れ', canvas.width / 2, canvas.height / 2);
    return; // 以降の描画をスキップ
  }
}

// — クリックイベント — 
canvas.addEventListener('click', e => {
  if (bgm.paused) bgm.play();
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;

  // 答え合わせ
  if (
    userAnswers.every(a => a !== null) &&
    mx >= buttonX && mx <= buttonX + 200 &&
    my >= 470    && my <= 518 &&
    !isTimeout // 時間切れ時は答え合わせ不可
  ) {
    result = currentQuiz.blanks.every((b, i) =>
      userAnswers[i] === b.answer
    );
    // 効果音再生
    if (result) {
      seCorrect.currentTime = 0;
      seCorrect.play();
    } else {
      seWrong.currentTime = 0;
      seWrong.play();
    }
    drawQuiz();
    if (result && quizIndex < quizList.length - 1) {
      setTimeout(() => {
        quizIndex++;
        currentQuiz = quizList[quizIndex];
        userAnswers = Array(currentQuiz.blanks.length).fill(null);
        selectedBlank = null;
        result        = null;
        currentQuiz.choiceRects = null;
        startTimer();
        drawQuiz();
      }, 1200);
    }
    return;
  }

  // やり直し
  if (
    mx >= extendButtonX && mx <= extendButtonX + extendButtonW &&
    my >= extendButtonY && my <= extendButtonY + extendButtonH
  ) {
    timeLeft += 30;
    seGauge.currentTime = 0; // ←追加
    seGauge.play();          // ←追加
    drawQuiz();
    return;
  }
});

// — ドラッグ＆ドロップ — 
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  currentQuiz.choiceRects.forEach((r, i) => {
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      seClick.currentTime = 0;
      seClick.play();
      dragging = {
        choiceIdx: i,
        x: mx,
        y: my,
        offsetX: mx - r.cx,
        offsetY: my - r.cy
      };
      dragOrigin = { x: r.cx, y: r.cy };
      drawQuiz();
    }
  });
});

canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  dragging.x = e.clientX - rect.left;
  dragging.y = e.clientY - rect.top;
  drawQuiz();
});

canvas.addEventListener('mouseup', e => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  let set = false;
  currentQuiz.blanks.forEach((b, i) => {
    const r = b.rect;
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      userAnswers[i] = dragging.choiceIdx;
      set = true; // ←追加
    }
  });
  if (set) {                 // ←追加
    seKeyboard2.currentTime = 0;
    seKeyboard2.play();
  }
  dragging   = null;
  dragOrigin = null;
  drawQuiz();
});

// — スクロールイベント —
canvas.addEventListener('wheel', e => {
  // 4問目(3)と5問目(4)だけスクロール有効
  if (quizIndex !== 3 && quizIndex !== 4) {
    codeScrollY = 0;
    return;
  }
  const rawCodeLines = currentQuiz.code.trim().split('\n');
  const visibleLines = 20; // 表示できる行数（調整可）
  const maxScroll = Math.max(0, rawCodeLines.length * 22 - visibleLines * 22);

  codeScrollY += e.deltaY;
  if (codeScrollY < 0) codeScrollY = 0;
  if (codeScrollY > maxScroll) codeScrollY = maxScroll;
  drawQuiz();
  e.preventDefault();
}, { passive: false });

// — 初回描画 — 
drawQuiz();
startTimer();

const seCorrect   = new Audio('../sound/クイズ正解1.mp3');
const seWrong     = new Audio('../sound/クイズ不正解1.mp3');
const seTimeout   = new Audio('../sound/試合終了のゴング.mp3');
const seClick     = new Audio('../sound/クリック.mp3');      // ←追加
const seKeyboard2 = new Audio('../sound/キーボード2.mp3');   // ←追加
const seGauge     = new Audio('../sound/ゲージ回復1.mp3');

let codeScrollY = 0;
