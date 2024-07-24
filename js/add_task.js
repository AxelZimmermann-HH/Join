let subtasks = [];
let selectedContacts = [];
let currentTaskIndex = 0;

const contactDropdown = document.getElementById("add-task-contacts");
const categoryDropdown = document.getElementById("category");

/**
 * Highlights the medium priority button and updates its image.
 */
function standardButton() {
  document.getElementById("mediumButton").classList.add("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium-white.svg";
}

/**
 * Highlights the high priority button, updates its image,
 * and resets the medium and low priority buttons.
 */
function highButton() {
  document.getElementById("highButton").classList.add("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high-white.svg";

  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";

  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

/**
 * Highlights the medium priority button, updates its image,
 * and resets the high and low priority buttons.
 */
function mediumButton() {
  document.getElementById("mediumButton").classList.add("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium-white.svg";

  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";

  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

/**
 * Highlights the low priority button, updates its image,
 * and resets the high and medium priority buttons.
 */
function lowButton() {
  document.getElementById("lowButton").classList.add("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low-white.svg";

  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";

  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";
}

/**
 * Toggles the visibility of the category dropdown and initializes its content.
 */
function category() {
  let categoryDropdown = document.getElementById("category");
  categoryDropdown.classList.toggle("d-none");

  document.getElementById("category").innerHTML = `<div class="category-options">
  <span onclick="technicalTask()">Technical Task</span>
  <span onclick="userStory()">User Story</span>
  </div>`;
  emptyCategory();
}

/**
 * Sets the task category to "Technical Task" and hides the category dropdown.
 */
function technicalTask() {
  let category = document.getElementById("category");
  document.getElementById("task-category").innerHTML = "Technical Task";
  category.classList.add("d-none");
  category.innerHTML = "";
  emptyCategory();
}

/**
 * Sets the task category to "User Story" and hides the category dropdown.
 */
function userStory() {
  let category = document.getElementById("category");
  document.getElementById("task-category").innerHTML = "User Story";
  category.classList.add("d-none");
  category.innerHTML = "";
  emptyCategory();
}

/**
 * Updates the style of the date input field based on its value.
 */
function updateDateStyle() {
  let date = document.getElementById("date-input");
  let required = document.getElementById("date-required");

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

/**
 * Sets up the subtask input field to create a new subtask on Enter key press,
 * hides the plus icon, and shows the close subtask option.
 */
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

/**
 * Resets the subtask input field and updates the UI to hide the close subtask option.
 */
function closeSubtask() {
  let input = document.getElementById("subtask-field");
  input.value = "";
  let subtaskPlus = document.getElementById("subtask-plus");
  subtaskPlus.classList.remove("d-none");

  let closeSubtask = document.getElementById("edit-subtask");
  closeSubtask.classList.add("d-none");
}

/**
 * Creates a new subtask and updates the subtask list UI.
 */
function createSubtask() {
  let input = document.getElementById("subtask-field");

  if (input.value.trim() === "") {
    return;
  }

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

/**
 * Renders the list of subtasks in the UI.
 */
function renderSubtasks() {
  let createSubtask = document.getElementById("create-subtask");
  createSubtask.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    createSubtask.innerHTML += renderSubtasksHTML(i, subtask);
  }
}

/**
 * Changes the subtask layer to the edit state for a specific subtask.
 * @param {number} i - The index of the subtask to edit.
 */
function changeSubtaskLayer(i) {
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks");
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks:hover");
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks-edit");
}

/**
 * Changes the subtask content to an editable state for a specific subtask.
 * @param {number} i - The index of the subtask to edit.
 */
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

/**
 * Determines whether to update or change the subtask based on the current state.
 * @param {number} i - The index of the subtask to check.
 */
function whichSourceSubtask(i) {
  let editLogo = document.getElementById(`edit-logo${i}`);
  if (editLogo.src.endsWith("add_task_img/check.svg")) {
    updateSubtask(i);
  } else {
    changeSubtask(i);
  }
}

/**
 * Updates the subtask layer to the default state for a specific subtask.
 * @param {number} i - The index of the subtask to update.
 */
function updateSubtaskLayer(i) {
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks");
  document.getElementById(`subtask-tasks${i}`).classList.add("subtask-tasks:hover");
  document.getElementById(`subtask-tasks${i}`).classList.remove("subtask-tasks-edit");
}

/**
 * Updates the content of a specific subtask.
 * @param {number} i - The index of the subtask to update.
 */
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

/**
 * Deletes a subtask from the subtasks array and re-renders the subtasks.
 * @param {number} i - Index of the subtask to be deleted.
 */
function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
}

/**
 * Resets the selected contacts array to all false values.
 */
function resetSelectedContacts() {
  selectedContacts = new Array(contactsArray.length).fill(false);
}

/**
 * Displays the contacts in the add task section.
 */
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

/**
 * Initializes the add task process by fetching necessary data and setting up the interface.
 */
async function initializeAddTask() {
  await fetchDataJson();
  generateInitials();
  standardButton();
}

/**
 * Toggles the display of the contacts dropdown and shows the contacts in the add task section.
 */
function showContacts() {
  let contactDropdown = document.querySelector("#add-task-contacts");
  let categoryDropdown = document.querySelector("#category");
  contactDropdown.classList.toggle("d-none");
  showContactsInAddTask();
}
document.addEventListener("DOMContentLoaded", function () {
  addMouseDownListeners();
});

/**
 * Adds event listeners for mouse down events to handle dropdown visibility.
 */
async function addMouseDownListeners() {
  document.addEventListener("mousedown", async function (event) {
    const contactDropdown = document.querySelector("#add-task-contacts");
    const categoryDropdown = document.querySelector("#category");

    if (contactDropdown && !contactDropdown.contains(event.target) && !event.target.matches(".select-contact")) {
      await closeContactDropdown(contactDropdown);
    }

    if (categoryDropdown && !categoryDropdown.contains(event.target) && !event.target.matches(".select-contact")) {
      if (!categoryDropdown.classList.contains("d-none")) {
        categoryDropdown.classList.add("d-none");
      }
    }
  });
}

/**
 * Closes the contact dropdown and performs necessary updates based on the current state.
 * @param {HTMLElement} contactDropdown - The contact dropdown element to be closed.
 */
async function closeContactDropdown(contactDropdown) {
  if (!contactDropdown.classList.contains("d-none")) {
    contactDropdown.classList.add("d-none");

    if (document.getElementById("add-task-contactsHTML")) {
      await getAddContactSiteHTML(selectedContacts);
      standardButton();
    } else {
      if (document.getElementById("add-task-contactsHTML-layer")) {
        showContactsInAddTaskLayer();
        document.getElementById("req-text-layer").classList.add("mt10");
      } else {
        await saveEditContacts(currentTaskKey);
      }
    }
  }
}

/**
 * Displays the contacts in the add task layer.
 */
function showContactsInAddTaskLayer() {
  let contactsHTML = getAddContactsHTML(selectedContacts);
  let content = document.getElementById("show-task-inner-layer");
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = contactsHTML;

  let addTaskLayer = generateAddTaskLayer(currentBoardCategory, contactsHTML);
  let parser = new DOMParser();
  let doc = parser.parseFromString(addTaskLayer, "text/html");
  let newContent = doc.getElementById("add-task-contactsHTML-layer").innerHTML;

  content.querySelector("#add-task-contactsHTML-layer").innerHTML = newContent;

  standardButton();
}

/**
 * Shows the contacts in the edit task section by reusing the add task contact display function.
 */
function showContactsInEdit() {
  showContactsInAddTask();
  contactDropdown.classList.toggle("d-none");
}

/**
 * Toggles the selection of a contact.
 * @param {number} i - Index of the contact to be checked.
 */
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

/**
 * Clears the selected contacts and resets the contact checkboxes in the add task section.
 */
function clearContacts() {
  let content = document.getElementById("add-task-contactsHTML");
  if (!content) {
    content = document.getElementById("add-task-contactsHTML-layer");
  }

  for (let i in selectedContacts) {
    if (selectedContacts.hasOwnProperty(i) && selectedContacts[i]) {
      let checkboxField = document.getElementById(`checkbox-field${i}`);
      let contactDiv = document.getElementById(`contacts-pos${i}`);

      checkboxField.src = "add_task_img/checkbox-normal.svg";
      contactDiv.classList.remove("contacts-pos-highlight");
      contactDiv.classList.remove("no-hover");
      selectedContacts[i] = false;
    }
  }

  content.innerHTML = "";
}

/**
 * Clears the task input fields and resets the interface.
 */
function clearTask() {
  let description = document.getElementById("description-input");
  description.value = "";

  let dueDate = document.getElementById("date-input");
  dueDate.value = "";
  dueDate.style.color = "#d1d1d1";

  document.getElementById("add-task-contacts").classList.add("d-none");

  clearButtons();
  clearSubtasks();
  clearContacts();

  let taskCategory = document.getElementById("task-category");
  taskCategory.innerText = "Select task category";

  let title = document.getElementById("title-input");
  title.value = "";
}

/**
 * Clears the selection state of priority buttons.
 */
function clearButtons() {
  document.getElementById("mediumButton").classList.remove("selected-medium-button");
  document.getElementById("mediumButtonImg").src = "../add_task_img/medium.svg";

  document.getElementById("highButton").classList.remove("selected-high-button");
  document.getElementById("highButtonImg").src = "../add_task_img/high.svg";

  document.getElementById("lowButton").classList.remove("selected-low-button");
  document.getElementById("lowButtonImg").src = "../add_task_img/low.svg";
}

/**
 * Clears the subtasks array and re-renders the subtasks.
 */
function clearSubtasks() {
  subtasks = [];
  renderSubtasks();
  standardButton();
}

/**
 * Validates if the task category is selected and displays an error if not.
 */
function emptyCategory() {
  let taskCategoryInput = document.getElementById("category-input");
  let taskCategory = document.getElementById("task-category").innerText;
  let required = document.getElementById("category-required");
  if (taskCategory === "Select task category") {
    //   taskCategoryInput.style.borderColor = "red";
    //   required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (taskCategory === "User Story" || taskCategory === "Technical Task") {
    taskCategoryInput.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

function emptyCategoryRequired() {
  let taskCategoryInput = document.getElementById("category-input");
  let taskCategory = document.getElementById("task-category").innerText;
  let required = document.getElementById("category-required");
  if (taskCategory === "Select task category") {
    taskCategoryInput.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  }
}

/**
 * Validates if the title is provided and displays an error if not.
 */
function emptyTitle() {
  let title = document.getElementById("title-input");
  let required = document.getElementById("title-required");

  if (title.value.length === 0) {
    title.style.borderColor = "red";
    required.innerHTML = `<div class="title-required">this field is required</div>`;
  } else if (title.value.length > 0) {
    title.style.borderColor = "#29abe2";
    required.innerHTML = "";
  }
}

/**
 * Displays the date picker and updates the date input style.
 */
function emptyDate() {
  let date = document.getElementById("date-input");
  date.showPicker();
  updateDateStyle();
  document.getElementById("date-input").addEventListener("change", updateDateStyle);
}

/**
 * Animates the "Added to board" message and resolves the promise when the animation ends.
 * @returns {Promise} - A promise that resolves when the animation ends.
 */
function addedToBoard() {
  return new Promise((resolve) => {
    let imgContainer = document.getElementById("added-to-board");
    imgContainer.classList.add("animate");

    imgContainer.addEventListener("transitionend", function handler() {
      imgContainer.removeEventListener("transitionend", handler);
      resolve();
    });
  });
}

/**
 * Creates a new task and posts it to the board.
 * @param {string} boardCategory - The category of the board where the task will be added.
 */
async function createTask(boardCategory) {
  let description = document.getElementById("description-input").value;
  let dueDate = document.getElementById("date-input").value;
  let prio = getSelectedPrio();
  let taskCategory = document.getElementById("task-category").innerText;
  let title = document.getElementById("title-input").value;

  if (title === "" || dueDate === "" || taskCategory === "Select task category") {
    emptyDate();
    emptyTitle();
    emptyCategoryRequired();
    return;
  }

  await addedToBoard();

  let selectedContactsData = selectedContacts.reduce((acc, isSelected, index) => {
    if (isSelected) {
      acc[`contact${index + 1}`] = contactsArray[index];
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

  let dataFetched = await boardInit();

  subtasks = [];
}

/**
 * Gets the selected priority level.
 * @returns {string} - The selected priority level ("urgent", "medium", or "low").
 */
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
  return "medium";
}
