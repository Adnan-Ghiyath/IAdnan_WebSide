/* ============================================================
         ✅ Code Overview (Age Calculator)
         ============================================================
         🔹 Purpose        → Calculate exact age (years, months, days)
         🔹 Layout         → Left: Input | Right: Results
         🔹 Use Cases      → Learners, forms, profile pages
         🔹 Key Properties → Real calendar math, validation, next birthday
      ============================================================ */

/* ============================================================
         ✅ 1) Grab Elements (DOM references)
         ============================================================ */

// ✅ Input
const birthDateInput = document.getElementById("birthDate");

// ✅ Buttons
const btnCalc = document.getElementById("btnCalc");
const btnToday = document.getElementById("btnToday");
const btnClear = document.getElementById("btnClear");

// ✅ Output numbers
const outYears = document.getElementById("outYears");
const outMonths = document.getElementById("outMonths");
const outDays = document.getElementById("outDays");

// ✅ Output text lines
const nextBirthdayLine = document.getElementById("nextBirthdayLine");
const extraLine = document.getElementById("extraLine");

// ✅ Header/status chips
const todayChip = document.getElementById("todayChip");
const statusChip = document.getElementById("statusChip");

// ✅ Message box (neutral/success/error)
const msgBox = document.getElementById("msgBox");

/* ============================================================
         ✅ 2) Helper Functions (small reusable functions)
         ============================================================ */

/**
 * ✅ formatDateForChip(date)
 * Converts a Date object into a short readable string like:
 * "Mon, Dec 22, 2025"
 */
function formatDateForChip(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * ✅ stripTime(date)
 * We want a clean "date only" comparison.
 * This returns a new Date with time set to 00:00:00
 */
function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * ✅ daysInMonth(year, monthIndex)
 * monthIndex: 0 = Jan, 11 = Dec
 * Trick: new Date(year, month+1, 0) gives last day of that month.
 */
function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * ✅ showMessage(type, text)
 * type: "good" | "bad" | "neutral"
 * Updates message UI and applies correct color style.
 */
function showMessage(type, text) {
  msgBox.classList.remove("good", "bad");
  if (type === "good") msgBox.classList.add("good");
  if (type === "bad") msgBox.classList.add("bad");
  msgBox.textContent = text;
}

/**
 * ✅ setStatus(text)
 * Updates the small chip in the Results card header.
 */
function setStatus(text) {
  statusChip.textContent = text;
}

/**
 * ✅ resetOutputs()
 * Clears results UI back to placeholders.
 */
function resetOutputs() {
  outYears.textContent = "—";
  outMonths.textContent = "—";
  outDays.textContent = "—";
  nextBirthdayLine.textContent = "Next birthday: —";
  extraLine.textContent = "Extra info: —";
  setStatus("Waiting…");
}

/* ============================================================
         ✅ 3) Core Age Calculation
         ============================================================ */

/**
 * ✅ calculateExactAge(birthDate, today)
 * Returns:
 *   { years, months, days }
 *
 * Why not milliseconds only?
 * 🔹 Months have different lengths.
 * 🔹 Leap years exist.
 *
 * Strategy:
 * 🔹 Compare year/month/day parts
 * 🔹 If day is negative -> borrow days from previous month
 * 🔹 If month is negative -> borrow months from previous year
 */
function calculateExactAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // ✅ If days are negative, we "borrow" days from the previous month
  if (days < 0) {
    // Previous month relative to "today"
    const prevMonthIndex = (today.getMonth() - 1 + 12) % 12;

    // If today is January, previous month belongs to last year
    const prevMonthYear =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

    // Number of days in that previous month
    const prevMonthDays = daysInMonth(prevMonthYear, prevMonthIndex);

    // Borrow days from the previous month, and reduce months by 1
    days += prevMonthDays;
    months -= 1;
  }

  // ✅ If months are negative, borrow from year
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

/**
 * ✅ daysUntilNextBirthday(birthDate, today)
 * Returns how many days remain until the next birthday.
 *
 * Steps:
 * 🔹 Build birthday in this year
 * 🔹 If it already passed -> move to next year
 * 🔹 Compute difference in whole days
 */
function daysUntilNextBirthday(birthDate, today) {
  const thisYear = today.getFullYear();

  // Candidate: birthday date in the current year
  let next = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());

  // If birthday already happened this year, switch to next year
  if (stripTime(next) < stripTime(today)) {
    next = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  // ✅ Convert milliseconds to full days
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = stripTime(next) - stripTime(today);
  const diffDays = Math.round(diffMs / msPerDay);

  return { nextBirthdayDate: next, daysLeft: diffDays };
}

/* ============================================================
         ✅ 4) UI Events (buttons)
         ============================================================ */

// ✅ Show today's date in the header chip
const now = new Date();
todayChip.textContent = `Today: ${formatDateForChip(now)}`;

function transformation() {
  // 1️⃣ Read the input value (string like "2020-05-20")
  const birthValue = birthDateInput.value;

  // 2️⃣ Validate empty input
  if (!birthValue) {
    showMessage("bad", "❌ Please select your birth date first.");
    resetOutputs();
    return;
  }

  // 3️⃣ Convert "YYYY-MM-DD" safely to Date (avoid timezone surprises)
  const [y, m, d] = birthValue.split("-").map(Number);
  const birthDate = new Date(y, m - 1, d);

  // 4️⃣ Get today's date only (no time)
  const today = stripTime(new Date());

  // 5️⃣ Validate future dates
  if (stripTime(birthDate) > today) {
    showMessage("bad", "❌ Birth date cannot be in the future.");
    resetOutputs();
    return;
  }

  // 6️⃣ Validate very old years (simple demo rule)
  if (y < 1900) {
    showMessage("bad", "❌ Please enter a valid year (1900 or later).");
    resetOutputs();
    return;
  }

  // ✅ Calculate exact age parts
  const age = calculateExactAge(birthDate, today);

  // ✅ Update the UI with the results
  outYears.textContent = age.years;
  outMonths.textContent = age.months;
  outDays.textContent = age.days;

  // ✅ Next birthday countdown
  const { nextBirthdayDate, daysLeft } = daysUntilNextBirthday(
    birthDate,
    today,
  );

  nextBirthdayLine.textContent = `Next birthday: ${formatDateForChip(
    nextBirthdayDate,
  )} (in ${daysLeft} day${daysLeft === 1 ? "" : "s"})`;

  // ✅ Extra info: total days lived (approx using date difference)
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((today - stripTime(birthDate)) / msPerDay);

  extraLine.textContent = `Extra info: You have lived about ${totalDays.toLocaleString()} days.`;

  // ✅ Success feedback
  showMessage("good", "✅ Age calculated successfully.");
  setStatus("Calculated ✅");
}
window.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();

    if (birthDateInput.value === "") {
      alert("Pleas Enter Your Age First.❌");
    } else {
      transformation(); // 🔥 كأنك ضغطت على الزر
    }
  }
});
// ✅ Calculate Age
btnCalc.addEventListener("click", transformation);

// ✅ Use Today (Demo)
// Sets birth date = today => result becomes 0 years, 0 months, 0 days
btnToday.addEventListener("click", () => {
  const t = new Date();

  // Convert today's date to "YYYY-MM-DD" (required by input[type="date"])
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");

  birthDateInput.value = `${yyyy}-${mm}-${dd}`;

  showMessage(
    "neutral",
    "📌 Birth date set to today (demo). Now click Calculate.",
  );
  setStatus("Ready…");
});

// ✅ Clear everything
btnClear.addEventListener("click", () => {
  birthDateInput.value = "";
  resetOutputs();
  showMessage("neutral", "Tip: Choose a birth date and press “Calculate Age”.");
});

// ✅ Bonus UX: when the user changes the date, show "Ready…"
birthDateInput.addEventListener("change", () => {
  setStatus("Ready…");
  showMessage("neutral", "📌 Date selected. Click “Calculate Age”.");
});
