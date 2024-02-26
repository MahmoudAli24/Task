
// get lesson info from the URL and display it on the page
async function getLessonInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = +urlParams.get('id');

  const [lessonsDataResponse, lessonInfoResponse] = await Promise.all([
    fetch('../assets/json/lessons-data.json'),
    fetch('../assets/json/lesson-info.json')
  ]);

  const [lessonsData, lessonInfo] = await Promise.all([
    lessonsDataResponse.json(),
    lessonInfoResponse.json()
  ]);

  const lesson = lessonsData.find(lesson => lesson.id === lessonId);

  displayLessonInfo(lesson, lessonInfo);
}


function displayLessonInfo(lesson, lessonInfo) {
  const lessonTitle = document.getElementById('lessons-title');
  console.log(lessonTitle);
  const lessonData1 = document.getElementById('lesson-data-1');
  const lessonData2 = document.getElementById('lesson-data-2');
  console.log(lessonData1, lessonData2);

  if (!lessonTitle || !lessonData1 || !lessonData2) {
    console.error('One or more required elements not found.');
    return;
  }

  let lessonTitleHtml = `<span class="fw-bold">${lesson.title} | ${lesson.class}</span>`;
  lessonTitle.innerHTML = lessonTitleHtml;

  // loop through the lesson data and display it on the page
  lessonInfo.forEach((data) => {
    let lessonDataHtml = `
      <div class="swiper-slide">
        <img
          src="${data.image}"
          alt="Lesson Image"
          class="img-fluid"
        />
      </div>
    `;
    lessonData1.innerHTML += lessonDataHtml;
  });

  lessonInfo.forEach((data) => {
    let lessonDataHtml = `
    <div class="swiper-slide">
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
    lessonData2.innerHTML += lessonDataHtml;
  });
}


getLessonInfo();


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
