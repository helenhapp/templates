// 1. DATA: Fetching JSON
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

// 2. TEMPLATING: Building HTML
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
  const icon = isUnlocked ? "✧" : "🔒"; // Show a lock if it requires a password

  const headerContent = course.IsOld
    ? `<span class="star">${icon}</span> <span class="accent">${course.CourseTitle}</span>`
    : `<span class="star">${icon}</span> Курс ${course.CourseIndex}: <span class="accent">${course.CourseTitle}</span>`;

  return `
    <details class="accordion__item" name="accordion" data-course-id="${course.CourseId}" data-password="${course.CoursePassword}">
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

// 3. RENDERING
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

// 4. LOGIC: Password Modal Setup
function setupPasswordModals() {
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
    });
  });

  cancelBtn.addEventListener("click", () => {
    modal.close();
    currentTargetCourse = null;
  });

  function checkPassword() {
    if (!currentTargetCourse) return;

    const courseId = currentTargetCourse.getAttribute("data-course-id");
    const correctPassword = currentTargetCourse.getAttribute("data-password");

    if (passwordInput.value === correctPassword) {
      localStorage.setItem(`unlocked_${courseId}`, "true");

      const icon = currentTargetCourse.querySelector(".star");
      if (icon) icon.textContent = "✧";

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

// 5. Function that brings it all together
async function init() {
  // 1. Global Page Lock Check 
  const isGlobalUnlocked = localStorage.getItem("global_unlocked");
  if (!isGlobalUnlocked) {
    const globalPass = prompt("Введіть загальний пароль сайту:");
    if (globalPass === "0000") {
      localStorage.setItem("global_unlocked", "true");
    } else {
      document.body.innerHTML =
        "<h2 style='text-align:center; margin-top:20vh;'>Доступ заборонено. Оновіть сторінку.</h2>";
      return;
    }
  }

  // 2. Fetch and Render Courses 
  const courses = await fetchCourseData();

  if (courses) {
    renderMenu(courses);

    // 3. Attach modal logic AFTER elements exist on the screen 
    setupPasswordModals();
  } else {
    document.getElementById("current-courses-container").innerHTML =
      "<p style='color: red;'>Помилка завантаження курсів.</p>";
  }
}

// Start the app
init();
