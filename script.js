let draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");
let state = { todo: [], backlog: [], inprogress: [], complete: [] };
let taskID;
let destination;
//brute force mf
const stateUpdate = (state, destination, taskID) => {
  const complete = document.querySelectorAll("#complete p");
  const todo = document.querySelectorAll("#todo p");
  const backlog = document.querySelectorAll("#backlog p");
  const inprogress = document.querySelectorAll("#inprogress p");
  //loop through all confirm it is not there
  for (const [key, value] of Object.entries(state)) {
    updatedArray = [...state[key].filter((item) => parseInt(item.id) !== parseInt(taskID))];
    state[key] = [...updatedArray];
  }
  if (destination === "complete") {
    state.complete = [];
    complete.forEach((element) => {
      state.complete.push({ id: element.id, name: element.innerHTML });
    });
  }

  if (destination === "backlog") {
    state.backlog = [];
    backlog.forEach((element) => {
      state.backlog.push({ id: element.id, name: element.innerHTML });
    });
  }
  if (destination === "todo") {
    state.todo = [];
    todo.forEach((element) => {
      state.todo.push({ id: element.id, name: element.innerHTML });
    });
  }
  if (destination === "inprogress") {
    state.inprogress = [];
    inprogress.forEach((element) => {
      state.inprogress.push({ id: element.id, name: element.innerHTML });
    });
  }
  localStorage.setItem("trelloclone.state", JSON.stringify(state));
};
const initLogic = (draggables, containers) => {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      stateUpdate(state, destination, taskID);
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
};

initLogic(draggables, containers);

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  taskID = container.querySelector(".dragging")?.id;
  destination = container.id; //console.log(container);

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}



function addItem(e) {
  console.log(e.target);
  e.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling.classList.remove("hidden");
}
function submitItem(e) {
  e.preventDefault();
  newObject(e.target.previousElementSibling.value, e.target.parentElement.parentElement.id);
  e.target.parentElement.classList.add("hidden");
  e.target.previousElementSibling.value = "";
}
const newObject = (name, listName) => {
  let id = Date.now();
  state[listName].push({ name, id, comments: [] });
  let newDiv = `<p class="draggable" id="${id}" draggable="true"> ${name}</p>`;

  document.querySelector(`#${listName}`).insertAdjacentHTML("beforeend", newDiv);
  draggables = document.querySelectorAll(".draggable");
  initLogic(draggables, containers);
  localStorage.setItem("trelloclone.state", JSON.stringify(state));
};

const checkStorage = () => {
  if (localStorage.getItem("trelloclone.state")) {
    state = JSON.parse(localStorage.getItem("trelloclone.state"));
    for (const [key, value] of Object.entries(state)) {
      //value is array!
      value.map((item) => {
        document.querySelector(`#${key}`).innerHTML += `<p class="draggable" draggable="true" id=${item.id}>  ${item.name}</p>`;
      });
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  checkStorage();
  const buttons = document.querySelectorAll(".addItem");
const submits = document.querySelectorAll(".submitItem");
for (const button of buttons) {
  button.addEventListener("click", addItem);
}
for (const button of submits) {
  button.addEventListener("click", submitItem);
}
});
