const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const TOTAL = 10;
let questions = [], idx = 0, score = 0;

function makeQuestions() {
    return shuffle(products).slice(0, TOTAL).map(p => {
        const others = shuffle(products.filter(o => o.id !== p.id)).slice(0, 3);
        if (Math.random() < 0.5) {
            return { text: "Which brain region is responsible for: " + p.func + "?",
                     answer: p.name, options: shuffle([p, ...others]).map(o => o.name) };
        }
        return { text: "What is the main function of the " + p.name + "?",
                 answer: p.func, options: shuffle([p, ...others]).map(o => o.func) };
    });
}

function startQuiz() { questions = makeQuestions(); idx = 0; score = 0; showQuestion(); }

function showQuestion() {
    const q = questions[idx];
    document.getElementById("quiz").innerHTML =
        `<div class="quiz-meta">Question ${idx + 1} of ${questions.length}</div>
         <div class="quiz-bar"><span style="width:${(idx / questions.length) * 100}%"></span></div>
         <h2 class="quiz-q">${q.text}</h2>
         <div id="opts">${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("")}</div>
         <div class="text-right" id="next-box"></div>`;
    document.querySelectorAll(".quiz-opt").forEach(b => b.addEventListener("click", () => answer(b)));
}

function answer(btn) {
    const q = questions[idx];
    const ok = btn.textContent === q.answer;
    if (ok) score++;
    document.querySelectorAll(".quiz-opt").forEach(b => {
        b.disabled = true;
        if (b.textContent === q.answer) b.classList.add("correct");
    });
    if (!ok) btn.classList.add("wrong");
    const last = idx === questions.length - 1;
    document.getElementById("next-box").innerHTML =
        `<button class="pill pill-navy" id="next-btn">${last ? "See Result" : "Next"} <i class="fa fa-long-arrow-right"></i></button>`;
    document.getElementById("next-btn").addEventListener("click", () => { idx++; last ? showResult() : showQuestion(); });
}

function showResult() {
    const msg = score >= 9 ? "Outstanding neuroanatomist!" : score >= 6 ? "Well done, keep studying!" : "Good start - review the atlas and try again.";
    document.getElementById("quiz").innerHTML =
        `<div class="text-center">
            <div class="quiz-meta">Your result</div>
            <div class="quiz-score">${score} / ${questions.length}</div>
            <p class="mb-4">${msg}</p>
            <button class="pill pill-navy mr-2" onclick="startQuiz()">Try Again</button>
            <a class="pill pill-gold" href="anatomy.html">Open the Atlas</a>
         </div>`;
}
startQuiz();
