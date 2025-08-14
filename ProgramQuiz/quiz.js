class Quiz {
    constructor({question, code, choices, answer, blanks}) {
        this.question = question; // 問題文
        this.code = code;         // 穴あきCコード（文字列、_____で穴あき）
        this.choices = choices;   // 選択肢（配列）
        this.answer = answer;     // 正解インデックス
        this.blanks = blanks;     // 穴の説明（配列）
    }
}