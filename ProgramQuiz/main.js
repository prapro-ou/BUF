//htmlのキャンバスを操作するための宣言
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ゲーム画像サイズ
canvas.width = 1024
canvas.height = 576

let currentQuiz = quizList[0];
let selectedBlank = null; // 今選択中の穴番号
let userAnswers = Array(currentQuiz.blanks.length).fill(null); // 各穴の回答
let result = null;

// コード表示の左側位置
const codeX = 40; // 左寄せ
const codeY = 40; // ← 60から40に変更（全体を20px上へ）
const codeMaxWidth = 520;

// 選択肢の右側位置
const choiceX = 600;
// 20pxずつ上げる
const choiceY = [160, 240, 320, 400]; // 180,260,340,420 → 160,240,320,400

function drawQuiz() {
    // 背景をグレーで塗りつぶす
    c.fillStyle = "#888";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // 問題文（上部に表示、長い場合は折り返し）
    c.fillStyle = "white";
    c.font = "24px sans-serif";
    wrapText(currentQuiz.question, codeX, codeY, codeMaxWidth, 28);

    // 穴あきCコード（左側に縦表示）
    c.font = "18px 'monospace'";
    const codeLines = currentQuiz.code.split('\n');
    codeLines.forEach((line, i) => {
        // 各穴をクリック可能な矩形で描画
        let rendered = line;
        currentQuiz.blanks.forEach((blank, bidx) => {
            const blankTag = `_____${blank.idx}`;
            if (rendered.includes(blankTag)) {
                // 選択済みなら選択肢を表示、未選択なら_____表示
                const ans = userAnswers[bidx];
                const display = (ans !== null) ? currentQuiz.blanks[bidx].choices[ans] : blankTag;
                rendered = rendered.replace(blankTag, display);
            }
        });
        c.fillText(rendered, codeX, codeY + 40 + i * 22); // 行間を詰める
    });

    // 穴の位置を計算して矩形を描画（クリック判定用）
    currentQuiz.blanks.forEach((blank, bidx) => {
        // どの行にあるか探す
        codeLines.forEach((line, i) => {
            const blankTag = `_____${blank.idx}`;
            const x = line.indexOf(blankTag);
            if (x !== -1) {
                // 穴の矩形を描画（デバッグ用なら色をつけてもOK）
                const px = codeX + c.measureText(line.slice(0, x)).width;
                const py = codeY + 40 + i * 22 - 16;
                c.strokeStyle = (selectedBlank === bidx) ? "#ff0" : "#fff";
                c.strokeRect(px, py, 80, 20);
                // 穴の位置を保存（クリック判定用）
                blank.rect = {x: px, y: py, w: 80, h: 20};
            }
        });
    });

    // 選択肢の描画（穴を選択中のみ）
    if (selectedBlank !== null) {
        c.font = "24px sans-serif";
        currentQuiz.blanks[selectedBlank].choices.forEach((choice, i) => {
            c.fillStyle = (userAnswers[selectedBlank] === i) ? "#66f" : "#333";
            c.fillRect(choiceX, choiceY[i] - 28, 320, 44);
            c.fillStyle = "white";
            c.fillText(choice, choiceX + 20, choiceY[i]);
        });
    }

    // 答え合わせボタン
    if (userAnswers.every(ans => ans !== null)) {
        c.fillStyle = "#444";
        c.fillRect(choiceX, 480, 200, 48); // 500→480
        c.fillStyle = "white";
        c.font = "24px sans-serif";
        c.fillText("答え合わせ", choiceX + 30, 512); // 532→512
    }

    // 正誤判定
    if (result !== null) {
        c.font = "28px sans-serif";
        c.fillStyle = result ? "lime" : "red";
        c.fillText(result ? "全問正解！" : "間違いがあります", choiceX, 80); // 100→80
    }
}

// 長いテキストを折り返して描画する関数
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = c.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            c.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    c.fillText(line, x, y);
}

// 穴クリック・選択肢クリック・答え合わせクリック
canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // 答え合わせボタン
    if (userAnswers.every(ans => ans !== null) &&
        mx >= choiceX && mx <= choiceX + 200 && my >= 480 && my <= 528) {
        // 判定
        result = currentQuiz.blanks.every((blank, i) => userAnswers[i] === blank.answer);
        drawQuiz();
        return;
    }

    // 選択肢クリック
    if (selectedBlank !== null) {
        currentQuiz.blanks[selectedBlank].choices.forEach((_, i) => {
            if (
                mx >= choiceX && mx <= choiceX + 320 &&
                my >= choiceY[i] - 28 && my <= choiceY[i] + 16
            ) {
                userAnswers[selectedBlank] = i;
                selectedBlank = null;
                drawQuiz();
            }
        });
        return;
    }

    // 穴クリック
    currentQuiz.blanks.forEach((blank, bidx) => {
        if (blank.rect &&
            mx >= blank.rect.x && mx <= blank.rect.x + blank.rect.w &&
            my >= blank.rect.y && my <= blank.rect.y + blank.rect.h
        ) {
            selectedBlank = bidx;
            drawQuiz();
        }
    });
});

drawQuiz();