async function getLessonInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = +urlParams.get('id');

  const [lessonsDataResponse, lessonInfoResponse, lessonsMediaResponse] = await Promise.all([
    fetch('../assets/json/lessons-data.json'),
    fetch('../assets/json/lesson-info.json'),
    fetch('../assets/json/lessons-media.json')
  ]);

  const [lessonsData, lessonInfo, lessonsMedia] = await Promise.all([
    lessonsDataResponse.json(),
    lessonInfoResponse.json(),
    lessonsMediaResponse.json()
  ]);

  const lesson = lessonsData.find(lesson => lesson.id === lessonId);
  return { lesson, lessonInfo, lessonsData, lessonsMedia };
}

let addMediaBtn = document.getElementById('add-media-btn');

addMediaBtn.addEventListener('click', function () {
  let mediaModal = new bootstrap.Modal(document.getElementById('mediaModal'));
  mediaModal.show();
});
const modalCardsContent = document.getElementById('modalCardsContent');
let mediaModal = new bootstrap.Modal(document.getElementById('mediaModal'));
let mediaModalCards = new bootstrap.Modal(document.getElementById('mediaModalCards'))

window.onload = function () {
  mediaModal.show();
}

const firstCard = document.querySelector('#mediaModal .card:first-child');
firstCard.addEventListener('click', function () {
  mediaModal.hide();
  mediaModalCards.show();
});

function displayLessonInfo(lessons, lessonInfo, lesson) {
  modalCardsContent.innerHTML = '';
  lessons.forEach(lesson => {
    modalCardsContent.innerHTML += `
      <div class="col mb-3" title="add Media">
        <div class="card" id="media" data-lesson-id="${lesson.id}">
          <img src="${lesson.image}" class="object-fit w-100" alt="..." />
          <div class="card-body">
            <p class="card-text text-body-secondary">
              <span>${lesson.subject}</span>
            </p>
          </div>
        </div>
      </div>
    `;
  });

  const mediaCards = document.querySelectorAll('#media');
  mediaCards.forEach(card => {
    card.addEventListener('click', function () {
      const lessonId = +card.getAttribute('data-lesson-id');
      const clickedLesson = lessons.find(lesson => lesson.id === lessonId);
      if (clickedLesson) {
        lessonInfo.push(clickedLesson);
        displayLessonData(lesson, lessonInfo);
      }
    });
  });

  const deleteButtons = document.querySelectorAll('#delete-media');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      // event.stopPropagation(); // Prevent card click event from firing
      const lessonId = +button.getAttribute('data-lesson-id');
      const index = lessonInfo.findIndex(lesson => lesson.id === lessonId);
      if (index !== -1) {
        lessonInfo.splice(index, 1);
        displayLessonData(lesson, lessonInfo);
      }
    });
  });

}

(async function displayTitle() {
  const { lesson } = await getLessonInfo();
  const lessonTitle = document.getElementById('lessons-title');
  lessonTitle.innerHTML = `<span class="fw-bold">${lesson.title} | ${lesson.class}</span>`;
})();

function displayLessonData(lesson, lessonInfo) {
  const lessonTitle = document.getElementById('lessons-title');
  const lessonData1 = document.getElementById('lesson-data-1');
  const lessonData2 = document.getElementById('lesson-data-2');

  if (!lessonTitle || !lessonData1 || !lessonData2) {
    console.error('One or more required elements not found.');
    return;
  }

  let lessonTitleHtml = `<span class="fw-bold">${lesson.title} | ${lesson.class}</span>`;
  lessonTitle.innerHTML = lessonTitleHtml;

  lessonData1.innerHTML = '';

  // loop through the lesson data and display it on the page
  lessonInfo.forEach((data) => {
    let lessonDataHtml = `
      <div class="swiper-slide">
        <div>
        <span class="px-2 px-1 bg-light-green text-start text-white d-block w-100 pe-clicked">
        <span id="delete-media" data-lesson-id="${data.id}">
        <i class="fa-solid fa-trash-can fa-fw me-2"></i>
        </span>
        <span id="move-media">
        <i class="fa-solid fa-up-down-left-right fa-fw"></i>
        </span>
        </span>
          <img
            src="${data.image}"
            alt="Lesson Image"
            class="img-fluid"
          />
        </div>
      </div>
    `;
    lessonData1.innerHTML += lessonDataHtml;
  });

  lessonData2.innerHTML = '';
  lessonInfo.forEach((data) => {
    lessonData2.innerHTML += `
    <div class="swiper-slide">
    <h3 class="text-center mt-3">${data.question}</h3>
      <div class="row">
        <div class="image-container col">
          <img
            src="${data['img-1']}"
            alt="Lesson Image"
            class="img-fluid"
          />
          <div
            class="dropzone mx-auto mt-3"
            id="dropzone1"
            data-answer="answer1"
          ></div>
        </div>
        <div class="image-container col">
          <img
            src="${data['img-2']}"
            alt="Lesson Image"
            class="img-fluid"
          />
          <div
            class="dropzone mx-auto mt-3"
            id="dropzone2"
            data-answer="answer2"
          ></div>
        </div>
      </div>
      <div class="answers mt-5">
        <div class="row">
          <div class="col-3">
            <div
              class="draggable"
              data-correct="${data['answer-1']['correct'] ? 'answer1' : 'no-drop'}"
              draggable="true"
            >
              ${data['answer-1']['text']}
            </div>
          </div>
          <div class="col-3">
            <div
              class="draggable"
              data-correct="${data['answer-2']['correct'] ? 'answer2' : 'no-drop'}"
              draggable="true"
            >
              ${data['answer-2']['text']}
            </div>
          </div>
          <div class="col-3">
            <div
              class="draggable"
              data-correct="${data['answer-3']['correct'] ? 'answer1' : 'no-drop'}"
              draggable="true"
            >
              ${data['answer-3']['text']}
            </div>
          </div>
          <div class="col-3">
            <div
              class="draggable"
              data-correct="${data['answer-4']['correct'] ? 'answer2' : 'no-drop'}"
              draggable="true"
            >
              ${data['answer-4']['text']}
            </div>
          </div>
        </div>
      </div>
      </div>
    `;
  });
}

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 10,
  slidesPerView: 3,
  freeMode: true,
  watchSlidesProgress: true,
  direction: "vertical",
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
  touchRatio: 0,
  autoHeight: true,
});
var swiper2 = new Swiper(".mySwiper2", {
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
  touchRatio: 0,
  autoHeight: true,
});

// Initialize interact.js
// Initialize the drag-and-drop functionality for draggable elements
interact('.draggable').draggable({
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  inertia: true,
  autoScroll: true,
  onmove: dragMoveListener
});

// Function to handle drag movement
function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // Update the position attributes
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// Reset the position attributes on dragend
interact('.draggable').on('dragend', function (event) {
  event.target.removeAttribute('data-x');
  event.target.removeAttribute('data-y');
  event.target.style.transform = 'none';
});

// Initialize the dropzones
interact('.dropzone').dropzone({
  accept: '.draggable',
  overlap: 0.75,

  ondropactivate: function (event) {
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    let dataCorrect = draggableElement.getAttribute('data-correct');
    let dropzoneAnswer = dropzoneElement.getAttribute('data-answer');

    // Check if the dragged element has the correct answer for this dropzone
    if (dataCorrect === dropzoneAnswer) {
      // clone the draggable element
      const clone = draggableElement.cloneNode(true);
      // remove the attributes from the clone
      clone.removeAttribute('data-x');
      clone.removeAttribute('data-y');
      clone.removeAttribute('class');
      clone.style.transform = 'none';
      if (dropzoneElement.childElementCount <= 0) {
        dropzoneElement.appendChild(clone);
      }
    }

    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
  },
  ondrop: function (event) {
    const draggableElement = event.relatedTarget;
    const clone = draggableElement.cloneNode(true);
    clone.classList.remove('can-drop', 'dragging');
    event.target.appendChild(clone);
  },
  ondropdeactivate: function (event) {
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

async function initializePage() {
  const { lesson, lessonsMedia, lessonInfo } = await getLessonInfo();
  displayLessonInfo(lessonsMedia, lessonInfo, lesson);
  displayLessonData(lesson, lessonInfo)

  const filterSelects = document.querySelectorAll('.form-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      const typeFilter = document.querySelector('#type-filter').value;
      const subjectFilter = document.querySelector('#subject-filter').value;
      const ageFilter = document.querySelector('#age-filter').value;

      let filteredLessons = lessonsMedia.filter(lesson => {
        return (
          (typeFilter === 'all' || lesson.type === typeFilter) &&
          (subjectFilter === 'all' || lesson.subject === subjectFilter) &&
          (ageFilter === 'all' || lesson.age.toString() === ageFilter)
        );
      });
      displayLessonInfo(filteredLessons, lessonInfo, lesson);
    });
  });
}

initializePage();
