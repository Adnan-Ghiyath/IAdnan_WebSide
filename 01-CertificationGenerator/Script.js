const elName = document.getElementById("studentName");
const elCourse = document.getElementById("courseName");
const elInstructor = document.getElementById("instructorName");
const elSignatureFile = document.getElementById("signatureFile");
const ellogoFile = document.getElementById("logoFile");
const elSealFile = document.getElementById("SealFile");
const elIssued = document.getElementById("issuedDate");
const elSerial = document.getElementById("serial");
const elOpen_Close = document.getElementById("Option_Open");

/* =========================================================
         ✅ 2) DOM References (Certificate placeholders)
         ---------------------------------------------------------
         These are the places inside the certificate preview
         where we inject text values.
         ========================================================= */
const certName = document.getElementById("certName");
const certCourse = document.getElementById("certCourse");
const certInstructor = document.getElementById("certInstructor");
const certIssued = document.getElementById("certIssued");
const certSerial = document.getElementById("certSerial");
const certSignatureImg = document.getElementById("certSignatureImg");
const certLogoImg = document.getElementById("certLogoImg");
const certSealImg = document.getElementById("certSealImg");

/* =========================================================
         ✅ 3) DOM References (Validation rows)
         ---------------------------------------------------------
         Each row is a wrapper around input + error text.
         We add/remove the class "invalid" to show red border + error.
         ========================================================= */
const rowName = document.getElementById("rowName");
const rowCourse = document.getElementById("rowCourse");
const rowInstructor = document.getElementById("rowInstructor");
const rowSignature = document.getElementById("rowSignature");
const rowLogo = document.getElementById("rowLogo");
const rowSeal = document.getElementById("rowSeal");
const rowIssued = document.getElementById("rowIssued");
const rowSerial = document.getElementById("rowSerial");

/* =========================================================
         ✅ 4) DOM References (Buttons / Status)
         ========================================================= */
const btnPrint = document.getElementById("btnPrint");
const btnReset = document.getElementById("btnReset");
const btnFillDemo = document.getElementById("btnFillDemo");
const statusLine = document.getElementById("statusLine");
const validBadge = document.getElementById("validBadge");
const SeeMore = document.getElementById("Option");

/* =========================================================
         ✅ 5) Signature Preview Memory Management
         ---------------------------------------------------------
         When we load a local image file into <img>, we use:
           URL.createObjectURL(file)
         This creates a temporary URL.
         We must call:
           URL.revokeObjectURL(oldUrl)
         to avoid memory leaks when user uploads multiple times.
         ========================================================= */
let signatureObjectUrl = null;
let LogotUrl = null;
let SealUrl = null;

/* =========================================================
         ✅ 6) color chancer         ---------------------------------------------------------
         ======================================================== */

/* =========================================================
         ✅ Helper: Format date (YYYY-MM-DD → DD - MM - YYYY)
         ---------------------------------------------------------
         HTML date input returns: "2025-12-23"
         We display it as:       "23 - 12 - 2025"
         ========================================================= */
function formatDate(yyyyMMdd) {
  if (!yyyyMMdd) return "—"; // nothing selected
  const [y, m, d] = yyyyMMdd.split("-");
  if (!y || !m || !d) return "—"; // invalid format guard
  return `${d} - ${m} - ${y}`;
}

/* =========================================================
         ✅ 6) Validation Rules (One function per field)
         ---------------------------------------------------------
         Each function returns:
           ✅ true  → field is valid
           ❌ false → field is invalid
         ========================================================= */

function validateName(value) {
  return value.trim().length >= 3;
}

function validateCourse(value) {
  return value.trim().length >= 6;
}

function validateInstructor(value) {
  return value.trim().length >= 3;
}

function validateIssued(value) {
  return Boolean(value); // true if date exists
}

function validateSerial(value) {
  const v = value.trim();
  if (v.length < 6) return false;

  // ✅ Only allow: letters, digits, and dash
  return /^[A-Za-z0-9-]+$/.test(v);
}

function validateSignature(fileInput) {
  // fileInput.files is a list of files user selected
  const file = fileInput.files && fileInput.files[0];
  return Boolean(file);
}
function validateLogo(fileInput) {
  // fileInput.files is a list of files user selected
  const file = fileInput.files && fileInput.files[0];
  return Boolean(file);
}

/* =========================================================
         ✅ Helper: Apply validation class to a row
         ---------------------------------------------------------
         If invalid → add "invalid" class (shows error + red border)
         If valid   → remove it
         ========================================================= */
function setRowValid(rowEl, isValid) {
  rowEl.classList.toggle("invalid", !isValid);
}

/* =========================================================
         ✅ 7) Update Certificate Preview Text
         ---------------------------------------------------------
         This function reads values from inputs,
         then writes them into the certificate preview.
         If a field is empty, we show a nice placeholder text.
         ========================================================= */
function updateCertificate() {
  certName.textContent = elName.value.trim() || "Student Name";

  certCourse.textContent = elCourse.value.trim() || "Course Name Goes Here";

  certInstructor.textContent =
    elInstructor.value.trim() || "Instructor Name Goes Here";

  certIssued.textContent = formatDate(elIssued.value);

  certSerial.textContent = elSerial.value.trim() || "—";
}

/* =========================================================
         ✅ 8) Apply Signature from Uploaded File
         ---------------------------------------------------------
         - Read the selected file
         - Ensure it is an image
         - Convert it to a temporary object URL
         - Put it into <img src="...">
         ========================================================= */
function applySignatureFromFile() {
  const file = elSignatureFile.files && elSignatureFile.files[0];
  if (!file) return; // no file selected

  // ✅ Ensure the selected file is actually an image
  if (!file.type || !file.type.startsWith("image/")) {
    return;
  }

  // ✅ Revoke previous object URL (memory leak prevention)
  if (signatureObjectUrl) {
    URL.revokeObjectURL(signatureObjectUrl);
    signatureObjectUrl = null;
  }

  // ✅ Create a new temporary URL and display it
  signatureObjectUrl = URL.createObjectURL(file);
  certSignatureImg.src = signatureObjectUrl;
}

function applyLogoFromFile() {
  const file = ellogoFile.files && ellogoFile.files[0];
  if (!file) return; // no file selected
  // ✅ Ensure the selected file is actually an image

  if (!file.type || !file.type.startsWith("image/")) {
    return;
  }

  // ✅ Revoke previous object URL (memory leak prevention)
  if (LogotUrl) {
    URL.revokeObjectURL(LogotUrl);
    LogotUrl = null;
  }

  // ✅ Create a new temporary URL and display it
  LogotUrl = URL.createObjectURL(file);
  certLogoImg.src = LogotUrl;
}
function applySealFromFile() {
  const file = elSealFile.files && elSealFile.files[0];
  if (!file) return; // no file selected
  // ✅ Ensure the selected file is actually an image

  if (!file.type || !file.type.startsWith("image/")) {
    return;
  }

  // ✅ Revoke previous object URL (memory leak prevention)
  if (SealUrl) {
    URL.revokeObjectURL(SealUrl);
    SealUrl = null;
  }

  // ✅ Create a new temporary URL and display it
  SealUrl = URL.createObjectURL(file);
  certSealImg.src = SealUrl;
}
/* =========================================================
         ✅ 9) Validate All Fields + Control Print Button
         ---------------------------------------------------------
         - Validate each field
         - Mark invalid rows
         - Enable printing only when ALL are valid
         ========================================================= */
function validateAll() {
  const okName = validateName(elName.value);
  const okCourse = validateCourse(elCourse.value);
  const okInstructor = validateInstructor(elInstructor.value);
  const okIssued = validateIssued(elIssued.value);
  const okSerial = validateSerial(elSerial.value);
  const okSignature = validateSignature(elSignatureFile);
  const okLogo = validateLogo(ellogoFile);
  const okSeal = validateLogo(elSealFile);

  // Apply visual validation styles on each row
  setRowValid(rowName, okName);
  setRowValid(rowCourse, okCourse);
  setRowValid(rowInstructor, okInstructor);
  setRowValid(rowIssued, okIssued);
  setRowValid(rowSerial, okSerial);
  setRowValid(rowSignature, okSignature);
  setRowValid(rowLogo, okLogo);
  setRowValid(rowSeal, okSeal);

  // ✅ All must be true to allow printing
  const allOk =
    okName &&
    okCourse &&
    okInstructor &&
    okIssued &&
    okSerial &&
    okSignature &&
    okLogo &&
    okSeal;

  // ✅ Enable/disable print button
  btnPrint.disabled = !allOk;

  // ✅ Update status messages for user
  if (allOk) {
    statusLine.textContent = "✅ All fields are valid. Ready to print.";
    statusLine.className = "status ok";
    validBadge.textContent = "✅ Ready to print";
  } else {
    statusLine.textContent =
      "❌ Please fix the highlighted fields to enable printing.";
    statusLine.className = "status bad";
    validBadge.textContent = "❌ Not ready to print";
  }

  return allOk;
}

/* =========================================================
         ✅ 10) One function to handle any input change
         ---------------------------------------------------------
         Whenever the user types or changes something:
         - Update certificate preview
         - Validate everything
         ========================================================= */
function onInputChange() {
  updateCertificate();
  validateAll();
}

/* =========================================================
         ✅ 11) Live events (instant updates)
         ---------------------------------------------------------
         We listen to input/change events so the preview updates live.
         - "input"  fires on typing
         - "change" fires when finishing selection (like date input)
         ========================================================= */
[elName, elCourse, elInstructor, elIssued, elSerial].forEach((el) => {
  el.addEventListener("input", onInputChange);
  el.addEventListener("change", onInputChange);
});

/* =========================================================
         ✅ 12) Signature upload event
         ---------------------------------------------------------
         When user selects an image:
         - Show it in certificate
         - Re-check validation
         ========================================================= */
elSignatureFile.addEventListener("change", () => {
  applySignatureFromFile();
  validateAll();
});
ellogoFile.addEventListener("change", () => {
  applyLogoFromFile();
  validateAll();
});
elSealFile.addEventListener("change", () => {
  applySealFromFile();
  validateAll();
});
/* =========================================================
         ✅ 13) Print button
         ---------------------------------------------------------
         - Validate again (safety)
         - If valid, open browser print dialog
         ========================================================= */
btnPrint.addEventListener("click", () => {
  const ok = validateAll();
  if (!ok) return;
  let e = document.getElementById("MoreOption");
  e.style.display = "none";
  window.print();
});
/* =========================================================
         ✅ 14) Reset button
         ---------------------------------------------------------
         - Clear all inputs
         - Restore default signature
         - Update preview + validation
         ========================================================= */
btnReset.addEventListener("click", () => {
  // Clear form
  elName.value = "";
  elCourse.value = "";
  elInstructor.value = "";
  elIssued.value = "";
  elSerial.value = "";
  elSignatureFile.value = "";

  // Restore default signature image and clean up object URL
  if (signatureObjectUrl) {
    URL.revokeObjectURL(signatureObjectUrl);
    signatureObjectUrl = null;
  }
  if (LogotUrl) {
    URL.revokeObjectURL(LogotUrl);
    LogotUrl = null;
  }
  certLogoImg.src = "Logo.png";
  certSignatureImg.src = "DefaultSig.png";

  onInputChange();
});

/* =========================================================
         ✅ 15) Fill Demo button
         ---------------------------------------------------------
         - Adds sample values quickly (useful for testing)
         - Sets date to today
         - Shows a demo signature image
         ========================================================= */
btnFillDemo.addEventListener("click", () => {
  elName.value = "Mohammed Abu-Hadhoud";
  elCourse.value = "Goal Setting: Crafting and Achieving Your Objectives.";
  elInstructor.value = "Dr. Mohammed Abu-Hadhoud";
  elIssued.value = new Date().toISOString().slice(0, 10);
  elSerial.value = "MD-2025-000123";

  // ✅ For demo only: use a known image file
  // Note: This does NOT validate the file-input signature,
  // because file inputs cannot be set programmatically for security.
  certSignatureImg.src = "sig1.png";
  certLogoImg.src = "Logo.png";
  certSealImg.src = "Certified.png";
});

/* =========================================================
         ✅ 16) Init (run once when page loads)
         ---------------------------------------------------------
         - Fill placeholders
         - Run validation once so UI is correct from the start
         ========================================================= */
onInputChange();
