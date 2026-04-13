/* 🪐 1. ПІДСВІТКА СИНТАКСИСУ */

hljs.highlightAll();

/* ✨ 2. ЛОГІКА ПЕРЕМИКАННЯ ТЕМИ */

const themeToggleBtn = document.getElementById("theme-toggle");
const hljsThemeLink = document.getElementById("hljs-theme");
let currentTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    hljsThemeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    themeToggleBtn.textContent = "Темна тема";
  } else {
    hljsThemeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    themeToggleBtn.textContent = "Світла тема";
  }
  localStorage.setItem("theme", theme);
}

applyTheme(currentTheme);
themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

/* ☀️ 3. ПЛАВНІ ПЕРЕХОДИ МІЖ СТОРІНКАМИ */

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => document.body.classList.add("is-loaded"));
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || link.origin !== window.location.origin || link.hash) return;
      e.preventDefault();
      const destination = link.href;
      document.body.classList.add("is-leaving");
      setTimeout(() => window.location.href = destination, 1000);
    });
  });
});

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-loaded");
  }
});

/* 🌙 4. КНОПКА "ПОВЕРНУТИСЯ НАГОРУ" */

const scrollToTopBtn = document.getElementById("scrollToTopBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) scrollToTopBtn.classList.add("show");
  else scrollToTopBtn.classList.remove("show");
});
scrollToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* 🍿 5. КНОПКА "СКОПІЮВАТИ" ДЛЯ КОДУ */

document.querySelectorAll("pre code").forEach((codeBlock) => {
  if (codeBlock.classList.contains("nocopy")) return;
  const pre = codeBlock.parentNode;
  const wrapper = document.createElement("div");
  wrapper.className = "code-wrapper";
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Копіювати";
  wrapper.appendChild(copyBtn);
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      copyBtn.textContent = "Скопійовано";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Копіювати";
        copyBtn.classList.remove("copied");
      }, 2000);
    }).catch((err) => console.error("Помилка копіювання: ", err));
  });
});


/* 🍕 6. CUSTOM EDITOR */

document.addEventListener("DOMContentLoaded", () => {
  const editors = document.querySelectorAll(".custom-editor-wrapper");
  editors.forEach((wrapper) => {
    const runBtn = wrapper.querySelector(".run-btn");
    const codeInput = wrapper.querySelector(".custom-editor-input");
    const outputDisplay = wrapper.querySelector(".custom-editor-output");
    const adjustHeight = () => {
      codeInput.style.height = "auto"; 
      codeInput.style.height = codeInput.scrollHeight + "px"; 
    };
    codeInput.addEventListener("input", adjustHeight);
    setTimeout(adjustHeight, 0);
    runBtn.addEventListener("click", () => {
      const codeToRun = codeInput.value;
      let simulatedOutput = "";
      const originalConsoleLog = console.log;
      console.log = function (...args) {
        const logString = args.map(arg => {
          if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
          return String(arg);
        }).join(" ");
        simulatedOutput += logString + "\n";
      };

      try {
        const executeCode = new Function(codeToRun);
        executeCode();
        if (simulatedOutput === "") simulatedOutput = "Код виконано (немає виводу в консоль)";
      } catch (error) {simulatedOutput = "Помилка: " + error.message;}
      
      console.log = originalConsoleLog;
      outputDisplay.textContent = simulatedOutput.trim();
    });
  });
});