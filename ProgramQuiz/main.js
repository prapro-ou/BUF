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

// ———— 形判定ヘルパー ————
function isFunctionName(name) {
  return name === 'printf' || name === 'scanf';
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
  const tag      = '_____';
  const tagWidth = c.measureText(tag).width;

  currentQuiz.blanks.forEach((blank, bidx) => {
    for (let i = 0; i < codeLines.length; i++) {
      const pos = codeLines[i].indexOf(tag);
      if (pos === -1) continue;

      // 描画基準座標
      const prefix = rawCodeLines[i].slice(0, pos);
      const px     = codeX + c.measureText(prefix).width;
      const py     = codeYStart + i * 22 - 10;

      // 形状判定は正答の文字列で
      const label = currentQuiz.choices[blank.answer];
      const shape = isFunctionName(label) ? 'oval' : 'rect';

      // 楕円用／矩形用のサイズ
      const radiusX = tagWidth/2 + 6;
      const radiusY = 14;
      const rectW   = tagWidth + 12;
      const rectH   = radiusY * 2;

      // 中心
      const centerX = px + tagWidth/2;
      const centerY = py + radiusY;

      if (userAnswers[bidx] === null) {
        // ■ 回答前：枠線だけ
        c.save();
        c.strokeStyle = '#fff';
        c.lineWidth   = 2;
        if (shape === 'oval') {
          c.beginPath();
          c.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI);
          c.stroke();
        } else {
          c.strokeRect(px-6, py, rectW, rectH);
        }
        c.restore();
      } else {
        // ■ 回答後：背景で隠して文字のみ
        c.save();
        c.fillStyle = '#A0522D';
        if (shape === 'oval') {
          c.beginPath();
          c.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI);
          c.fill();
        } else {
          c.fillRect(px-6, py, rectW, rectH);
        }
        // 文字
        c.fillStyle    = '#fff';
        c.font         = '18px monospace';
        c.textAlign    = 'center';
        c.textBaseline = 'middle';
        c.fillText(currentQuiz.choices[userAnswers[bidx]], centerX, centerY);
        c.restore();
      }

      // ■ クリック判定領域
      blank.rect = {
        x: px-6, y: py,
        w: shape==='oval'? radiusX*2 : rectW,
        h: shape==='oval'? radiusY*2 : rectH,
        cx: centerX, cy: centerY
      };

      // 次の空欄と混ざらないよう置換
      codeLines[i] = codeLines[i].replace(tag, ' '.repeat(tag.length));
      break;
    }
  });

  // — 選択肢描画 —
  c.font         = '22px sans-serif';
  c.textAlign    = 'center';
  c.textBaseline = 'middle';
  if (!currentQuiz.choiceRects) currentQuiz.choiceRects = [];
  currentQuiz.choices.forEach((choice,i) => {
    if (userAnswers.includes(i)) return;
    const cx    = choiceX;
    const cy    = choiceBaseY + i*choiceGap;
    const shape = isFunctionName(choice)? 'oval' : 'rect';
    c.save();
    c.fillStyle   = '#A0522D';
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    if (shape==='oval') {
      c.beginPath();
      c.ellipse(cx, cy, 70, 28, 0, 0, 2*Math.PI);
      c.fill(); c.stroke();
    } else {
      c.fillRect(cx-80, cy-20, 160, 40);
      c.strokeRect(cx-80, cy-20, 160, 40);
    }
    // テキスト
    c.fillStyle = '#fff';
    c.fillText(choice, cx, cy);
    c.restore();
    // 判定領域
    currentQuiz.choiceRects[i] = shape==='oval'
      ? { x: cx-70,  y: cy-28, w:140, h:56,  cx, cy }
      : { x: cx-80,  y: cy-20, w:160, h:40,  cx, cy };
  });

  // — ドラッグ中プレビュー —
  if (dragging) {
    c.save();
    c.beginPath();
    c.ellipse(dragging.x, dragging.y, 70, 28, 0, 0, 2*Math.PI);
    c.fillStyle   = '#66f';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth   = 2;
    c.stroke();
    c.fillStyle   = '#fff';
    c.font        = '22px sans-serif';
    c.textAlign   = 'center';
    c.textBaseline= 'middle';
    c.fillText(currentQuiz.choices[dragging.choiceIdx], dragging.x, dragging.y);
    c.restore();
  }

  // — 答え合わせボタン —
  if (userAnswers.every(a=>a!==null)) {
    c.fillStyle = '#444';
    c.fillRect(choiceX,480,200,48);
    c.fillStyle = 'white';
    c.font       = '24px sans-serif';
    c.fillText('答え合わせ', choiceX+30,512);
  }

  // — やり直しボタン —
  c.fillStyle = '#444';
  c.fillRect(choiceX,540,200,40);
  c.fillStyle = 'white';
  c.font       = '20px sans-serif';
  c.fillText('やり直し', choiceX+60,567);

  // — 結果表示 —
  if (result!==null) {
    c.font      = '28px sans-serif';
    c.fillStyle = result?'lime':'red';
    c.fillText(result?'全問正解！':'間違いがあります', choiceX,80);
  }
}

// — イベント: クリック — 
canvas.addEventListener('click', e=>{
  if (bgm.paused) bgm.play();
  const { left, top } = canvas.getBoundingClientRect();
  const mx = e.clientX-left, my = e.clientY-top;

  // 答え合わせ
  if (userAnswers.every(a=>a!==null)
      && mx>=choiceX && mx<=choiceX+200
      && my>=480     && my<=528) {
    result = currentQuiz.blanks.every((b,i)=>userAnswers[i]===b.answer);
    drawQuiz();
    if (result && quizIndex<quizList.length-1) {
      setTimeout(()=>{
        quizIndex++;
        currentQuiz = quizList[quizIndex];
        userAnswers = Array(currentQuiz.blanks.length).fill(null);
        selectedBlank = null;
        result = null;
        drawQuiz();
      },1200);
    }
    return;
  }

  // やり直し
  if (mx>=choiceX && mx<=choiceX+200
      && my>=540 && my<=580) {
    userAnswers = Array(currentQuiz.blanks.length).fill(null);
    selectedBlank = null;
    result = null;
    drawQuiz();
    return;
  }

  // 穴クリック
  let clicked = null;
  currentQuiz.blanks.forEach((b,i)=>{
    const r=b.rect;
    if (r && mx>=r.x && mx<=r.x+r.w
          && my>=r.y && my<=r.y+r.h) {
      clicked = i;
    }
  });
  if (clicked!==null) {
    selectedBlank = clicked;
    drawQuiz();
    return;
  }

  // 直接選択肢をはめ込む
  if (selectedBlank!==null) {
    currentQuiz.choiceRects.forEach((r,i)=>{
      if (r && mx>=r.x && mx<=r.x+r.w
            && my>=r.y && my<=r.y+r.h
            && !userAnswers.includes(i)) {
        userAnswers[selectedBlank] = i;
        selectedBlank = null;
        drawQuiz();
      }
    });
  }
});

// — イベント: ドラッグ＆ドロップ — 
canvas.addEventListener('mousedown', e=>{
  const { left, top } = canvas.getBoundingClientRect();
  const mx = e.clientX-left, my = e.clientY-top;
  currentQuiz.choiceRects.forEach((r,i)=>{
    if (r && mx>=r.x && mx<=r.x+r.w
          && my>=r.y && my<=r.y+r.h
          && !userAnswers.includes(i)) {
      dragging = {
        choiceIdx: i,
        x: mx, y: my,
        offsetX: mx-r.cx,
        offsetY: my-r.cy
      };
      dragOrigin = { x:r.cx, y:r.cy };
      drawQuiz();
    }
  });
});
canvas.addEventListener('mousemove', e=>{
  if (!dragging) return;
  const { left, top } = canvas.getBoundingClientRect();
  dragging.x = e.clientX-left;
  dragging.y = e.clientY-top;
  drawQuiz();
});
canvas.addEventListener('mouseup', e=>{
  if (!dragging) return;
  const { left, top } = canvas.getBoundingClientRect();
  const mx = e.clientX-left, my = e.clientY-top;
  currentQuiz.blanks.forEach((b,i)=>{
    const r=b.rect;
    if (r && mx>=r.x && mx<=r.x+r.w
          && my>=r.y && my<=r.y+r.h) {
      userAnswers[i] = dragging.choiceIdx;
    }
  });
  dragging = null;
  dragOrigin = null;
  drawQuiz();
});

// — 初回描画 — 
drawQuiz();
