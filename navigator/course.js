document.addEventListener("DOMContentLoaded", async () => {
  // 1. Отримуємо ID курсу з URL (з адреси сторінки)
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  const container = document.getElementById("single-course-container");

  // Якщо ID немає в посиланні (хтось просто відкрив course.html)
  if (!courseId) {
    container.innerHTML = "<p>Помилка: Курс не вибрано.</p>";
    // Знімаємо завісу, щоб показати помилку
    document.body.classList.add("is-loaded");
    return;
  }

  try {
    // 2. Завантажуємо дані з JSON
    const response = await fetch("courses.json");
    const data = await response.json();

    // 3. Шукаємо потрібний курс
    const course = data.courses.find((c) => c.CourseId === courseId);

    if (course) {
      // (Опціонально) Оновлюємо заголовок сторінки
      document.querySelector("header h1").textContent = course.CourseTitle;

      document.title = `Курс: ${course.CourseTitle}`;

      // 4. Генеруємо HTML для уроків
      const lessonsHTML = course.Lessons.map(
        (lesson) => `
        <li>
            <a href="${lesson.Url}">
                <span class="hollow-text">${lesson.Num}</span>
                ${lesson.Title}
            </a>
        </li>
      `,
      ).join("");

      // Вставляємо згенерований список (ul) у контейнер
      container.innerHTML = `<nav><ul>${lessonsHTML}</ul></nav>`;
    } else {
      container.innerHTML = "<p>Помилка: Курс не знайдено у базі даних.</p>";
    }
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
    container.innerHTML = "<p>Помилка завантаження бази даних.</p>";
  } finally {
    // 5. Обов'язково знімаємо "завісу" завантаження
    document.body.classList.add("is-loaded");
  }
});
