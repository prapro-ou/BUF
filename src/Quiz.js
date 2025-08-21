function Quiz() {
  // クイズ状態を開始するだけ
  quizIndex = 0;
  currentQuiz = quizList[quizIndex];
  userAnswers = Array(currentQuiz.blanks.length).fill(null);
  selectedBlank = null;
  result = null;
  currentQuiz.choiceRects = null;
  startTimer();
  isQuizActive = true; // ← クイズ中フラグ
  return null; // 判定は後で
}
