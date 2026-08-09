const Languages = Object.freeze({
  AR: "ar",
  EN: "en",
});
const translations = {
  ar: {
    title: "مرحبا",
    Name: "عدنان غياث عثمان",
    Programer: "مبرنج",
    hi: "مرحباً، أنا",
    subtitle: "موقع تعريفي عني، يُسهل معرفتي للناس بشكل أكثر",
    projectsBtn: "👁️‍🗨️انظر إلى مشاريعي",
    aboutBtn: "أعرف عني🔎",
  },
  en: {
    title: "Welcome",
    Name: "Adnan Ghiyath Othman",
    Programer: "Programer",
    hi: "Hello, I'm ",
    subtitle: "A personal portfolio website to introduce myself clearly.",
    projectsBtn: "Look at my projects👁️‍🗨️",
    aboutBtn: "About Me🔎",
  },
};
let currentLang = Languages.AR;

function changeLanguage() {
  if (currentLang === Languages.AR) currentLang = Languages.EN;
  else currentLang = Languages.AR;
  document.getElementById("hi").textContent = translations[currentLang].hi;
  document.getElementById("name").textContent = translations[currentLang].Name;
  document.getElementById("Programer").textContent =
    translations[currentLang].Programer;
  document.getElementById("subtitle").textContent =
    translations[currentLang].subtitle;

  document.getElementById("projectsBtn").textContent =
    translations[currentLang].projectsBtn;

  document.getElementById("aboutBtn").textContent =
    translations[currentLang].aboutBtn;

  // تغيير نص الزر
  document.getElementById("languageBtn").textContent =
    currentLang === Languages.AR ? "English" : "عربي";
}
document
  .getElementById("languageBtn")
  .addEventListener("click", changeLanguage);
