let subtasks = [];

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
  document.getElementById("category").innerHTML += `<div class="category-options">
  <span onclick="technicalTask()">Technical Task</span>
  <span onclick="userStory()">User Story</span>
  </div>`;

  // checked if category field is already open
  var x = document.getElementById("category");
  if (x.style.display === "flex") {
    x.style.display = "none";
    x.innerHTML = "";
  } else {
    x.style.display = "flex";
  }
}

function technicalTask() {
  // changing the innerHTML and close the window
  document.getElementById("task-category").innerHTML = "Technical Task";
  document.getElementById("category").style.display = "none";
  document.getElementById("category").innerHTML = "";
}
function userStory() {
  // changing the innerHTML and close the window
  document.getElementById("task-category").innerHTML = "User Story";
  document.getElementById("category").style.display = "none";
  document.getElementById("category").innerHTML = "";
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
  let required = document.getElementById("date-required");
  // checked if the date length is 0 or more
  if (date.value.length === 0) {
    date.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (date.value.length > 0) {
    document.getElementById("date-input").style.color = "black";
    date.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

function newSubtask() {
  let subtaskPlus = document.getElementById("subtask-plus");
  subtaskPlus.style.display = "none";

  document.getElementById("edit-subtask").innerHTML += `<div id="closeAndCheck" class="closeAndCheck">
    <img id="closeSubtask" onclick="closeSubtask()" src="add_task_img/close.svg" alt="" />
    <div class="subtask-line"></div>
    <img onclick="createSubtask()" id="checkSubtask" src="add_task_img/check.svg" alt="" />
  </div>`;
}

function closeSubtask() {
  let closeSubtask = document.getElementById("closeAndCheck");
  closeSubtask.style.display = "none";

  let subtaskPlus = document.getElementById("subtask-plus");
  subtaskPlus.style.display = "flex";
}

function createSubtask() {
  let input = document.getElementById("subtask-field");
  subtasks.push(input.value);
  let createSubtask = document.getElementById("create-subtask");
  createSubtask.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];

    createSubtask.innerHTML += `<div class = "test">
      <div>
        <ul class="subtask-list">
          <li id="subtask-${i}" onclick="changeSubtask(${i})" class="subtask-list-element">${subtask}</li>
        </ul>
      </div>
      <div class="subtask-list-icons">
        <img onclick="deleteSubtask(${i})" src="add_task_img/delete.svg" alt="" />
        <div class="subtask-line"></div>
        <img src="add_task_img/check.svg" alt="" />
      </div>
    </div>`;
  }
  input.value = "";
}

function changeSubtask(subtask) {
  let createSubtask = document.getElementById("create-subtask");
  createSubtask.innerHTML = `<div>${subtask}</div>`;
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  newSubtask();
}
function showContactsInAddTask() {
  let contactsAddTask = contactsArray
    .map(
      (contact) => `<div class="contacts-pos">
        <div class="show-task-contact-add-task">
          <div class="show-task-contact-letters" style="background-color: ${contact.color};">${getInitials(contact.name)}</div>
          <p>${contact.name}</p>
        </div>
        <div class="checkbox">
        <img id="checkbox-field" onclick="checkContacts()" src="add_task_img/checkbox-normal.svg" alt="">
          
        </div>
      </div> `
    )
    .join("");

  let content = document.getElementById("add-task-contacts");
  content.innerHTML = contactsAddTask;
}

async function initializeAddTask() {
  await fetchDataJson();
  showContactsInAddTask();
}

function showContacts() {
  document.getElementById("add-task-contacts").classList.toggle("d-none");
}

function checkContacts() {
  let checkboxField = document.getElementById("checkbox-field");
  if (checkboxField.src.includes("checkbox-normal.svg")) {
    checkboxField.src = "add_task_img/checkbox-normal-checked.svg";
  } else {
    checkboxField.src = "add_task_img/checkbox-normal.svg";
  }
}
