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
const choiceX      = 750;
const choiceBaseY  = 120;
const choiceGap    = 60;

// ———— BGM & 背景 ————
const bgm = new Audio('../sound/BUF_opening_final_demo.wav');
bgm.loop   = true;
bgm.volume = 0.5;
bgm.play();

const bgImage = new Image();
bgImage.src = '../gazo/quiz_wood.png';
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

// ———— メイン描画ルーチン ————
function drawQuiz() {
  // 背景
  if (bgImage.complete) {
    c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    c.fillStyle = '#888';
    c.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 問題文
  c.fillStyle    = 'white';
  c.font         = '24px sans-serif';
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  const qLines = wrapText(
    currentQuiz.question,
    codeX, codeY,
    codeMaxWidth, 28
  );

  // コード描画
  c.font         = "18px monospace";
  c.fillStyle    = 'white';
  c.textAlign    = 'left';
  c.textBaseline = 'top';
  const rawCodeLines = currentQuiz.code.trim().split('\n');
  let codeLines = rawCodeLines.slice();
  const codeYStart = codeY + qLines * 28 + 10;
  codeLines.forEach((line, i) => {
    c.fillText(line, codeX, codeYStart + i * 22);
  });

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
      const centerY = py + radiusY;  // ← 修正：楕円の縦半径を使って中央に

      // ■ 回答前のみ枠線を描く
      if (userAnswers[bidx] === null) {
        c.save();
        c.beginPath();
        c.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        c.strokeStyle = '#fff';
        c.lineWidth   = 2;
        c.stroke();
        c.restore();
      }

      // ■ 回答済みなら文字だけ中央に描画
      if (userAnswers[bidx] !== null) {
        c.save();
        c.fillStyle    = '#fff';
        c.font         = '18px monospace';
        c.textAlign    = 'center';
        c.textBaseline = 'middle';   // ← 確実に中央揃え
        c.fillText(
          currentQuiz.choices[userAnswers[bidx]],
          centerX, centerY
        );
        c.restore();
      }

      // ■ クリック判定用矩形をセット
      blank.rect = {
        x:  px,
        y:  py,
        w:  tagWidth,
        h:  radiusY * 2,
        cx: centerX,
        cy: centerY
      };

      // ■ 次の空欄検索と混ざらないよう置換
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
    if (userAnswers.includes(i)) return;
    const cx = choiceX;
    const cy = choiceBaseY + i * choiceGap;
    c.save();
    c.beginPath();
    c.ellipse(cx, cy, 70, 28, 0, 0, 2 * Math.PI);
    c.fillStyle   = '#A0522D';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle = '#fff';
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
    c.fillRect(choiceX, 480, 200, 48);
    c.fillStyle = 'white';
    c.font       = '24px sans-serif';
    c.fillText('答え合わせ', choiceX + 30, 512);
  }

  // — やり直しボタン —
  c.fillStyle = '#444';
  c.fillRect(choiceX, 540, 200, 40);
  c.fillStyle = 'white';
  c.font       = '20px sans-serif';
  c.fillText('やり直し', choiceX + 60, 567);

  // — 正誤表示 —
  if (result !== null) {
    c.font      = '28px sans-serif';
    c.fillStyle = result ? 'lime' : 'red';
    c.fillText(
      result ? '全問正解！' : '間違いがあります',
      choiceX, 80
    );
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
    mx >= choiceX && mx <= choiceX + 200 &&
    my >= 480    && my <= 528
  ) {
    result = currentQuiz.blanks.every((b, i) =>
      userAnswers[i] === b.answer
    );
    drawQuiz();
    if (result && quizIndex < quizList.length - 1) {
      setTimeout(() => {
        quizIndex++;
        currentQuiz = quizList[quizIndex];
        userAnswers = Array(currentQuiz.blanks.length).fill(null);
        selectedBlank = null;
        result        = null;
        drawQuiz();
      }, 1200);
    }
    return;
  }

  // やり直し
  if (
    mx >= choiceX && mx <= choiceX + 200 &&
    my >= 540    && my <= 580
  ) {
    userAnswers   = Array(currentQuiz.blanks.length).fill(null);
    selectedBlank = null;
    result        = null;
    drawQuiz();
    return;
  }

  // 穴クリック
  let clicked = null;
  currentQuiz.blanks.forEach((b, i) => {
    const r = b.rect;
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      clicked = i;
    }
  });
  if (clicked !== null) {
    selectedBlank = clicked;
    drawQuiz();
    return;
  }

  // 選択肢クリックで直接はめ込む
  if (selectedBlank !== null) {
    currentQuiz.choiceRects.forEach((r, i) => {
      if (
        r && mx >= r.x && mx <= r.x + r.w &&
        my >= r.y && my <= r.y + r.h &&
        !userAnswers.includes(i)
      ) {
        userAnswers[selectedBlank] = i;
        selectedBlank = null;
        drawQuiz();
      }
    });
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
      my >= r.y && my <= r.y + r.h &&
      !userAnswers.includes(i)
    ) {
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
  currentQuiz.blanks.forEach((b, i) => {
    const r = b.rect;
    if (
      r && mx >= r.x && mx <= r.x + r.w &&
      my >= r.y && my <= r.y + r.h
    ) {
      userAnswers[i] = dragging.choiceIdx;
    }
  });
  dragging   = null;
  dragOrigin = null;
  drawQuiz();
});

// — 初回描画 — 
drawQuiz();
