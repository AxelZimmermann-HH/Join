let subtasks = [];
let selectedContacts = [];

const contactDropdown = document.getElementById("add-task-contacts");
const categoryDropdown = document.getElementById("category");

function standardButton() {
  document.getElementById("mediumButton").classList.add("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium-white.svg";
}

function highButton() {
  //select high Button
  document.getElementById("highButton").classList.add("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high-white.svg";
  // remove medium Button
  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";
  //remove low Button
  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

function mediumButton() {
  //select medium Button
  document.getElementById("mediumButton").classList.add("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium-white.svg";
  // remove high Button
  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";
  // remove low Button
  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

function lowButton() {
  //select low Button
  document.getElementById("lowButton").classList.add("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low-white.svg";
  // remove medium Button
  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";
  // remove high Button
  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";
}

function category() {
  let categoryDropdown = document.getElementById("category");
  categoryDropdown.classList.toggle("d-none");

  document.getElementById("category").innerHTML = `<div class="category-options">
  <span onclick="technicalTask()">Technical Task</span>
  <span onclick="userStory()">User Story</span>
  </div>`;
  emptyCategory();
}

function technicalTask() {
  // changing the innerHTML and close the window
  document.getElementById("task-category").innerHTML = "Technical Task";
  document.getElementById("category").style.display = "none";
  document.getElementById("category").innerHTML = "";
  emptyCategory();
}

function userStory() {
  // changing the innerHTML and close the window
  document.getElementById("task-category").innerHTML = "User Story";
  document.getElementById("category").style.display = "none";
  document.getElementById("category").innerHTML = "";
  emptyCategory();
}

function updateDateStyle() {
  let date = document.getElementById("date-input");
  let required = document.getElementById("date-required");
  // checked if the date length is 0 or more
  if (date.value.length === 0) {
    document.getElementById("date-input").style.color = "#d1d1d1";
    date.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (date.value.length > 0) {
    document.getElementById("date-input").style.color = "black";
    date.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

function newSubtask() {
  document.getElementById("subtask-field").addEventListener("keydown", function (press) {
    if (press.key === "Enter") {
      createSubtask();
    }
  });

  let subtaskPlus = document.getElementById("subtask-plus");
  subtaskPlus.classList.add("d-none");

  let closeSubtask = document.getElementById("edit-subtask");
  closeSubtask.classList.remove("d-none");

  document.getElementById("edit-subtask").innerHTML = newSubtaskHTML();
}

function closeSubtask() {
  let input = document.getElementById("subtask-field");
  input.value = "";
  let subtaskPlus = document.getElementById("subtask-plus");
  subtaskPlus.classList.remove("d-none");

  let closeSubtask = document.getElementById("edit-subtask");
  closeSubtask.classList.add("d-none");
}

function createSubtask() {
  let input = document.getElementById("subtask-field");

  if (input.value.trim() === "") {
    return; // Verlasse die Funktion, wenn das Eingabefeld leer ist
  }

  // Füge einen neuen Subtask mit Titel und completed-Status hinzu
  subtasks.push({ title: input.value, completed: false });

  let createSubtask = document.getElementById("create-subtask");
  createSubtask.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    if (input.value != "") {
      createSubtask.innerHTML += createSubtaskHTML(i, subtask);
    }
  }
  input.value = "";
}

function renderSubtasks() {
  let createSubtask = document.getElementById("create-subtask");
  createSubtask.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    createSubtask.innerHTML += renderSubtasksHTML(i, subtask);
  }
}

function changeSubtaskLayer(i) {
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks");
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks:hover");
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks-edit");
}

function changeSubtask(i) {
  let editLogo = document.getElementById(`edit-logo${i}`);
  let editedSubtask = document.getElementById(`subtask-${i}`).innerText;
  let required = document.getElementById("subtask-required");
  let redBorder = document.getElementById(`subtask-tasks${i}`);
  editLogo.src = "add_task_img/check.svg";

  if (editedSubtask === "") {
    required.innerHTML = "";
    redBorder.style.borderBottom = "1px solid #29abe2";
  }

  changeSubtaskLayer(i);
  let createSubtask = document.getElementById(`subtask-${i}`);
  let currentText = subtasks[i].title;

  createSubtask.innerHTML = `
    <div class="subtask-edit">
      <div contenteditable="true" id="subtask-${i}" class="subtask-edit-div">${currentText}</div>
    </div>
  `;
}

function whichSourceSubtask(i) {
  let editLogo = document.getElementById(`edit-logo${i}`);
  if (editLogo.src.endsWith("add_task_img/check.svg")) {
    updateSubtask(i);
  } else {
    changeSubtask(i);
  }
}

function updateSubtaskLayer(i) {
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks");
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks:hover");
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks-edit");
}

function updateSubtask(i) {
  let editedSubtask = document.getElementById(`subtask-${i}`).innerText;
  let editSubtask = editedSubtask.trim();
  let required = document.getElementById("subtask-required");
  let redBorder = document.getElementById(`subtask-tasks${i}`);
  if (editSubtask === "") {
    required.innerHTML = `<div class="title-required">fill out subtask</div>`;
    redBorder.style.borderBottom = "1px solid #ff8190";
  }
  updateSubtaskLayer(i);
  subtasks[i].title = editedSubtask;

  let createSubtask = document.getElementById(`subtask-${i}`);
  createSubtask.innerHTML = `${editedSubtask}`;

  let editLogo = document.getElementById(`edit-logo${i}`);
  editLogo.src = "add_task_img/edit.svg";
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
}

function resetSelectedContacts() {
  selectedContacts = new Array(contactsArray.length).fill(false);
}

function showContactsInAddTask() {
  let userName = sessionStorage.getItem("userName");

  let contactsAddTask = contactsArray
    .map((contact, i) => {
      let checkboxSrc = selectedContacts[i] ? "add_task_img/checkbox-normal-checked.svg" : "add_task_img/checkbox-normal.svg";

      let displayName = contact.name;
      if (contact.name === userName) {
        displayName += " (You)";
      }
      return `<div id="contacts-pos${i}" onclick="checkContacts(${i})" class="contacts-pos">
              <div class="show-task-contact-add-task">
                  <div class="show-task-contact-letters" style="background-color: ${contact.color};">${getInitials(contact.name)}</div>
                  <p>${displayName}</p>
              </div>
              <div class="checkbox">
                  <img id="checkbox-field${i}" src="${checkboxSrc}" alt="">
              </div>
          </div>`;
    })
    .join("");

  let content = document.getElementById("add-task-contacts");
  content.innerHTML = contactsAddTask;

  contactsArray.forEach((contact, i) => {
    let checkboxField = document.getElementById(`checkbox-field${i}`);
    let contactDiv = document.getElementById(`contacts-pos${i}`);

    if (checkboxField.src.includes("checkbox-normal-checked.svg")) {
      checkboxField.src = "add_task_img/checkbox-normal-checked-white.svg";
      contactDiv.classList.add("contacts-pos-highlight");
    }
  });
}

async function initializeAddTask() {
  await fetchDataJson();
  generateInitials();
  standardButton();
}

function showContacts() {
  let contactDropdown = document.querySelector("#add-task-contacts");
  let categoryDropdown = document.querySelector("#category");
  contactDropdown.classList.toggle("d-none");
  showContactsInAddTask();
}

document.addEventListener("DOMContentLoaded", function () {
  addMouseDownListeners();
});

function addMouseDownListeners() {
  document.addEventListener("mousedown", function (event) {
    let contactDropdown = document.querySelector("#add-task-contacts");
    let categoryDropdown = document.querySelector("#category");

    if (contactDropdown && !contactDropdown.contains(event.target) && !event.target.matches(".select-contact")) {
      if (!contactDropdown.classList.contains("d-none")) {
        contactDropdown.classList.add("d-none");
      }
    }

    if (categoryDropdown && !categoryDropdown.contains(event.target) && !event.target.matches(".select-contact")) {
      if (!categoryDropdown.classList.contains("d-none")) {
        categoryDropdown.classList.add("d-none");
      }
    }
  });
}

function showContactsInEdit() {
  showContactsInAddTask();
  contactDropdown.classList.toggle("d-none");
}

function checkContacts(i) {
  let checkboxField = document.getElementById(`checkbox-field${i}`);
  let contactDiv = document.getElementById(`contacts-pos${i}`);

  if (checkboxField.src.includes("checkbox-normal.svg")) {
    checkboxField.src = "add_task_img/checkbox-normal-checked-white.svg";
    contactDiv.classList.add("contacts-pos-highlight");
    selectedContacts[i] = true;
  } else {
    checkboxField.src = "add_task_img/checkbox-normal.svg";
    contactDiv.classList.remove("contacts-pos-highlight");
    contactDiv.classList.remove("no-hover");
    selectedContacts[i] = false;
  }
}

function clearTask() {
  let description = document.getElementById("description-input");
  description.value = "";

  let dueDate = document.getElementById("date-input");
  dueDate.value = "";
  dueDate.style.color = "#d1d1d1";

  document.getElementById("add-task-contacts").classList.add("d-none");

  clearButtons();
  clearSubtasks();

  let taskCategory = document.getElementById("task-category");
  taskCategory.innerText = "Select task category";

  let title = document.getElementById("title-input");
  title.value = "";
}

function clearButtons() {
  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";

  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";

  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

function clearSubtasks() {
  subtasks = [];
  renderSubtasks();
  standardButton();
}

function emptyCategory() {
  let taskCategoryInput = document.getElementById("category-input");
  let taskCategory = document.getElementById("task-category").innerText;
  let required = document.getElementById("category-required");
  if (taskCategory === "Select task category") {
    taskCategoryInput.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (taskCategory === "User Story" || taskCategory === "Technical Task") {
    taskCategoryInput.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

function emptyTitle() {
  let title = document.getElementById("title-input");
  let required = document.getElementById("title-required");
  // checked if the title length is 0 or more
  if (title.value.length === 0) {
    title.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (title.value.length > 0) {
    title.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

function emptyDate() {
  let date = document.getElementById("date-input");
  date.showPicker();
  updateDateStyle();
  document.getElementById("date-input").addEventListener("change", updateDateStyle);
}

function addedToBoard() {
  return new Promise((resolve) => {
    let imgContainer = document.getElementById("added-to-board");
    imgContainer.classList.add("animate");

    // Wait for the transition to end
    imgContainer.addEventListener("transitionend", function handler() {
      // Remove event listener once the animation is done to avoid multiple triggers
      imgContainer.removeEventListener("transitionend", handler);
      resolve();
    });
  });
}

async function createTask(boardCategory) {
  let description = document.getElementById("description-input").value;
  let dueDate = document.getElementById("date-input").value;
  let prio = getSelectedPrio();
  let taskCategory = document.getElementById("task-category").innerText;
  let title = document.getElementById("title-input").value;

  if (title === "" || dueDate === "" || taskCategory === "Select task category") {
    emptyDate();
    emptyTitle();
    emptyCategory();
    return;
  }

  await addedToBoard();

  // Erstelle das contacts Objekt basierend auf ausgewählten Kontakten
  let selectedContactsData = selectedContacts.reduce((acc, isSelected, index) => {
    if (isSelected) {
      acc[`contact${index + 1}`] = contactsArray[index]; // Hier wird das neue Objekt acc erstellt und ein Schlüssel vergeben.
    }
    return acc;
  }, {});

  let subtasksObj = subtasks.reduce((acc, subtask, index) => {
    acc[`subtask${index + 1}`] = {
      title: subtask.title,
      completed: subtask.completed,
    };
    return acc;
  }, {});

  let newTask = {
    board_category: boardCategory,
    contacts: selectedContactsData,
    description: description,
    due_date: dueDate,
    prio: prio,
    subtasks: subtasksObj,
    task_category: taskCategory,
    title: title,
  };

  let postResponse = await postTask("", newTask);

  goToBoard();

  let dataFetched = await boardInit(); // Warten bis die Kontaktliste aktualisiert wurde

  subtasks = [];
}

function getSelectedPrio() {
  if (document.getElementById("highButton").classList.contains("selected-high-button")) {
    return "urgent";
  }
  if (document.getElementById("mediumButton").classList.contains("selected-medium-button")) {
    return "medium";
  }
  if (document.getElementById("lowButton").classList.contains("selected-low-button")) {
    return "low";
  }
  return "medium"; // Default value
}
