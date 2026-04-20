/* 🪐 1. ПІДСВІТКА СИНТАКСИСУ */

// Ініціалізуємо бібліотеку Highlight.js для підсвітки всього коду (<pre><code>) на сторінці
hljs.highlightAll();

/* ✨ 2. ЛОГІКА ПЕРЕМИКАННЯ ТЕМИ (Слайдер, Логотип, Підсвітка коду) */

document.addEventListener("DOMContentLoaded", () => {
  const themeCheckbox = document.getElementById("theme-checkbox");
  const hljsThemeLink = document.getElementById("hljs-theme");
  // const siteLogo = document.getElementById("site-logo");

  // Отримуємо збережену тему з локального сховища або встановлюємо 'light' за замовчуванням
  let currentTheme = localStorage.getItem("theme") || "light";

  // Універсальна функція для застосування теми до ВСІХ елементів сайту
  function applyTheme(theme) {
    // 1. Змінюємо атрибут для CSS
    document.documentElement.setAttribute("data-theme", theme);
    // 2. Зберігаємо вибір користувача
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      // Налаштування для ТЕМНОЇ теми
      if (themeCheckbox) themeCheckbox.checked = true;
      // if (siteLogo) siteLogo.src = "../template_01/logo-dark.svg";
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    } else {
      // Налаштування для СВІТЛОЇ теми
      if (themeCheckbox) themeCheckbox.checked = false;
      // if (siteLogo) siteLogo.src = "../template_01/logo-light.svg";
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    }
  }

  // Застосовуємо збережену тему одразу при завантаженні сторінки
  applyTheme(currentTheme);

  // Слухаємо кліки по новому перемикачу (чекбоксу)
  if (themeCheckbox) {
    themeCheckbox.addEventListener("change", (e) => {
      // Якщо чекбокс активовано - темна тема, якщо ні - світла
      applyTheme(e.target.checked ? "dark" : "light");
    });
  }
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
  window.scrollTo({ top: 0, behavior: "smooth" }),
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

/* 🗂 7. ТАБИ (ВКЛАДКИ) ДЛЯ ЧАСТИН УРОКУ */

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  let isAnimating = false; // Запобіжник: чи йде зараз анімація?

  // Якщо в HTML забули додати клас show для першої вкладки, скрипт це виправить
  const initialActive = document.querySelector(".tab-content.active");
  if (initialActive) initialActive.classList.add("show");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Ігноруємо клік, якщо це активна вкладка АБО якщо зараз грає анімація
      if (button.classList.contains("active") || isAnimating) return;

      isAnimating = true; // Блокуємо інші кліки, поки йде перехід

      const targetId = button.getAttribute("data-target");
      const currentActiveContent = document.querySelector(
        ".tab-content.active",
      );
      const currentActiveBtn = document.querySelector(".tab-btn.active");

      // Миттєво перемикаємо візуальний стан кнопок
      if (currentActiveBtn) currentActiveBtn.classList.remove("active");
      button.classList.add("active");

      if (currentActiveContent) {
        // ЕТАП 1: Починаємо плавне розчинення старого контенту
        currentActiveContent.classList.remove("show");

        // Чекаємо 300мс (поки відпрацює CSS transition: opacity)
        setTimeout(() => {
          // ЕТАП 2: Ховаємо старий блок повністю і дістаємо новий
          currentActiveContent.classList.remove("active"); // display: none

          const newContent = document.getElementById(targetId);
          newContent.classList.add("active"); // display: block

          // Даємо браузеру 20 мілісекунд, щоб він встиг відрендерити display: block
          // перед тим, як ми запустимо анімацію появи
          setTimeout(() => {
            newContent.classList.add("show"); // плавна поява
            isAnimating = false; // Розблоковуємо кліки
          },  20);
        }, 300);
      } else {
        // Запобіжник на випадок відсутності відкритої секції
        const newContent = document.getElementById(targetId);
        newContent.classList.add("active");
        setTimeout(() => {
          newContent.classList.add("show");
          isAnimating = false;
        }, 20);
      }
    });
  });
});
