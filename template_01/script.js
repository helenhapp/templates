// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🎨 1. ПІДСВІТКА СИНТАКСИСУ (Highlight.js)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
if (typeof hljs !== "undefined") {
  hljs.highlightAll();

  // Перевіряємо, чи підключений плагін нумерації на цій сторінці, щоб скрипт не ламався
  if (typeof hljs.initLineNumbersOnLoad === "function") {
    hljs.initLineNumbersOnLoad({ singleLine: true });
  }
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🗺️ 2. ГЕНЕРАТОР НАВІГАЦІЇ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function buildNavigation() {
  const container = document.getElementById("nav-container");
  if (!container || !window.pageNavLinks) return;

  const linksHTML = window.pageNavLinks
    .map((link) => {
      const targetAttr = link.newTab ? ' target="_blank"' : "";
      return `<a href="${link.url}" class="nav-link"${targetAttr}>${link.name}</a>`;
    })
    .join("");

  container.innerHTML = `
    <nav class="top-bar">
      <div class="logo-container">
        <img src="./logo-light.svg" alt="WebUniverse Logo" width="150" height="54" class="site-logo logo-light" />
        <img src="./logo-dark.svg" alt="WebUniverse Logo" width="150" height="54" class="site-logo logo-dark" />
      </div>
      <div class="top-bar__controls">
        <div class="nav-links">
          ${linksHTML}
        </div>
        <label class="toggle-switch" aria-label="Перемикач теми">
          <input type="checkbox" id="theme-checkbox" />
          <span class="slider">
            <span class="icon sun">☀️</span>
            <span class="icon moon">🌙</span>
          </span>
        </label>
        <button id="wide-mode-btn" class="wide-toggle" title="Широкий екран">🖥️</button>
        <button class="hamburger-btn" aria-label="Відкрити меню">🚀</button>
      </div>
    </nav>
  `;
}

document.addEventListener("DOMContentLoaded", buildNavigation);

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🌗 3. ПЕРЕМИКАННЯ ТЕМ (Світла/Темна)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const themeCheckbox = document.getElementById("theme-checkbox");
  const hljsThemeLink = document.getElementById("hljs-theme");
  let currentTheme = localStorage.getItem("wu_theme") || "light";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wu_theme", theme);

    if (theme === "dark") {
      if (themeCheckbox) themeCheckbox.checked = true;
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    } else {
      if (themeCheckbox) themeCheckbox.checked = false;
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    }
  }

  applyTheme(currentTheme);

  if (themeCheckbox) {
    themeCheckbox.addEventListener("change", (e) => {
      applyTheme(e.target.checked ? "dark" : "light");
    });
  }
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🌬️ 4. ПЛАВНІ ПЕРЕХОДИ МІЖ СТОРІНКАМИ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => document.body.classList.add("is-loaded"));
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  if (
    link.hasAttribute("download") ||
    link.target === "_blank" ||
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    e.altKey ||
    link.origin !== window.location.origin ||
    link.hash ||
    link.getAttribute("href") === "" ||
    link.getAttribute("href") === "#"
  ) {
    return;
  }

  e.preventDefault();
  const destination = link.href;
  document.body.classList.add("is-leaving");
  setTimeout(() => (window.location.href = destination), 700);
});

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-loaded");
  }
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🍔 5. МОБІЛЬНЕ МЕНЮ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navLinks = document.querySelector(".nav-links");

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      const isOpen = navLinks.classList.contains("open");
      const clickedOutside =
        !hamburgerBtn.contains(event.target) &&
        !navLinks.contains(event.target);

      if (isOpen && clickedOutside) {
        navLinks.classList.remove("open");
      }
    });
  }
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🗂️ 6. ТАБИ (ВКЛАДКИ)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  let isAnimating = false;

  const savedTabId = sessionStorage.getItem("activeTab");

  if (savedTabId) {
    const savedBtn = document.querySelector(
      `.tab-btn[data-target="${savedTabId}"]`,
    );
    const savedContent = document.getElementById(savedTabId);

    if (savedBtn && savedContent) {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active", "show");
      });

      savedBtn.classList.add("active");
      savedContent.classList.add("active", "show");
    }
  } else {
    const initialActive = document.querySelector(".tab-content.active");
    if (initialActive) initialActive.classList.add("show");
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("active") || isAnimating) return;

      isAnimating = true;
      const targetId = button.getAttribute("data-target");
      sessionStorage.setItem("activeTab", targetId);

      const currentActiveContent = document.querySelector(
        ".tab-content.active",
      );
      const currentActiveBtn = document.querySelector(".tab-btn.active");

      if (currentActiveBtn) currentActiveBtn.classList.remove("active");
      button.classList.add("active");

      if (currentActiveContent) {
        currentActiveContent.classList.remove("show");
        setTimeout(() => {
          currentActiveContent.classList.remove("active");
          const newContent = document.getElementById(targetId);
          newContent.classList.add("active");

          setTimeout(() => {
            newContent.classList.add("show");
            isAnimating = false;
          }, 20);
        }, 400);
      } else {
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

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 📑 7. АКОРДЕОНИ (Збереження стану)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const allDetails = document.querySelectorAll("details");
  const savedState = sessionStorage.getItem("openAccordions");

  if (savedState) {
    const openIndices = JSON.parse(savedState);
    allDetails.forEach((detail, index) => {
      if (openIndices.includes(index)) {
        detail.setAttribute("open", "");
      } else {
        detail.removeAttribute("open");
      }
    });
  }

  allDetails.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      // Збереження стану (існуючий код)
      const openIndices = [];
      allDetails.forEach((d, i) => {
        if (d.hasAttribute("open")) openIndices.push(i);
      });
      sessionStorage.setItem("openAccordions", JSON.stringify(openIndices));

      // 👇 НОВИЙ КОД: Плавний скрол до відкритої вкладки
      // Перевіряємо, що вкладка відкрилась і що це саме головна вкладка (а не дрібні тести)
      if (detail.open && detail.classList.contains("accordion__item")) {
        // Чекаємо 400мс, поки завершиться CSS-анімація згортання попередньої вкладки
        setTimeout(() => {
          // Відступ зверху, щоб липка панель навігації (top-bar) не перекривала заголовок
          const offset = 75;
          const y =
            detail.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }, 400);
      }
    });
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🖥️ 8. ШИРОКИЙ ЕКРАН (Wide Mode)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("wu_wideMode") === "true") {
    document.body.classList.add("wide-mode");
  }

  document.addEventListener("click", (e) => {
    const wideBtn = e.target.closest("#wide-mode-btn");
    if (wideBtn) {
      const isNowWide = document.body.classList.toggle("wide-mode");
      localStorage.setItem("wu_wideMode", isNowWide);
      wideBtn.style.transform = "scale(0.85)";
      setTimeout(() => (wideBtn.style.transform = ""), 150);
    }
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🌤️ 9. ТІНЬ ПАНЕЛІ ПРИ СКРОЛІ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navContainer.classList.add("scrolled");
    } else {
      navContainer.classList.remove("scrolled");
    }
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🚀 10. КНОПКА "ПОВЕРНУТИСЯ НАГОРУ"
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🖼️ 11. ЗБІЛЬШЕННЯ МЕДІА (Zoom)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const pageId = window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");

  // 11.1 Картинки
  const zoomableImages = document.querySelectorAll(
    "img.zoomable:not(.mockup-image)",
  );
  const storageKeyImg = "wu_expanded_img_" + pageId;
  const savedImages = JSON.parse(sessionStorage.getItem(storageKeyImg) || "[]");

  zoomableImages.forEach((img, index) => {
    if (savedImages.includes(index)) img.classList.add("expanded");

    img.addEventListener("click", () => {
      img.classList.toggle("expanded");
      const openIndices = [];
      zoomableImages.forEach((image, i) => {
        if (image.classList.contains("expanded")) openIndices.push(i);
      });
      sessionStorage.setItem(storageKeyImg, JSON.stringify(openIndices));
    });
  });

  // 11.2 Відео
  const zoomableVideos = document.querySelectorAll(".video-wrapper.zoomable");
  const storageKeyVid = "wu_expanded_vid_" + pageId;
  const savedVideos = JSON.parse(sessionStorage.getItem(storageKeyVid) || "[]");

  zoomableVideos.forEach((wrapper, index) => {
    const zoomBtn = document.createElement("button");
    zoomBtn.className = "video-zoom-btn";

    if (savedVideos.includes(index)) {
      wrapper.classList.add("expanded");
      zoomBtn.innerHTML = "✖ Зменшити";
      zoomBtn.title = "Повернути стандартний розмір";
    } else {
      zoomBtn.innerHTML = "⛶ Розширити";
      zoomBtn.title = "Розширити відео";
    }

    wrapper.appendChild(zoomBtn);

    zoomBtn.addEventListener("click", () => {
      wrapper.classList.toggle("expanded");
      if (wrapper.classList.contains("expanded")) {
        zoomBtn.innerHTML = "✖ Зменшити";
        zoomBtn.title = "Повернути стандартний розмір";
      } else {
        zoomBtn.innerHTML = "⛶ Розширити";
        zoomBtn.title = "Розширити відео";
      }

      const openIndices = [];
      zoomableVideos.forEach((vid, i) => {
        if (vid.classList.contains("expanded")) openIndices.push(i);
      });
      sessionStorage.setItem(storageKeyVid, JSON.stringify(openIndices));
    });
  });

  // 11.3 Макети (Mockups)
  const zoomableMockups = document.querySelectorAll(
    ".mockup-container.zoomable",
  );
  const storageKeyMockup = "wu_expanded_mockup_" + pageId;
  const savedMockups = JSON.parse(
    sessionStorage.getItem(storageKeyMockup) || "[]",
  );

  zoomableMockups.forEach((wrapper, index) => {
    const zoomBtn = document.createElement("button");
    zoomBtn.className = "video-zoom-btn";

    if (savedMockups.includes(index)) {
      wrapper.classList.add("expanded");
      zoomBtn.innerHTML = "✖ Зменшити";
      zoomBtn.title = "Повернути стандартний розмір";
    } else {
      zoomBtn.innerHTML = "⛶ Розширити";
      zoomBtn.title = "Розширити макет";
    }

    wrapper.appendChild(zoomBtn);

    zoomBtn.addEventListener("click", () => {
      wrapper.classList.toggle("expanded");
      if (wrapper.classList.contains("expanded")) {
        zoomBtn.innerHTML = "✖ Зменшити";
        zoomBtn.title = "Повернути стандартний розмір";
      } else {
        zoomBtn.innerHTML = "⛶ Розширити";
        zoomBtn.title = "Розширити макет";
      }

      const openIndices = [];
      zoomableMockups.forEach((m, i) => {
        if (m.classList.contains("expanded")) openIndices.push(i);
      });
      sessionStorage.setItem(storageKeyMockup, JSON.stringify(openIndices));
    });
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 📥 12. ПЕРЕВІРКА ПОСИЛАНЬ НА ЗАВАНТАЖЕННЯ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("click", async (e) => {
  const downloadLink = e.target.closest("a[download]:not([data-temp])");

  if (downloadLink) {
    e.preventDefault();
    const originalText = downloadLink.innerHTML;
    const fileUrl = downloadLink.href;

    try {
      downloadLink.style.opacity = "0.6";
      downloadLink.style.pointerEvents = "none";

      const response = await fetch(fileUrl, { method: "HEAD" });

      if (response.ok) {
        const tempLink = document.createElement("a");
        tempLink.href = fileUrl;
        tempLink.download = downloadLink.getAttribute("download") || "";
        tempLink.setAttribute("data-temp", "true");

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      } else {
        downloadLink.innerHTML = "❌ Файл не знайдено";
        downloadLink.style.borderColor = "var(--brand3)";
        downloadLink.style.color = "var(--brand3)";
        downloadLink.style.justifyContent = "center";

        setTimeout(() => {
          downloadLink.innerHTML = originalText;
          downloadLink.style.borderColor = "";
          downloadLink.style.color = "";
          downloadLink.style.justifyContent = "";
        }, 1000);
      }
    } catch (error) {
      console.error("Помилка перевірки файлу:", error);
      downloadLink.innerHTML = "⚠️ Помилка з'єднання";
      downloadLink.style.justifyContent = "center";
      setTimeout(() => {
        downloadLink.innerHTML = originalText;
        downloadLink.style.justifyContent = "";
      }, 3000);
    } finally {
      downloadLink.style.opacity = "1";
      downloadLink.style.pointerEvents = "auto";
    }
  }
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 📋 13. КНОПКА "СКОПІЮВАТИ КОД"
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
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
    let textToCopy = "";

    // Шукаємо колонки з кодом, які створює плагін нумерації
    const codeLines = codeBlock.querySelectorAll(".hljs-ln-code");

    if (codeLines.length > 0) {
      // Збираємо текст ТІЛЬКИ з колонок із кодом (ігноруючи номери рядків)
      // і з'єднуємо їх правильним перенесенням рядка
      textToCopy = Array.from(codeLines)
        .map((td) => td.textContent)
        .join("\n");
    } else {
      // Якщо нумерації немає, просто беремо чистий текст (textContent надійніший за innerText)
      textToCopy = codeBlock.textContent;
    }

    // Додатково очищаємо текст від нерозривних пробілів (які іноді глючать у VS Code)
    textToCopy = textToCopy.replace(/\u00A0/g, " ");

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        copyBtn.textContent = "Скопійовано";
        copyBtn.classList.add("copied");

        setTimeout(() => {
          copyBtn.textContent = "Копіювати";
          copyBtn.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => console.error("Помилка копіювання: ", err));
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 💻 14. ІНТЕРАКТИВНИЙ РЕДАКТОР КОДУ (CodeMirror)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const editors = document.querySelectorAll(".custom-editor-wrapper");

  editors.forEach((wrapper) => {
    const codeInput = wrapper.querySelector(".custom-editor-input");
    const runBtn = wrapper.querySelector(".run-btn");
    const resetBtn = wrapper.querySelector(".reset-btn");
    const isHtmlEditor = wrapper.classList.contains("html-editor-wrapper");

    const pageId = window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
    const editorId =
      wrapper.id || "editor-" + Math.random().toString(36).substr(2, 9);
    const storageKey = "wu_code_" + pageId + "_" + editorId;

    const editorMode = isHtmlEditor ? "htmlmixed" : "javascript";
    const defaultCode = codeInput.defaultValue;

    const savedCode = localStorage.getItem(storageKey);
    const startingCode = savedCode !== null ? savedCode : defaultCode;

    const cm = CodeMirror.fromTextArea(codeInput, {
      mode: editorMode,
      theme: "dracula",
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true,
      viewportMargin: Infinity,
      extraKeys: {
        Tab: function (cm) {
          let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
      },
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => cm.refresh(), 20);
        }
      });
    });
    observer.observe(wrapper);

    const outputDisplay = wrapper.querySelector(".custom-editor-output");
    const iframeOutput = wrapper.querySelector(".html-editor-output");

    if (isHtmlEditor && iframeOutput) {
      iframeOutput.srcdoc = cm.getValue();
    }

    if (runBtn) {
      runBtn.addEventListener("click", () => {
        const code = cm.getValue();

        if (isHtmlEditor) {
          if (iframeOutput) iframeOutput.srcdoc = code;
        } else {
          if (outputDisplay) {
            outputDisplay.textContent = "Запуск...";
            setTimeout(() => {
              runJsCode(code, outputDisplay);
            }, 50);
          }
        }
      });
    }

    if (resetBtn) {
      const initialValue = codeInput.defaultValue;
      resetBtn.addEventListener("click", () => {
        cm.setValue(initialValue);
        if (isHtmlEditor && iframeOutput) iframeOutput.srcdoc = initialValue;
        if (outputDisplay) outputDisplay.textContent = "Очікування запуску...";
      });
    }
  });
});

// Допоміжна функція для безпечного запуску JS коду
function runJsCode(codeToRun, outputDisplay) {
  let simulatedOutput = "";
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  console.log = (...args) => {
    simulatedOutput +=
      args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ") + "\n";
  };

  console.error = (...args) => {
    simulatedOutput +=
      "Помилка: " +
      args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ") +
      "\n";
  };

  try {
    const executeCode = new Function(codeToRun);
    executeCode();
    outputDisplay.textContent =
      simulatedOutput.trim() || "Код виконано (немає виводу в консоль)";
  } catch (error) {
    outputDisplay.textContent = "Помилка у коді: " + error.message;
  } finally {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  }
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 📝 15. ДОМАШНЄ ЗАВДАННЯ (Валідація та збереження)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const hwForm = document.getElementById("homework-form");
  if (!hwForm) return;

  const studentNameInput = document.getElementById("student-name");
  const saveBtn = document.getElementById("save-hw-btn");
  const copyBtn = document.getElementById("copy-hw-btn");
  const clearBtn = document.getElementById("clear-hw-btn");
  const errorMsg = document.getElementById("hw-error-msg");

  const pageId = window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
  const formStorageKey = "wu_hw_form_" + pageId;

  // --- 1. ВІДНОВЛЕННЯ З ЛОКАЛЬНОГО СХОВИЩА ---
  const savedFormData = JSON.parse(
    localStorage.getItem(formStorageKey) || "{}",
  );

  hwForm
    .querySelectorAll("input, textarea:not(.custom-editor-input)")
    .forEach((el) => {
      if (el.type === "radio" || el.type === "checkbox") {
        if (
          savedFormData[el.name] &&
          savedFormData[el.name].includes(el.value)
        ) {
          el.checked = true;
        }
      } else {
        if (savedFormData[el.name]) el.value = savedFormData[el.name];
      }
    });

  // --- 2. АВТОЗБЕРЕЖЕННЯ ПРИ ВВЕДЕННІ ---
  hwForm.addEventListener("input", () => {
    const data = {};
    hwForm
      .querySelectorAll(
        "input[type='radio']:checked, input[type='checkbox']:checked",
      )
      .forEach((el) => {
        if (!data[el.name]) data[el.name] = [];
        data[el.name].push(el.value);
      });
    hwForm
      .querySelectorAll(
        "textarea:not(.custom-editor-input), input[type='text']",
      )
      .forEach((el) => {
        data[el.name] = el.value;
      });

    localStorage.setItem(formStorageKey, JSON.stringify(data));
    errorMsg.style.display = "none";
    hwForm
      .querySelectorAll(".error-highlight")
      .forEach((el) => el.classList.remove("error-highlight"));
  });

  // --- 3. ЗБІР ТА ВАЛІДАЦІЯ ДАНИХ ---
  function collectAndValidate() {
    let isValid = true;
    let outputText = `======================================\nДОМАШНЄ ЗАВДАННЯ\n======================================\n\n`;

    const name = studentNameInput.value.trim();
    if (!name) {
      studentNameInput
        .closest(".student-info")
        .classList.add("error-highlight");
      isValid = false;
    }

    outputText += `Учень: ${name || "[НЕ ВКАЗАНО]"}\n`;
    const date = new Date();
    outputText += `Дата здачі: ${date.toLocaleDateString("uk-UA")} о ${date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}\n\n--------------------------------------\n\n`;

    const questions = hwForm.querySelectorAll(
      ".test-question:not(.student-info)",
    );

    questions.forEach((qBlock) => {
      let qText = "";
      const p = qBlock.querySelector("p");
      if (p) {
        qText = p.textContent.replace(/\s+/g, " ").trim();
      } else if (qBlock.querySelector(".editor-title")) {
        qText =
          "Практичне завдання (" +
          qBlock
            .querySelector(".editor-title")
            .textContent.replace(/\s+/g, " ")
            .trim() +
          ")";
      }

      let answerText = "";
      let isAnswered = false;

      const checkedRadio = qBlock.querySelector(".test-radio:checked");
      if (checkedRadio) {
        answerText = checkedRadio.value;
        isAnswered = true;
      }

      const checkedBoxes = qBlock.querySelectorAll(".test-checkbox:checked");
      if (checkedBoxes.length > 0) {
        answerText = Array.from(checkedBoxes)
          .map((cb) => cb.value)
          .join(", ");
        isAnswered = true;
      }

      const textarea = qBlock.querySelector(".test-textarea");
      if (textarea && textarea.value.trim() !== "") {
        answerText = textarea.value.trim();
        isAnswered = true;
      }

      const editorWrapper = qBlock.querySelector(".custom-editor-wrapper");
      if (editorWrapper) {
        const cmInstance =
          editorWrapper.querySelector(".CodeMirror")?.CodeMirror;
        if (cmInstance) {
          const codeValue = cmInstance.getValue();
          if (codeValue.trim() !== "") {
            answerText = "\n" + codeValue;
            isAnswered = true;
          }
        }
      }

      if (!isAnswered) {
        qBlock.classList.add("error-highlight");
        isValid = false;
      }

      if (qText || answerText) {
        outputText += `❓ Питання: ${qText}\n📝 Відповідь: ${answerText || "[Немає відповіді]"}\n\n--------------------------------------\n\n`;
      }
    });

    // Очищаємо всі таби та нерозривні пробіли у фінальному тексті
    outputText = outputText.replace(/\t/g, "  ").replace(/\u00A0/g, " ");

    return { isValid, outputText, name };
  }

  // --- 4. ЗБЕРЕЖЕННЯ ФАЙЛУ (.TXT) ---
  saveBtn.addEventListener("click", () => {
    const { isValid, outputText, name } = collectAndValidate();

    if (!isValid) {
      errorMsg.style.display = "block";
      document
        .querySelector(".error-highlight")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const titleElement = document.getElementById("lesson-title");
    const pageTitle = titleElement ? titleElement.textContent.trim() : "Тема";

    const safeTopic = pageTitle
      .replace(/\s+/g, "_")
      .replace(/[^a-zа-яіїєґ0-9_]/gi, "");
    const safeName = name.replace(/[^a-zа-яіїєґ0-9]/gi, "_");

    a.download = `ДЗ_${safeTopic}_${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = "✅ Успішно збережено!";
    saveBtn.style.backgroundColor = "mediumseagreen";
    saveBtn.style.borderColor = "mediumseagreen";
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.style.backgroundColor = "";
      saveBtn.style.borderColor = "";
    }, 3000);
  });

  // --- 5. КОПІЮВАННЯ ТЕКСТУ ---
  copyBtn.addEventListener("click", () => {
    const { isValid, outputText } = collectAndValidate();

    if (!isValid) {
      errorMsg.style.display = "block";
      document
        .querySelector(".error-highlight")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "✅ Скопійовано!";
      setTimeout(() => (copyBtn.innerHTML = originalText), 2000);
    });
  });

  // --- 6. ОЧИЩЕННЯ ФОРМИ ---
  clearBtn.addEventListener("click", () => {
    if (
      confirm(
        "Ти впевнений, що хочеш видалити ВСІ свої відповіді і почати заново?",
      )
    ) {
      localStorage.removeItem(formStorageKey);
      hwForm.querySelectorAll(".custom-editor-wrapper").forEach((wrapper) => {
        localStorage.removeItem("wu_code_" + pageId + "_" + wrapper.id);
      });
      window.location.reload();
    }
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// ✅ 16. ЧЕКБОКСИ КАРТОК СТИЛІВ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".style-card-checkbox");
  if (checkboxes.length === 0) return;

  const pageId = window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
  const storageKey = "wu_stylecards_checked_" + pageId;

  // Функція перевірки, чи виконана вся картка
  const checkCardCompletion = (card) => {
    const cardCheckboxes = card.querySelectorAll(".style-card-checkbox");
    // Перевіряємо, чи всі чекбокси всередині цієї картки відмічені
    const allChecked = Array.from(cardCheckboxes).every((cb) => cb.checked);

    if (allChecked && cardCheckboxes.length > 0) {
      card.classList.add("completed");
    } else {
      card.classList.remove("completed");
    }
  };

  // 1. Відновлюємо стан після оновлення сторінки
  const savedState = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
  checkboxes.forEach((cb, index) => {
    if (savedState.includes(index)) {
      cb.checked = true;
    }
  });

  // Перевіряємо всі картки відразу після завантаження сторінки
  const allCards = document.querySelectorAll(".style-card");
  allCards.forEach(checkCardCompletion);

  // 2. Зберігаємо новий стан при кожному кліку та оновлюємо вигляд
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const checkedIndices = [];
      checkboxes.forEach((box, i) => {
        if (box.checked) checkedIndices.push(i);
      });
      sessionStorage.setItem(storageKey, JSON.stringify(checkedIndices));

      // Оновлюємо дизайн лише тієї картки, в якій ми щойно клікнули
      const parentCard = cb.closest(".style-card");
      if (parentCard) checkCardCompletion(parentCard);
    });
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🗺️ 17. ІНТЕРАКТИВНІ ЗОНИ (HOTSPOTS)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  // Якщо на цій сторінці немає зон — скрипт просто нічого не робить
  if (!window.pageHotspots) return;

  // Проходимося по кожному макету (наприклад, "mario-mockup")
  Object.keys(window.pageHotspots).forEach((mockupId) => {
    const container = document.getElementById(mockupId);

    // Якщо контейнер з таким ID є на сторінці:
    if (container) {
      const hotspotsData = window.pageHotspots[mockupId];

      // Генеруємо div'и
      hotspotsData.forEach((data) => {
        const div = document.createElement("div");
        div.className = "hotspot";
        if (data.extraClass) {
          div.classList.add(data.extraClass);
        }

        div.style.top = data.top;
        div.style.left = data.left;
        div.style.width = data.w;
        div.style.height = data.h;
        div.setAttribute("data-tag", data.tag);

        container.appendChild(div);
      });
    }
  });
});

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 🗺️ 18. АВТОГЕНЕРАЦІЯ НАВІГАЦІЇ (TOC)
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
document.addEventListener("DOMContentLoaded", () => {
  // 1. Знаходимо всі блоки контенту (акордеони або звичайні секції)
  const contentBlocks = document.querySelectorAll(
    ".accordion__content, .lesson-content",
  );

  contentBlocks.forEach((block) => {
    // 2. Шукаємо всі <h3> з id всередині поточного блоку
    const headers = block.querySelectorAll("h3[id]");

    // 3. Якщо заголовки знайдено — створюємо меню
    if (headers.length > 0) {
      const tocBox = document.createElement("div");
      tocBox.className = "toc-box";

      const tocTitle = document.createElement("h4");
      tocTitle.className = "toc-title";
      tocTitle.textContent = "Навігація";
      tocBox.appendChild(tocTitle);

      const nav = document.createElement("nav");
      nav.className = "subsection-nav";
      const ul = document.createElement("ul");

      headers.forEach((header) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#" + header.id;
        a.textContent = header.textContent.trim();
        li.appendChild(a);
        ul.appendChild(li);
      });

      nav.appendChild(ul);
      tocBox.appendChild(nav);

      // 4. Вставляємо меню перед найпершим заголовком у блоці
      const firstHeader = headers[0];
      firstHeader.parentNode.insertBefore(tocBox, firstHeader);

      // 5. ⚡️ ДОДАЄМО РОЗДІЛЮВАЧ (hr) ПІСЛЯ МЕНЮ
      const separator = document.createElement("hr");
      // Вставляємо hr відразу після tocBox
      tocBox.parentNode.insertBefore(separator, tocBox.nextSibling);
    }
  });
});
