const commonChoices = ["a", "pi", "c", "s", "b"];

const quizList = [
    new Quiz({
        question: "正しい選択肢を選んで，看板を完成させよう！",
        code: `
整数型：distance
文字列型：where
distance ← 3
where ← "green island"

_________(_________まで_________キロ)
    `.trim(),
    // 選択肢の配列（インデックス 0～3）
    choices: ["printf","scanf","distance","where"],
  // idx プロパティをなくして answer のみ
    blanks: [
    { answer: 0 },  // 1つめの「_____」の正解は choices[0]（"printf"）
    { answer: 3 },  // 2つめの「_____」は choices[3]（"where"）
    { answer: 2 }   // 3つめの「_____」は choices[2]（"distance"）
    ]
  }),
    new Quiz({
        question: "2問目：printfで整数bを表示する正しい変数名を選んでください。",
        code: `
#include <stdio.h>

int main(void) {
    int b = 20;
    // Q1: 整数 b を表示
    printf("変数 b の値：%d\\n", _____1);
    return 0;
}
        `,
        choices: commonChoices,
        blanks: [
            { idx: 1, answer: 4 } // "b"
        ]
    })
];