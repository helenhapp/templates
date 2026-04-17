/* 🪐 1. ПІДСВІТКА СИНТАКСИСУ */

// Ініціалізуємо бібліотеку Highlight.js для підсвітки всього коду (<pre><code>) на сторінці
hljs.highlightAll();

/* ✨ 2. ЛОГІКА ПЕРЕМИКАННЯ ТЕМИ */

const themeToggleBtn = document.getElementById("theme-toggle");
const hljsThemeLink = document.getElementById("hljs-theme");

// Отримуємо збережену тему з локального сховища або встановлюємо 'light' за замовчуванням
let currentTheme = localStorage.getItem("theme") || "light";

// Функція для застосування обраної теми до всього сайту
function applyTheme(theme) {
  // Встановлюємо атрибут data-theme для тегу <html>, на який реагує CSS
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "light") {
    // Якщо тема світла, підключаємо світлу версію стилів для підсвітки коду
    hljsThemeLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    themeToggleBtn.textContent = "Темна тема"; // Напис для переходу на темну
  } else {
    // Якщо тема темна, підключаємо темну версію стилів
    hljsThemeLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    themeToggleBtn.textContent = "Світла тема"; // Напис для переходу на світлу
  }
  
  // Зберігаємо вибір користувача, щоб тема не збивалася при оновленні сторінки
  localStorage.setItem("theme", theme);
}

// Застосовуємо тему одразу при завантаженні файлу
applyTheme(currentTheme);

// Додаємо подію кліку на кнопку перемикача
themeToggleBtn.addEventListener("click", () => {
  // Змінюємо значення теми на протилежне
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

/* ☀️ 3. ПЛАВНІ ПЕРЕХОДИ МІЖ СТОРІНКАМИ */

document.addEventListener("DOMContentLoaded", () => {
  // Щойно завантажаться всі шрифти, знімаємо анімаційну "завісу" (клас is-loaded)
  document.fonts.ready.then(() => document.body.classList.add("is-loaded"));
  
  const links = document.querySelectorAll("a");
  
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Ігноруємо перехоплення кліку, якщо:
      // - посилання відкривається в новій вкладці (_blank)
      // - затиснуті клавіші Ctrl, Meta, Shift або Alt (кастомні кліки користувача)
      // - це посилання на інший домен (не наш сайт)
      // - це якірне посилання (скрол до елемента на поточній сторінці)
      if (
        link.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        link.origin !== window.location.origin ||
        link.hash
      ) {
        return;
      }

      // Скасовуємо стандартний миттєвий перехід
      e.preventDefault();
      const destination = link.href;
      
      // Запускаємо анімацію зникнення сторінки (через CSS)
      document.body.classList.add("is-leaving");
      
      // Чекаємо 1 секунду (1000мс), поки відпрацює анімація, і робимо перехід
      setTimeout(() => (window.location.href = destination), 1000);
    });
  });
});

// Вирішуємо проблему з кешем (bfcache), коли користувач тисне кнопку "Назад" у браузері
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    // Якщо сторінка дістається з кешу, знімаємо стан "виходу" та показуємо її
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-loaded");
  }
});

/* 🌙 4. КНОПКА "ПОВЕРНУТИСЯ НАГОРУ" */

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  // Показуємо кнопку тільки тоді, коли користувач проскролив вниз більше ніж на 300px
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

// Плавний скрол на самий верх сторінки при кліку на кнопку
scrollToTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* 🍿 5. КНОПКА "СКОПІЮВАТИ" ДЛЯ КОДУ */

document.querySelectorAll("pre code").forEach((codeBlock) => {
  // Якщо блок коду має клас 'nocopy', пропускаємо його
  if (codeBlock.classList.contains("nocopy")) return;
  
  const pre = codeBlock.parentNode;
  
  // Створюємо обгортку для блоку коду, щоб позиціонувати кнопку всередині
  const wrapper = document.createElement("div");
  wrapper.className = "code-wrapper";
  
  // Переносимо <pre> всередину нашої нової обгортки
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  
  // Створюємо саму кнопку "Копіювати"
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Копіювати";
  wrapper.appendChild(copyBtn);
  
  // Додаємо логіку при натисканні
  copyBtn.addEventListener("click", () => {
    // Використовуємо сучасний Clipboard API для запису тексту в буфер
    navigator.clipboard
      .writeText(codeBlock.innerText)
      .then(() => {
        // Успішно скопійовано: візуально змінюємо кнопку
        copyBtn.textContent = "Скопійовано";
        copyBtn.classList.add("copied");
        
        // Повертаємо кнопку до початкового стану через 2 секунди
        setTimeout(() => {
          copyBtn.textContent = "Копіювати";
          copyBtn.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => console.error("Помилка копіювання: ", err));
  });
});

/* 🍕 6. КАСТОМНИЙ РЕДАКТОР КОДУ (CUSTOM EDITOR) */

document.addEventListener("DOMContentLoaded", () => {
  const editors = document.querySelectorAll(".custom-editor-wrapper");
  
  editors.forEach((wrapper) => {
    const runBtn = wrapper.querySelector(".run-btn");
    const codeInput = wrapper.querySelector(".custom-editor-input");
    const outputDisplay = wrapper.querySelector(".custom-editor-output");
    
    // Функція, яка автоматично змінює висоту поля вводу (textarea) під розмір тексту
    const adjustHeight = () => {
      codeInput.style.height = "auto";
      codeInput.style.height = codeInput.scrollHeight + "px";
    };
    
    // Підлаштовуємо висоту під час набору тексту
    codeInput.addEventListener("input", adjustHeight);
    
    // Підлаштовуємо висоту при завантаженні (з нульовою затримкою для правильного рендеру)
    setTimeout(adjustHeight, 0);
    
    // Логіка виконання коду при натисканні кнопки "Запустити"
    runBtn.addEventListener("click", () => {
      const codeToRun = codeInput.value;
      let simulatedOutput = "";
      
      // Зберігаємо оригінальний метод console.log
      const originalConsoleLog = console.log;
      
      // Перевизначаємо console.log, щоб ловити вивід з користувацького коду
      console.log = function (...args) {
        const logString = args
          .map((arg) => {
            // Форматуємо об'єкти як красивий JSON, а все інше конвертуємо в рядок
            if (typeof arg === "object") return JSON.stringify(arg, null, 2);
            return String(arg);
          })
          .join(" ");
        // Додаємо вивід до нашого віртуального логу
        simulatedOutput += logString + "\n";
      };

      try {
        // Створюємо нову функцію з тексту користувача і виконуємо її.
        // Це трохи безпечніша альтернатива eval()
        const executeCode = new Function(codeToRun);
        executeCode();
        
        // Якщо код відпрацював, але нічого не вивів
        if (simulatedOutput === "") {
          simulatedOutput = "Код виконано (немає виводу в консоль)";
        }
      } catch (error) {
        // Якщо у користувацькому коді є помилка, перехоплюємо її
        simulatedOutput = "Помилка: " + error.message;
      }

      // Обов'язково повертаємо оригінальний console.log на місце!
      console.log = originalConsoleLog;
      
      // Відображаємо результат в інтерфейсі (прибираємо зайві пробіли на кінці)
      outputDisplay.textContent = simulatedOutput.trim();
    });
  });
});
