const Color = {
  background: document.getElementById("backGround-color"),
  frame: document.getElementById("frame-color"),
  frameinner: document.getElementById("frame-inner-color"),
  meta: document.getElementById("meta-color"),
  school: document.getElementById("school-color"),
  title: document.getElementById("title-color"),
  subtitle: document.getElementById("subtitle-color"),
  name: document.getElementById("name-color"),
  text: document.getElementById("text-color"),
  course: document.getElementById("course-color"),
  divider: document.getElementById("divider-color"),
  sigLine: document.getElementById("sigLine-color"),
  sigName: document.getElementById("sigName-color"),
};

Color.background.addEventListener("input", function () {
  let e = document.querySelector(".mdc-cert");
  e.style.background = this.value;
});
Color.frame.addEventListener("input", function () {
  let e = document.querySelector(".mdc-frame-outer");
  e.style.background = this.value;
});
Color.frameinner.addEventListener("input", function () {
  let e = document.querySelector(".mdc-frame-inner");
  e.style.background = this.value;
});
Color.meta.addEventListener("input", function () {
  let e = document.querySelector(".mdc-meta");
  e.style.background = this.value;
});
Color.school.addEventListener("input", function () {
  let e = document.querySelector(".mdc-school");
  e.style.background = this.value;
});
Color.title.addEventListener("input", function () {
  let e = document.querySelector(".mdc-title");
  e.style.background = this.value;
});
Color.subtitle.addEventListener("input", function () {
  let e = document.querySelector(".mdc-subtitle");
  e.style.background = this.value;
});
Color.name.addEventListener("input", function () {
  let e = document.querySelector(".mdc-name");
  e.style.background = this.value;
});
Color.text.addEventListener("input", function () {
  let e = document.querySelector(".mdc-text");
  e.style.background = this.value;
});
Color.course.addEventListener("input", function () {
  let e = document.querySelector(".mdc-course");
  e.style.background = this.value;
});
Color.divider.addEventListener("input", function () {
  let e = document.querySelector(".mdc-divider");
  e.style.background = this.value;
});
Color.sigLine.addEventListener("input", function () {
  let e = document.querySelector(".mdc-sigLine");
  e.style.background = this.value;
});
Color.sigName.addEventListener("input", function () {
  let e = document.querySelector(".mdc-sigName");
  e.style.background = this.value;
});
/*function saveColors() {
  const saved = {};

  for (const key in Color) {
    if (Color[key]) {
      saved[key] = Color[key].value;
    }
  }

  localStorage.setItem("mdc-colors", JSON.stringify(saved));
}
function loadColors() {
  const saved = JSON.parse(localStorage.getItem("mdc-colors"));
  if (!saved) return;

  for (const key in saved) {
    if (Color[key]) {
      Color[key].value = saved[key];
      Color[key].dispatchEvent(new Event("input"));
    }
  }
}
for (const key in Color) {
  if (!Color[key]) continue;
  Color[key].addEventListener("input", saveColors);
}
window.addEventListener("DOMContentLoaded", loadColors);*/
