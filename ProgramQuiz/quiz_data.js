const quizList = [
    new Quiz({
        question: "C言語の穴埋め問題です。各_____をクリックして正しい選択肢を選んでください。",
        code: `
#include <stdio.h>

int main(void) {
    int a = 10;
    double pi = 3.14;
    char c = 'Z';
    char s[] = "XYZ";

    // Q1: Hello を表示
    printf("Hello, printf チュートリアル!\\n");

    // Q2: 整数 a を表示
    printf("変数 a の値：%d\\n", _____1);

    // Q3: 小数 pi を小数点以下2桁で表示
    printf("変数 pi の値：%.2f\\n", _____2);

    // Q4: 文字 c と文字列 s を表示
    printf("文字：%c, 文字列：%s\\n", _____3, _____4);

    return 0;
}
        `,
        blanks: [
            { idx: 1, choices: ["a", "pi", "c"], answer: 0 },
            { idx: 2, choices: ["a", "pi", "s"], answer: 1 },
            { idx: 3, choices: ["c", "s", "a"], answer: 0 },
            { idx: 4, choices: ["c", "s", "pi"], answer: 1 }
        ]
    }),
    // 2問目（例題）
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
        blanks: [
            { idx: 1, choices: ["b", "a", "c"], answer: 0 }
        ]
    })
];