// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 1. Завантаження JSON
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
async function fetchCourseData() {
  try {
    const response = await fetch("courses.json");
    if (!response.ok) throw new Error("Failed to fetch courses");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 2. Створення HTML
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function createLessonsHTML(lessons) {
  if (!lessons) return "";
  return lessons
    .map(
      (lesson) => `
    <li>
        <a href="${lesson.Url}">
            <span class="hollow-text">${lesson.Num}</span>
            ${lesson.Title}
        </a>
    </li>
  `,
    )
    .join("");
}

function createCourseHTML(course) {
  const isUnlocked =
    localStorage.getItem(`unlocked_${course.CourseId}`) === "true";
  const icon = isUnlocked ? "✦" : "🔒";

  const titleSpan = `<span class="accent">${course.CourseTitle}</span>`;

  const headerContent = course.IsOld
    ? `<span class="star">${icon}</span> ${titleSpan}`
    : `<span class="star">${icon}</span> Курс ${course.CourseIndex}: ${titleSpan}`;

  let contentHTML = "";

  // ⚡️ Зчитуємо збережені стани з sessionStorage
  const savedCourse = sessionStorage.getItem("openCourse");
  const savedPart = sessionStorage.getItem(`openPart_${course.CourseId}`);

  // Відкриваємо головний курс, тільки якщо він розблокований і був відкритий до оновлення
  const isCourseOpen =
    savedCourse === course.CourseId && isUnlocked ? "open" : "";

  // ЛОГІКА: Якщо курс поділено на частини (Parts)
  if (course.Parts && course.Parts.length > 0) {
    contentHTML = course.Parts.map((part, index) => {
      // Відкриваємо збережену частину, або першу за замовчуванням
      const isPartOpen =
        savedPart !== null ? index.toString() === savedPart : index === 0;

      return `
        <details class="sub-accordion" data-group="parts_${course.CourseId}" data-part-index="${index}" ${isPartOpen ? "open" : ""}>
          <summary class="sub-header">
            <div><h3 class="sub-part-title">${part.PartTitle}</h3></div>
            <span class="acc-arrow">▶</span>
          </summary>
          <div class="sub-accordion-content">
            <nav><ul>${createLessonsHTML(part.Lessons)}</ul></nav>
          </div>
        </details>
      `;
    }).join("");
  }
  // ЛОГІКА: Старий формат (Lessons)
  else if (course.Lessons) {
    contentHTML = `<nav><ul>${createLessonsHTML(course.Lessons)}</ul></nav>`;
  }

  return `
    <details class="accordion__item" name="accordion" data-course-id="${course.CourseId}" ${isCourseOpen}>
        <summary class="accordion__header">
            <h2>${headerContent}</h2>
            <span class="acc-arrow">▶</span>
        </summary>
        <div class="accordion__content">
            ${contentHTML}
        </div>
    </details>
  `;
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 3. Відображення
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function renderMenu(courses) {
  const currentContainer = document.querySelector("#current-courses-container");
  const oldContainer = document.querySelector("#old-courses-container");

  courses.forEach((course) => {
    const courseHTML = createCourseHTML(course);
    if (course.IsOld) {
      oldContainer.insertAdjacentHTML("beforeend", courseHTML);
    } else {
      currentContainer.insertAdjacentHTML("beforeend", courseHTML);
    }
  });
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 4. Модальні вікна паролів для курсів
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function setupPasswordModals(courses) {
  const modal = document.querySelector("#password-modal");
  const passwordInput = document.querySelector("#password-input");
  const errorText = document.querySelector("#password-error");
  const cancelBtn = document.querySelector("#cancel-btn");
  const submitBtn = document.querySelector("#submit-btn");

  let currentTargetCourse = null;

  const allSummaries = document.querySelectorAll(
    "section.accordion > details.accordion__item > summary",
  );

  allSummaries.forEach((summary) => {
    summary.addEventListener("click", (e) => {
      const detailsElement = summary.parentElement;
      const courseId = detailsElement.getAttribute("data-course-id");
      const isUnlocked =
        localStorage.getItem(`unlocked_${courseId}`) === "true";

      if (isUnlocked) return;

      e.preventDefault();
      currentTargetCourse = detailsElement;
      passwordInput.value = "";
      errorText.style.display = "none";
      modal.showModal();
      passwordInput.focus();
    });
  });

  cancelBtn.addEventListener("click", () => {
    modal.close();
    currentTargetCourse = null;
  });

  function checkPassword() {
    if (!currentTargetCourse) return;

    const courseId = currentTargetCourse.getAttribute("data-course-id");
    const targetCourseData = courses.find((c) => c.CourseId === courseId);

    if (!targetCourseData) {
      console.error("Курс не знайдено в базі даних!");
      return;
    }

    const correctPassword = targetCourseData.CoursePassword;

    if (passwordInput.value === correctPassword) {
      localStorage.setItem(`unlocked_${courseId}`, "true");

      const icon = currentTargetCourse.querySelector(".star");
      if (icon) icon.textContent = "✦";

      modal.close();
      currentTargetCourse.open = true; // Це автоматично запустить подію "toggle" і збереже курс
      currentTargetCourse = null;
    } else {
      errorText.style.display = "block";
    }
  }

  submitBtn.addEventListener("click", checkPassword);
  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPassword();
  });
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 5. ЛОГІКА: Глобальне модальне вікно
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function setupGlobalModal(correctPassword, coursesData) {
  const globalModal = document.querySelector("#global-password-modal");
  const globalInput = document.querySelector("#global-password-input");
  const globalSubmit = document.querySelector("#global-submit-btn");
  const globalError = document.querySelector("#global-password-error");

  document.body.classList.add("is-loaded");

  globalModal.addEventListener("cancel", (e) => {
    e.preventDefault();
  });

  globalModal.showModal();
  globalInput.focus();

  function checkGlobalPassword() {
    if (globalInput.value === correctPassword) {
      localStorage.setItem("global_unlocked", "true");
      globalModal.close();
      renderMenu(coursesData);
      setupPasswordModals(coursesData);
      setupSmoothSubAccordions();
      setupStateSaving(); 
    } else {
      globalError.style.display = "block";
    }
  }

  globalSubmit.addEventListener("click", checkGlobalPassword);
  globalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkGlobalPassword();
  });
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 6. Плавна анімація внутрішніх акордеонів
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function setupSmoothSubAccordions() {
  const subSummaries = document.querySelectorAll(".sub-header");

  subSummaries.forEach((summary) => {
    summary.addEventListener("click", (e) => {
      e.preventDefault();

      const currentDetail = summary.closest(".sub-accordion");
      const content = currentDetail.querySelector(".sub-accordion-content");

      const groupName = currentDetail.getAttribute("data-group");
      const courseId = groupName.replace("parts_", ""); // Отримуємо ID курсу для sessionStorage
      const partIndex = currentDetail.getAttribute("data-part-index");

      // 1. Анімуємо закриття інших відкритих частин
      const groupDetails = document.querySelectorAll(
        `.sub-accordion[data-group="${groupName}"]`,
      );
      groupDetails.forEach((detail) => {
        if (detail !== currentDetail && detail.hasAttribute("open")) {
          const otherContent = detail.querySelector(".sub-accordion-content");

          otherContent.style.height = otherContent.scrollHeight + "px";
          otherContent.style.opacity = "1";

          setTimeout(() => {
            otherContent.style.height = "0px";
            otherContent.style.opacity = "0";
          }, 10);

          setTimeout(() => {
            detail.removeAttribute("open");
            otherContent.style.height = "";
            otherContent.style.opacity = "";
          }, 300);
        }
      });

      // 2. Анімуємо поточну вкладку та ЗБЕРІГАЄМО СТАН
      if (currentDetail.hasAttribute("open")) {
        // Закриваємо
        sessionStorage.removeItem(`openPart_${courseId}`);

        content.style.height = content.scrollHeight + "px";
        content.style.opacity = "1";

        setTimeout(() => {
          content.style.height = "0px";
          content.style.opacity = "0";
        }, 10);

        setTimeout(() => {
          currentDetail.removeAttribute("open");
          content.style.height = "";
          content.style.opacity = "";
        }, 300);
      } else {
        // Відкриваємо
        sessionStorage.setItem(`openPart_${courseId}`, partIndex);

        currentDetail.setAttribute("open", "");
        content.style.height = "0px";
        content.style.opacity = "0";

        setTimeout(() => {
          content.style.height = content.scrollHeight + "px";
          content.style.opacity = "1";
        }, 10);

        setTimeout(() => {
          content.style.height = "";
          content.style.opacity = "";
        }, 300);
      }
    });
  });
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 7. Збереження стану головних курсів
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
function setupStateSaving() {
  const outerDetails = document.querySelectorAll(".accordion__item");
  outerDetails.forEach((detail) => {
    // Подія "toggle" спрацьовує, коли <details> відкривається або закривається
    detail.addEventListener("toggle", () => {
      const courseId = detail.getAttribute("data-course-id");
      if (detail.open) {
        sessionStorage.setItem("openCourse", courseId);
      } else {
        // Видаляємо з пам'яті лише якщо закрився саме той курс, який ми запам'ятали
        if (sessionStorage.getItem("openCourse") === courseId) {
          sessionStorage.removeItem("openCourse");
        }
      }
    });
  });
}

// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
// 8. ІНІЦІАЛІЗАЦІЯ
// ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦ - ✦
async function init() {
  const data = await fetchCourseData();

  if (!data || !data.courses) {
    document.body.classList.add("is-loaded");
    document.getElementById("current-courses-container").innerHTML =
      "<p style='color: red;'>Помилка завантаження бази даних.</p>";
    return;
  }

  const isGlobalUnlocked = localStorage.getItem("global_unlocked");

  if (isGlobalUnlocked !== "true") {
    setupGlobalModal(data.globalPassword, data.courses);
  } else {
    renderMenu(data.courses);
    setupPasswordModals(data.courses);
    setupSmoothSubAccordions();
    setupStateSaving(); 
    document.body.classList.add("is-loaded");
  }
}

init();
