alert("app.js loaded!");
console.log("app.js loaded!");
let words = [];
let currentWord = null;
let currentSense = null;
let mode = "A";

// 単語データ読み込み
fetch("data_words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
  });

// モード開始
function startMode(m) {
  mode = m;
  document.getElementById("modeSelect").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  nextQuestion();
}

// メニューに戻る
function backToMenu() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("modeSelect").classList.remove("hidden");
}

// 次の問題
function nextQuestion() {
  document.getElementById("result").textContent = "";
  document.getElementById("detail").classList.add("hidden");
  document.getElementById("answer").value = "";

  currentWord = words[Math.floor(Math.random() * words.length)];

  // A：英→日
  if (mode === "A") {
    document.getElementById("question").textContent = currentWord.headword;
    currentSense = null;
  }

  // B：日→英（品詞込みで1義を出す）
  if (mode === "B") {
    currentSense =
      currentWord.senses[Math.floor(Math.random() * currentWord.senses.length)];
    document.getElementById("question").textContent =
      `${currentSense.meanings[0]}（→ 英語）`;
  }

  // C：核→英（簡易：説明文を出す）
  if (mode === "C") {
    document.getElementById("question").textContent =
      "（核となるイメージ）→ 英語";
    currentSense = null;
  }
}

// 解答処理
function submitAnswer() {
  const input = document.getElementById("answer").value.trim();
  if (!input) return;

  let ok = false;

  // A：英→日（意味一致ならOK）
  if (mode === "A") {
    ok = currentWord.senses.some(s =>
      s.meanings.includes(input)
    );
  }

  // B：日→英（基本形のみ）
  if (mode === "B") {
    ok = input.toLowerCase() === currentWord.headword;
  }

  // C：核→英（今は headword のみ）
  if (mode === "C") {
    ok = input.toLowerCase() === currentWord.headword;
  }

  document.getElementById("result").textContent =
    ok ? "○ 正解" : "× 不正解";

  showDetail(currentWord);

  setTimeout(nextQuestion, 2000);
}

// 詳細表示
function showDetail(word) {
  const d = document.getElementById("detail");
  let html = `<strong>${word.headword}</strong><br>`;

  word.senses.forEach(s => {
    html += `${s.pos_ja}：${s.meanings.join("、")}<br>`;
  });

  d.innerHTML = html;
  d.classList.remove("hidden");
}

// Enterキー対応
document.addEventListener("keydown", e => {
  if (e.key === "Enter") submitAnswer();
});
