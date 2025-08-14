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
        question: "2問目:草を5本刈るプログラムを完成させよう!",
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
        ]
    }),
    new Quiz({
        question: "3問目:橋の状態を確認するプログラムを完成させよう!",
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
        ]
    }),
    new Quiz({
        question: "4問目:材料の数を数えるプログラムを完成させよう!",
        code: `
#include <stdio.h>

int main() {
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
}
        `.trim(),
        choices: ["printf","for","if","else if",],
        blanks: [
            { answer: 1 }, // "for"
            { answer: 2 }, // "if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
            { answer: 3 }, // "else if"
        ]
    }),
    new Quiz({
        question: "5問目:暗証番号を総当たりで探すプログラムを完成させよう!",
        code: `
#include <stdio.h>

int main() {
    int code = 0;
    int answer = 3482;

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
        ]
    })
];