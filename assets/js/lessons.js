async function fetchData() {
  const response = await fetch('../assets/json/lessons-data.json');
  const data = await response.json();
  return data;
}

const lessonsContainer = document.getElementById('lessons');
const paginationContainer = document.getElementById('pagination');

const lessonsPerPage = 10; // Number of lessons to display per page
let currentPage = 1; // Current page number

function displayLessons(lessons) {
  let html = "";
  const startIndex = (currentPage - 1) * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;
  const currentLessons = lessons.slice(startIndex, endIndex);

  currentLessons.forEach(lesson => {
    html += `<div class="col mb-3 fade-in">
    <div class="card">
  <div class="position-relative">
    <div class="position-absolute card-icons bg-icon w-100 px-2 py-1">
      <span class="text-white">
        <span data-bs-toggle="modal" data-bs-target="#edit-lesson-model" id="edit-lesson-btn" >
          <i class="fa-solid fa-pencil fa-fw pe-clicked"></i>
        </span>
        <span data-bs-toggle="modal" data-bs-target="#delete-lesson-model">
        <i class="fa-solid fa-trash-can fa-fw pe-clicked"></i>
        </span>
        <a href="./edit-lesson.html?id=${lesson.id}" class="text-white">
        <i class="fa-solid fa-folder-plus fa-fw pe-clicked"></i>
        </a>
      </span>
    </div>
    <a href="./lesson-info.html?id=${lesson.id}" class="text-decoration-none">
      <img src="${lesson.image}" class="object-fit w-100" alt="..." />
    </a>
  </div>
  <div class="card-body">
    <h5 class="card-title fw-bold">${lesson.title}</h5>
    <p class="card-text text-body-secondary d-flex justify-content-xl-between flex-column flex-xl-row">
      <span>${lesson.subject}</span>
      <span>${lesson.date}</span>
    </p>
  </div>
</div>
    </div>`;
  });

  lessonsContainer.innerHTML = html;

  // Wait a moment and then add the active class to trigger the transition
  setTimeout(() => {
    const lessonItems = lessonsContainer.getElementsByClassName('fade-in');
    Array.from(lessonItems).forEach(item => item.classList.add('active'));
  }, 10);
}

function updatePaginationButtons(totalLessons) {
  const totalPages = Math.ceil(totalLessons / lessonsPerPage);
  let paginationHTML = '';

  paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
  </li>`;

  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#" onclick="changePage(${i})">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
  </li>`;

  paginationContainer.innerHTML = paginationHTML;
}

function changePage(pageNumber) {
  currentPage = pageNumber;
  fetchData()
    .then(data => {
      displayLessons(data);
      updatePaginationButtons(data.length);
    })
    .catch(error => {
      console.error(error);
    });
}

fetchData()
  .then(data => {
    displayLessons(data);
    updatePaginationButtons(data.length);
  })
  .catch(error => {
    console.error(error);
  });

// when window is loaded
window.onload = async function () {
  let editLessonBtn = document.querySelectorAll('#edit-lesson-btn');
  let lessonTitle = document.getElementById('lesson-title');
  let lessonSubject = document.getElementById('lesson-subject');
  let lessonStartDate = document.getElementById('lesson-start-date');
  let lessonEndDate = document.getElementById('lesson-end-date');

  let data = await fetchData();

  editLessonBtn.forEach((btn, index) => {
    btn.addEventListener('click', function () {
      console.log(data[index]);
      lessonTitle.value = data[index].title;
      lessonSubject.innerHTML = `
        <option value="${data[index].subject}" selected>${data[index].subject}</option>
        `
      lessonStartDate.setAttribute("value", data[index]["startDate"])
      lessonEndDate.setAttribute("value", data[index]["endDate"])
    });
  });
}