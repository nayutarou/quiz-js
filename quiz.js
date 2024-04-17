"use strict";

//--------------
//  基本データ
//--------------

// 地理のクイズデータ
const data = [
  {
    question: "日本で一番面積の大きい都道府県は？",
    answers: ["北海道", "東京都", "沖縄県", "福岡県"],
    correct: "北海道"
  },
  {
    question: "日本で一番人口の多い都道府県は？",
    answers: ["北海道", "東京都", "沖縄県", "福岡県"],
    correct: "東京都"
  },
  {
    question: "日本で一番人口密度の高い都道府県は？",
    answers: ["北海道", "東京都", "沖縄県", "福岡県"],
    correct: "東京都"
  }
];

// 出題する問題数
const QUESTION_LENGTH = 3;
// 回答時間(ms)
const ANSWER_TIME_MS = 10000;
// インターバル時間(ms)
const INTERVAL_TIME_MS = 10;
// 回答の開始時間
let startTime = 0;
// インターバルID
let intervalId = null;
// 回答中の経過時間
let elapsedTime = 0;
// 出題する問題データ
// let questions = data.slice(0, QUESTION_LENGTH);
let questions = getRandomQuestions();
// 出題する問題のインデックス
let questionIndex = 0;
// 正解数
let correctCount = 0;


//------------
//  要素一覧
//------------

// スタートページのid取得
const startPage = document.getElementById("startPage");
// 選択肢ページのid取得
const questionPage = document.getElementById("questionPage");
// 結果ページのid取得
const reusltPage = document.getElementById("resultPage");
// スタートページのスタートボタンのid取得
const startButton = document.getElementById("startButton");
// 出題する問題の数字のid取得
const questionNumber = document.getElementById("questionNumber");
// 出題する問題の問題文のid取得
const questionText = document.getElementById("questionText");
// 出題する問題のページとそのボタンidの取得
const optionButtons = document.querySelectorAll("#questionPage button")
// プログレスバーの取得
const questionProgress = document.getElementById("questionProgress");

const resultMessage = document.getElementById("resultMessage");

// button取得
const backButton = document.getElementById("backButton");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");
console.log(dialog, questionResult, nextButton);





//--------
//  処理
//--------

startButton.addEventListener("click", clickStartButton);

optionButtons.forEach((button) => {
  button.addEventListener("click", clickOptionButton);
});
nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click", clickBackButton);

//----------- 
//  関数一覧
//-----------

function questionTimeOver(){
  questionResult.innerText = "✖️";
  if(isQuestionEnd()){
    nextButton.innerText = "結果を見る";
  }else{
    nextButton.innerText = "次の問題へ";
  }
  // ダイアログを表示する
  dialog.showModal();
}

function startProgress() {
  // 開始時間(タイムスタンプ)を取得する
  startTime = Date.now();
  // インターバルを開始する
  intervalId = setInterval(() => {
    // 現在の時刻(タイムスタンプ)を取得する
    const currentTime = Date.now();
    // 経過時間を計算する
    const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;
    //progressバーに経過時間を超えた場合、インターバルを停止する  
    questionProgress.value = progress;
    if (startTime + ANSWER_TIME_MS <= currentTime) {
      stopProgress();
      questionTimeOver();
      return;
    }
  }, INTERVAL_TIME_MS)


  // intervalId = setInterval(() => {
  //   // 経過時間を計算する
  //   const progress = (elapsedTime / ANSWER_TIME_MS) * 100;
  //   //progressバーに経過時間を超えた場合、インターバルを停止する  
  //   questionProgress.value = progress;
  //   if (ANSWER_TIME_MS <= elapsedTime) {
  //     stopProgress();
  //     questionTimeOver();
  //     return;
  //   }
  //   // 経過時間を更新(加算)する
  //   elapsedTime += INTERVAL_TIME_MS;
  // }, INTERVAL_TIME_MS)
}
// function stopProgress() {
//   // インターバルを停止する
//   if (intervalId !== null) {
//     clearInterval(intervalId);
//     intervalId = null;
//   }
//     intervalId = setInterval(() => {
//     // 経過時間を計算する
//     const progress = (elapsedTime / ANSWER_TIME_MS) * 100;
//     //progressバーに経過時間を超えた場合、インターバルを停止する  
//     questionProgress.value = progress;
//     if (ANSWER_TIME_MS <= elapsedTime) {
//       stopProgress();
//       questionTimeOver();
//       return;
//     }
//     // 経過時間を更新(加算)する
//     elapsedTime += INTERVAL_TIME_MS;
//   }, INTERVAL_TIME_MS)
// }
function stopProgress() {
  // インターバルを停止する
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}


function reset() {
  //出題する問題をランダムに取得する
  questions = getRandomQuestions();
  //出題する問題のインデックスを初期化する
  questionIndex = 0;
  //正解数を初期化する
  correctCount = 0;
  // インターバルIDを初期化する
  intervalId = null;
  // 回答中の経過時間を初期化する
  elapsedTime = 0;
  // 開始時間を初期化する
  startTime = null;
  //ボタンを有効化する
  for (let i = 0; i < optionButtons.length; i++) {
    optionButtons[i].removeAttribute("disabled");
  }
}

function isQuestionEnd() {
  //問題が最後かどうか判定する
  return questionIndex + 1 === QUESTION_LENGTH;
}


function getRandomQuestions() {
  //出題する問題のインデックスリスト
  const questionIndexList = [];
  while (questionIndexList.length !== QUESTION_LENGTH) {
    //出題する問題のインデックスをランダムに生成する
    const index = Math.floor(Math.random() * data.length);
    //インデックスリストに含まれていない場合、インデックスリストに追加する
    if (!questionIndexList.includes(index)) {
      questionIndexList.push(index);
    }
  }
  //出題する問題リストを取得する
  const questionList = questionIndexList.map((index) => data[index]);
  return questionList;
}

function setResult() {
  //正解率を計算する
  const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
  //正解率を表示する
  resultMessage.innerText = `正解率: ${accuracy}%`;
}

function setQuestion() {
  // 問題を取得する
  const question = questions[questionIndex];
  // 問題番号を取得する
  questionNumber.innerText = `第${questionIndex + 1}問`;
  // 問題文を表示する
  questionText.innerText = question.question;
  // 選択肢を表示する
  for (let i = 0; i < optionButtons.length; i++) {
    optionButtons[i].innerText = question.answers[i];
  }
}


//--------------------------
//  イベント関連の関数一覧
//--------------------------

function clickOptionButton(event) {
  // 回答中の経過時間を停止する
  stopProgress();
  // すべての選択肢のボタンを無効化する
  for (let i = 0; i < optionButtons.length; i++) {
    optionButtons[i].disabled = true;
  }

  // 選択肢のテキストを取得する
  const optionText = event.target.innerText;
  // 正解のテキストを取得する
  const correctText = questions[questionIndex].correct;

  // 正解かどうかを判定する
  if (optionText === correctText) {
    correctCount++;
    questionResult.innerText = "⭕️";
  } else {
    questionResult.innerText = "✖️";
  }

  // 最後の問題かどうかを判定する
  if (isQuestionEnd()) {
    nextButton.innerText = "結果を見る";
  } else {
    nextButton.innerText = "次の問題へ";
  }

  // ダイアログを表示する
  dialog.showModal();
}

function clickStartButton() {
  //クイズをリセットする
  reset();
  //問題画面に問題を設定する
  setQuestion();
  // 回答の計測を開始する
  startProgress();
  // スタート画面を非表示にする
  startPage.classList.add("hidden");
  // 選択画面を表示する
  questionPage.classList.remove("hidden");
  // 結果画面を非表示にする
  reusltPage.classList.add("hidden");
}

function clickNextButton() {
  if (isQuestionEnd()) {
    // クイズの結果画面に結果を設定する
    setResult();
    // ダイアログを閉じる
    dialog.close();
    // スタート画面を非表示にする
    startPage.classList.add("hidden");
    // クイズの問題画面を非表示する
    questionPage.classList.add("hidden");
    // クイズの結果画面を表示する
    resultPage.classList.remove("hidden");
  } else {
    questionIndex++;
    // クイズの問題画面に問題を設定する
    setQuestion();
    // インターバルIDを初期化する
    intervalId = null;
    // 回答中の経過時間を初期化する
    elapsedTime = 0;
    // すべての選択肢のボタンを有効化する
    for (let i = 0; i < optionButtons.length; i++) {
      optionButtons[i].removeAttribute("disabled");
    }
    // ダイアログを閉じる
    dialog.close();
    // 回答の計測を開始する
    startProgress();
  }
}

function clickBackButton() {
  // スタート画面を表示する
  startPage.classList.remove("hidden");
  // 問題画面を非表示する
  questionPage.classList.add("hidden");
  //結果画面を表示する
  reusltPage.classList.add("hidden");
}