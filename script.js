// ============================================================
// 方案（Day 5 由用户自己写的）：
//   ① 固定一段中文
//   ② 60 秒倒计时自动停，成绩要 WPM
//   ③ 打完之后标出打错的字
// 新知识点：逐字符对比 + 实时着色；老朋友：setInterval 倒计时
// ============================================================

// 功能①：固定的一段中文原文（想换文字只改这里）
const TEXT =
  "代码是写给人看的，只是恰好能在机器上运行。真正的进步不在于某一天做得多，" +
  "而在于每天都做一点点。当你打完这段话的时候，六十秒已经悄悄过去，" +
  "而你全程专注的样子，就是未来最好的样子。别小看每天一个小项目，" +
  "一百天以后，它们会替你说话。";

const TOTAL_SECONDS = 60; // 测试时长（秒）

// ===== 状态 =====
let started = false;    // 测试是否已开始
let finished = false;   // 测试是否已结束
let timeLeft = TOTAL_SECONDS;
let timerId = null;     // 倒计时的身份证（番茄钟同款管理方式）

const $ = (id) => document.getElementById(id);

// 把原文渲染成一堆 span，一开始全部是 pending（灰色）
function renderText() {
  $("text-display").innerHTML = TEXT.split("")
    .map((ch) => `<span class="pending">${ch}</span>`)
    .join("");
}

// 功能②：开始测试（注意：现在是"点按钮就开始倒计时"）
// ← 今天的挑战：改成"敲下第一个键才开始计时"，点按钮只做准备工作
function startTest() {
  if (started && !finished) return; // 防止重复开始
  started = true;
  finished = false;
  timeLeft = TOTAL_SECONDS;
  $("input-area").value = "";
  $("input-area").disabled = false;
  $("input-area").focus(); // 光标直接跳进输入框，省一次点击
  $("start-btn").textContent = "重新开始";
  $("comment").textContent = "";
  renderText();
  updateSpans(0);

  timerId = setInterval(() => {
    timeLeft--;
    $("time-left").textContent = timeLeft;
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

// 功能③：每次输入，逐字对比并给原文上色
function onInput() {
  if (!started || finished) return;
  const typed = $("input-area").value;
  updateSpans(typed.length);
  // 提前打完全文：直接结束，WPM 按实际用时折算
  if (typed.length >= TEXT.length) finishTest();
}

// 给前 typedLen 个字上色：对=绿 错=红，剩下的灰；当前字加光标
function updateSpans(typedLen) {
  const typed = $("input-area").value;
  const spans = $("text-display").children;
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    span.classList.remove("current");
    if (i < typedLen) {
      span.className = typed[i] === TEXT[i] ? "correct" : "wrong";
    } else {
      span.className = "pending";
    }
  }
  if (typedLen < spans.length && !finished) {
    spans[typedLen].classList.add("current"); // 下一个要打的字，闪个小光标
  }
}

// 功能②③收尾：停表、算成绩
function finishTest() {
  finished = true;
  clearInterval(timerId); // 老规矩：和 setInterval 成对
  $("input-area").disabled = true;

  const typed = $("input-area").value;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === TEXT[i]) correct++;
  }
  const usedSeconds = TOTAL_SECONDS - timeLeft; // 提前打完时 < 60
  const wpm = Math.round((correct * 60) / Math.max(usedSeconds, 1)); // 折算成每分钟
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 0;

  $("wpm").textContent = wpm;
  $("accuracy").textContent = accuracy + "%";
  $("wrong").textContent = typed.length - correct;

  // 一句接地气的点评
  let say = "重在参与，先把手感养起来！";
  if (wpm >= 60) say = "🔥 手速惊人，键盘战士就是你！";
  else if (wpm >= 40) say = "💪 超过大多数人了，继续保持！";
  else if (wpm >= 25) say = "👍 及格线以上，每天测一次看它涨。";
  $("comment").textContent = say;
}

// ===== 事件绑定 =====
$("start-btn").addEventListener("click", startTest);
$("input-area").addEventListener("input", onInput);

// 初始渲染
renderText();
$("time-left").textContent = TOTAL_SECONDS;
