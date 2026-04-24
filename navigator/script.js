// ==========================================
// 1. Завантаження JSON
// ==========================================
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

// ==========================================
// 2. Створення HTML
// ==========================================
function createLessonsHTML(lessons) {
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
  const lessonsHTML = createLessonsHTML(course.Lessons);

  const isUnlocked =
    localStorage.getItem(`unlocked_${course.CourseId}`) === "true";
  const icon = isUnlocked ? "✦" : "🔒";

  // Логіка: якщо розблоковано, робимо назву курсу посиланням
  let titleSpan = `<span class="accent">${course.CourseTitle}</span>`;

  if (isUnlocked) {
    // Додаємо onClick="event.stopPropagation()", щоб клік по посиланню не згортав акордеон
    titleSpan = `
      <a href="course.html?id=${course.CourseId}" target="_blank" rel="noopener noreferrer" class="course-link" title="Відкрити на окремій сторінці" onclick="event.stopPropagation()">
        ${titleSpan} <span class="fly-icon">↗️</span>
      </a>`;
  }

  const headerContent = course.IsOld
    ? `<span class="star">${icon}</span> ${titleSpan}`
    : `<span class="star">${icon}</span> Курс ${course.CourseIndex}: ${titleSpan}`;

  return `
    <details class="accordion__item" name="accordion" data-course-id="${course.CourseId}">
        <summary class="accordion__header">
            <div>${headerContent}</div>
            <span class="acc-arrow">▶</span>
        </summary>
        <div class="accordion__content">
            <nav><ul>${lessonsHTML}</ul></nav>
        </div>
    </details>
  `;
}

// ==========================================
// 3. Відображення
// ==========================================
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

// ==========================================
// 4. Модальні вікна паролів для курсів
// ==========================================
function setupPasswordModals(courses) {
  const modal = document.querySelector("#password-modal");
  const passwordInput = document.querySelector("#password-input");
  const errorText = document.querySelector("#password-error");
  const cancelBtn = document.querySelector("#cancel-btn");
  const submitBtn = document.querySelector("#submit-btn");

  let currentTargetCourse = null;

  const allSummaries = document.querySelectorAll(
    "details.accordion__item summary",
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

    // Знаходимо конкретний курс у масиві JSON за ID
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

      // МИТТЄВЕ ДОДАВАННЯ ПОСИЛАННЯ:
      const accentSpan = currentTargetCourse.querySelector(".accent");
      if (
        accentSpan &&
        !accentSpan.parentElement.classList.contains("course-link")
      ) {
        const link = document.createElement("a");
        link.href = `course.html?id=${courseId}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "course-link";
        link.title = "Відкрити на окремій сторінці";
        link.onclick = (e) => e.stopPropagation();
        link.innerHTML =
          accentSpan.outerHTML + ' <span class="fly-icon">↗️</span>';
        accentSpan.replaceWith(link);
      }

      modal.close();
      currentTargetCourse.open = true;
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

// ==========================================
// 5. ЛОГІКА: Глобальне модальне вікно
// ==========================================
function setupGlobalModal(correctPassword, coursesData) {
  const globalModal = document.querySelector("#global-password-modal");
  const globalInput = document.querySelector("#global-password-input");
  const globalSubmit = document.querySelector("#global-submit-btn");
  const globalError = document.querySelector("#global-password-error");

  // ВАЖЛИВО: Прибираємо "завісу", щоб вона не перекривала вікно пароля
  document.body.classList.add("is-loaded");

  globalModal.addEventListener("cancel", (e) => {
    e.preventDefault();
  });

  globalModal.showModal();
  globalInput.focus();

  function checkGlobalPassword() {
    if (globalInput.value === correctPassword) {
      // Використовуйте localStorage, щоб сайт "пам'ятав" вхід
      localStorage.setItem("global_unlocked", "true");
      globalModal.close();
      renderMenu(coursesData);
      setupPasswordModals(coursesData);
    } else {
      globalError.style.display = "block";
    }
  }

  globalSubmit.addEventListener("click", checkGlobalPassword);
  globalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkGlobalPassword();
  });
}

// ==========================================
// 6. ІНІЦІАЛІЗАЦІЯ
// ==========================================
async function init() {
  const data = await fetchCourseData();

  if (!data || !data.courses) {
    // Якщо дані не завантажились, прибираємо завісу, щоб показати помилку
    document.body.classList.add("is-loaded");
    document.getElementById("current-courses-container").innerHTML =
      "<p style='color: red;'>Помилка завантаження бази даних.</p>";
    return;
  }

  const isGlobalUnlocked = localStorage.getItem("global_unlocked");

  if (isGlobalUnlocked !== "true") {
    // Показуємо вікно, якщо раніше не входили
    setupGlobalModal(data.globalPassword, data.courses);
  } else {
    // Вже входили — малюємо меню і прибираємо завісу
    renderMenu(data.courses);
    setupPasswordModals(data.courses);
    document.body.classList.add("is-loaded");
  }
}

init();
