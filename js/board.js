const TASKS_URL = "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/tasks/";

let tasksData = {};
let tasksArray = [];
let tasksKeys = [];

currentTaskKey = 0;
currentTask = {};
let currentBoardCategory = "";


/**
 * This function initializes board.html. It is implemented on body onload.
 */
async function boardInit() {
  await fetchTasksJson();
  await fetchDataJson();
  createTaskOnBoard();
  checkAndAddNoTask();
  generateInitials();
}


/**
 * This function fetches all tasks dirctly from the TASK_URL defined in line 1. 
 * It saves the data first as objects, then as arrays for rendering, then the keys of the tasks, to identify them.
 * @returns false if there is an error in fetching.
 */
async function fetchTasksJson() {
  try {
    let response = await fetch(TASKS_URL + ".json");
    let responseToJson = await response.json();
    tasksData = responseToJson || {};
    tasksArray = Object.values(tasksData);
    tasksKeys = Object.keys(tasksData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}

/**
 * This function renders the task cards in board.html. First it defines all board IDs for the different categorys. Then it clears all Boards and renders the cards.
 */
function createTaskOnBoard() {
  const boardIds = {
    "to-do": "to-do",
    "in-progress": "in-progress",
    "await-feedback": "await-feedback",
    done: "done",
  };
  clearBoards(boardIds);

  for (let i = 0; i < tasksArray.length; i++) {
    let task = tasksArray[i];
    let key = tasksKeys[i];
    let contactsHTML = generateContactsHTML(task.contacts);
    let boardId = boardIds[task.board_category] || "to-do";
    let content = document.getElementById(boardId);
    let prioSrc = handlePrio(task.prio);
    let categoryClass = task.task_category === "User Story" ? "user-story" : "technical-task";

    content.innerHTML += generateTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc);
  }
}

/**
 * This function works by using the input field "Find Task". It is implemented by an oninput-handler in the HTML.
 */
function findTask() {
  let input = document.getElementById("find-task").value.toLowerCase();
  let filteredTasks = tasksArray.filter((task) => {
    return task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input);
  });
  renderFilteredTasks(filteredTasks);
}

/**
 * Same function as findTask() but implemented on another div shown on mobile devices.
 */
function findTaskMobile() {
  let input = document.getElementById("find-task2").value.toLowerCase();
  let filteredTasks = tasksArray.filter((task) => {
    return task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input);
  });
  renderFilteredTasks(filteredTasks);
}

/**
 * Same functionality as createTaskOnBoard, but for the filtered tasks by the findTask-function.
 * @param {array} filteredTasks - filtered tasks by oniput-handler in findTask().
 */
function renderFilteredTasks(filteredTasks) {
  const boardIds = { "to-do": "to-do", "in-progress": "in-progress", "await-feedback": "await-feedback", done: "done" };
  clearBoards(boardIds);

  for (let i = 0; i < filteredTasks.length; i++) {
    let task = filteredTasks[i];
    let key = tasksKeys[tasksArray.indexOf(task)];
    let contactsHTML = generateContactsHTML(task.contacts);
    let boardId = boardIds[task.board_category] || "to-do";
    let content = document.getElementById(boardId);
    let prioSrc = handlePrio(task.prio);
    let categoryClass = task.task_category === "User Story" ? "user-story" : "technical-task";

    content.innerHTML += generateTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc);
  }
  checkAndAddNoTask();
}

/**
 * This function empties all category boards before they are rendert again in other functions.
 * @param {array} boardIds - board categories to-do, in-progress, await-feedback and done
 */
function clearBoards(boardIds) {
  for (let id in boardIds) {
    let content = document.getElementById(boardIds[id]);
    if (content) {
      content.innerHTML = "";
    }
  }
}

/**
 * This function displays the assigned contacts on the cards on the board by initials.
 * @param {array} contacts - task.contacts
 * @returns HTMLs of the first four assigned contacts and the HTML with the number of the further contacts, if there are more.
 */
function generateContactsHTML(contacts) {
  contacts = contacts || {};
  const contactCount = Object.keys(contacts).length;
  const displayedContacts = getDisplayedContactsHTML(contacts);
  const remainingContacts = getRemainingContactsHTML(contactCount);

  return displayedContacts + remainingContacts;
}

/**
 * This function renders the first four assigned task contacts on the card on the board.
 * @param {array} contacts - task.contacts
 * @returns HTMLs of the first four assigned contacts
 */
function getDisplayedContactsHTML(contacts) {
  let contactsHTML = "";
  let displayedContacts = 0;

  for (let key in contacts) {
    if (contacts.hasOwnProperty(key) && displayedContacts < 4) {
      const contact = contacts[key];
      contactsHTML += generateContact(contact);
      displayedContacts++;
    } else if (displayedContacts >= 4) {
      break;
    }
  }

  return contactsHTML;
}

/**
 * This function returns a HTML with the number of further contacts if there are more than four on the card on the board..
 * @param {number} contactCount - task.contacts[length]
 * @returns HTML with the number of further contacts or nothing if there are four assigned contacts or less.
 */
function getRemainingContactsHTML(contactCount) {
  if (contactCount > 4) {
    const remainingContacts = contactCount - 4;
    return generateRemainingContactsHTML(remainingContacts);
  }
  return "";
}

/**
 * This function displays the correct image for each prio status on the cards on the board
 * @param {string} prio - task.prio
 * @returns the correct image correspondant to urgent, medium or low
 */
function handlePrio(prio) {
  if (prio === "urgent") {
    return "/add_task_img/high.svg";
  } else if (prio === "medium") {
    return "/add_task_img/medium.svg";
  } else if (prio === "low") {
    return "/add_task_img/low.svg";
  } else {
    return "/add_task_img/medium.svg";
  }
}


function generateTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc) {
    let subtasks = task.subtasks || {};
    let totalSubtasks = Object.keys(subtasks).length;
    let completedSubtasks = Object.values(subtasks).filter((subtask) => subtask.completed).length;
    let progressPercentage = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;
  
    return getTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc, totalSubtasks, completedSubtasks, progressPercentage);
}


function getInitials(name) {
  let initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");
  return initials.toUpperCase();
}


function checkAndAddNoTask() {
  const taskAreas = ["to-do", "in-progress", "await-feedback", "done"];

  taskAreas.forEach((id) => {
    const element = document.getElementById(id);
    if (element && element.children.length === 0) {
      const noTaskDiv = document.createElement("div");
      noTaskDiv.className = "no-task";
      noTaskDiv.innerHTML = `No tasks ${id.replace(/-/g, " ")}`;
      element.appendChild(noTaskDiv);
    }
  });
}


function startDragging(key) {
  currentDraggedTaskKey = key;
}


function allowDrop(ev) {
  ev.preventDefault();
  var taskArea = ev.currentTarget;
  taskArea.classList.add("hover");
}


function resetBackground(ev) {
  var taskArea = ev.currentTarget;
  taskArea.classList.remove("hover");
}


async function moveTo(category) {
  if (currentDraggedTaskKey) {
    await updateTaskAttribute(currentDraggedTaskKey, category, "board_category");
    await fetchTasksJson();
    createTaskOnBoard();
    checkAndAddNoTask();
  }
}


function drop(ev, category) {
  ev.preventDefault();
  var taskArea = ev.currentTarget;
  taskArea.classList.remove("hover");
  moveTo(category);
}


async function updateTaskAttribute(key, newBoardCategory, urlSuffix) {
  try {
    let response = await fetch(TASKS_URL + key + "/" + urlSuffix + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBoardCategory),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating board category:", error);
    throw error;
  }
}


async function postTask(path = "", data = {}) {
  try {
    let response = await fetch(TASKS_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}


async function deleteTask(key) {
  try {
    let response = await fetch(TASKS_URL + key + ".json", {
      method: "DELETE",
    });
    await response.json();
    await boardInit();
    closeTask();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}


function openTask(key) {
  const task = tasksData[key];
  currentTaskKey = key;
  console.log(task);
  showTaskLayer();
  let content = document.getElementById("show-task-inner-layer");
  animateContent(content);
  updateContent(content, task, key);
  updateHeadlineVisibility();
}


function showTaskLayer() {
  document.getElementById("show-task-layer").classList.remove("d-none");
}


function animateContent(content) {
  content.classList.remove("width-auto");
  content.classList.remove("slide-in-right");
  content.classList.remove("slide-out-right");
  void content.offsetWidth;
  content.classList.add("slide-in-right");
}


function updateContent(content, task, key) {
  content.innerHTML = "";
  content.innerHTML += generateTaskLayer(task, key);
}


function updateHeadlineVisibility() {
  updateSubtasksHeadline();
  updateContactsHeadline();
}


function updateSubtasksHeadline() {
  let subtasksHeadline = document.getElementById("subtasks-headline");
  let subtasksContainer = document.querySelector(".show-task-subtasks");

  if (subtasksContainer && subtasksContainer.innerHTML.trim() === "") {
    subtasksHeadline.classList.add("d-none");
  } else {
    subtasksHeadline.classList.remove("d-none");
  }
}


function updateContactsHeadline() {
  let contactsHeadline = document.getElementById("assigned-headline");
  let contactsContainer = document.querySelector(".show-task-contacts");

  if (contactsContainer && contactsContainer.innerHTML.trim() === "") {
    contactsHeadline.classList.add("d-none");
  } else {
    contactsHeadline.classList.remove("d-none");
  }
}


function generateTaskLayer(task, key) {
    let contacts = task.contacts || {};
    let subtasks = task.subtasks || {};
    let categoryClass = getCategoryClass(task.task_category);

    initializeSelectedContacts(contactsArray);

    let userName = sessionStorage.getItem('userName');
    let contactsHTML = generateContactsInTaskLayer(task.contacts, userName);
    let subtasksHTML = generateSubtasksInTaskLayer(subtasks, key);

    return getTaskLayerHTML(task, key, categoryClass, contactsHTML, subtasksHTML);
}


function getCategoryClass(taskCategory) {
    return taskCategory === 'User Story' ? 'user-story' : 'technical-task';
}


function initializeSelectedContacts(contactsArray) {
    selectedContacts = new Array(contactsArray.length).fill(false);
}


function generateContactsInTaskLayer(contacts, userName) {
    if (!contacts || typeof contacts !== 'object') {
        return '';
    }

    return Object.values(contacts).map(contact => {
        const contactIndex = contactsArray.findIndex(c => c.email === contact.email && c.name === contact.name);

        if (contactIndex !== -1) {
            selectedContacts[contactIndex] = true;
        }

        let displayName = contact.name;
        if (contact.name === userName) {
            displayName += " (You)";
        }
        return `
            <div class="show-task-contact">
                <div class="show-task-contact-letters" style="background-color: ${contact.color};">${getInitials(contact.name)}</div>
                <p>${displayName}</p>
            </div>
        `;
    }).join('');
}


function generateSubtasksInTaskLayer(subtasks, key) {
    return Object.keys(subtasks).map(subtaskKey => {
        const subtask = subtasks[subtaskKey];
        return `
            <div class="show-task-subtask" onclick="checkSubtask('${key}', '${subtaskKey}', this.querySelector('img'))">
                <img src="/add_task_img/${subtask.completed ? 'subtasks_checked' : 'subtasks_notchecked'}.svg" alt="">
                <p>${subtask.title}</p>
            </div>
        `;
    }).join('');
}


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


async function checkSubtask(taskKey, subtaskKey, imgElement) {
  const subtask = tasksData[taskKey].subtasks[subtaskKey];
  const updatedStatus = !subtask.completed;

  try {
    let response = await fetch(TASKS_URL + taskKey + "/subtasks/" + subtaskKey + "/completed.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatus),
    });
    await response.json();

    tasksData[taskKey].subtasks[subtaskKey].completed = updatedStatus;
    imgElement.src = updatedStatus ? "/add_task_img/subtasks_checked.svg" : "/add_task_img/subtasks_notchecked.svg";

    await boardInit();
  } catch (error) {
    console.error("Error updating subtask status:", error);
  }
}

  

function showEditTask(taskKey) {
  const task = tasksData[taskKey];
  let content = document.getElementById("show-task-inner-layer");
  let currentHeight = content.scrollHeight;
  content.style.height = currentHeight + "px";
  content.innerHTML = generateEditTaskLayer(task, taskKey);
}


async function updateTask(key, updatedTask) {
  try {
    let response = await fetch(TASKS_URL + key + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}


function saveTaskChanges(key) {
    const selectedContactsData = getSelectedContactsData();
    const subtasksObj = getSubtasksObj();
    const updatedTask = getUpdatedTask(selectedContactsData, subtasksObj);
    
    updateTask(key, updatedTask)
      .then(() => {
        handleTaskUpdateSuccess();
      })
      .catch((error) => console.error("Error updating task:", error));
}


async function saveEditContacts(key) {
  try {
    const selectedContactsData = getSelectedContactsData();
    const subtasksObj = getSubtasksObj();
    const updatedTask = getUpdatedTask(selectedContactsData, subtasksObj);

    await updateTask(key, updatedTask);
    console.log('updated');
    
    await boardInit();
    console.log('next');

    showEditTask(currentTaskKey);
    
    
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

  

function getSelectedContactsData() {
return selectedContacts.reduce((acc, isSelected, index) => {
    if (isSelected) {
    acc[`contact${index + 1}`] = contactsArray[index];
    }
    return acc;
}, {});
}


function getSubtasksObj() {
return subtasks.reduce((acc, subtask, index) => {
    acc[`subtask${index + 1}`] = {
    title: subtask.title,
    completed: subtask.completed,
    };
    return acc;
}, {});
}


function getUpdatedTask(selectedContactsData, subtasksObj) {
    return {
        task_category: currentTask.task_category,
        board_category: currentTask.board_category,
        contacts: selectedContactsData,
        subtasks: subtasksObj,
        title: document.getElementById("edit-title-input").value,
        description: document.getElementById("edit-description-input").value,
        due_date: document.getElementById("edit-date-input").value,
        prio: getSelectedPriority(),
    };
}


function getSelectedPriority() {
if (document.querySelector(".prio-buttons.selected-high-button")) {
    return "urgent";
} else if (document.querySelector(".prio-buttons.selected-medium-button")) {
    return "medium";
} else if (document.querySelector(".prio-buttons.selected-low-button")) {
    return "low";
} else {
    return currentTask.prio;
}
}


function handleTaskUpdateSuccess() {
closeTask();
boardInit();
subtasks = [];
}
  
  
function generateEditTaskLayer(task, key) {
    currentTask = task;
    let contacts = task.contacts || {};
    let taskSubtasks = task.subtasks || {};

    let contactsHTML = getEditContactsHTML(contacts);
    let subtasksHTML = getEditSubtasksHTML(taskSubtasks);

    let highSelected = task.prio === "urgent" ? "selected-high-button" : "";
    let highImgSrc = task.prio === "urgent" ? "add_task_img/high-white.svg" : "add_task_img/high.svg";

    let mediumSelected = task.prio === "medium" ? "selected-medium-button" : "";
    let mediumImgSrc = task.prio === "medium" ? "add_task_img/medium-white.svg" : "add_task_img/medium.svg";

    let lowSelected = task.prio === "low" ? "selected-low-button" : "";
    let lowImgSrc = task.prio === "low" ? "add_task_img/low-white.svg" : "add_task_img/low.svg";

    return getEditHTML(task, key, contactsHTML, subtasksHTML, highSelected, highImgSrc, mediumSelected, mediumImgSrc, lowSelected, lowImgSrc);
}

function getEditSubtasksHTML(taskSubtasks) {
    subtasks = [];

    return Object.keys(taskSubtasks)
        .map((subtaskKey) => {
        let subtask = taskSubtasks[subtaskKey];
        subtasks.push({ title: subtask.title, completed: subtask.completed });
        return `
                <div id="subtask-tasks${subtasks.length - 1}" class="subtasks-tasks">
                    <div>
                        <ul class="subtask-list">
                            <li id="subtask-${subtasks.length - 1}" ondblclick="changeSubtask(${subtasks.length - 1})" class="subtask-list-element">${subtask.title}</li>
                        </ul>
                    </div>
                    <div class="subtask-list-icons">
                        <img id="edit-logo${subtasks.length - 1}" onclick="whichSourceSubtask(${subtasks.length - 1})" src="add_task_img/edit.svg" alt="" />
                        <div class="subtask-line"></div>
                        <img onclick="deleteSubtask(${subtasks.length - 1})" src="add_task_img/delete.svg" alt="" />
                    </div>
                </div>
            `;
        })
    .join("");
}






function getEditContactsHTML(contacts) {
    contacts = contacts || {}; // Ensure contacts is an object
    let contactCount = Object.keys(contacts).length;
    console.log(contacts);
  
    let contactsHTML = getFirstFourContacts(contacts);
    contactsHTML += getRestContacts(contactCount);
  
    return contactsHTML;
}

function getFirstFourContacts(contacts) {
  let contactsHTML = "";
  let displayedContacts = 0;

  for (let key in contacts) {
    if (contacts.hasOwnProperty(key)) {
      let contact = contacts[key];
      let initials = getInitials(contact.name);

      if (displayedContacts < 4) {
        contactsHTML += `
          <div class="show-task-contact">
              <div class="show-task-contact-letters" style="background-color: ${contact.color};">${initials}</div>
          </div>
        `;
        displayedContacts++;
      } else {
        break;
      }
    }
  }

  return contactsHTML;
}

function getRestContacts(contactCount) {
  if (contactCount > 4) {
      let remainingContacts = contactCount - 4;
      return `
      <div class="show-task-contact">
          <div class="show-task-contact-letters" style="background-color: white; color: black; border: 2px solid black;">+${remainingContacts}</div>
      </div>
      `;
  }
  return "";
}



async function getAddContactSiteHTML(selectedContacts) {
  // contacts = contacts || {}; // Ensure contacts is an object
  selectedContacts = selectedContacts || []; // Ensure selectedContacts is an array
  let contactCount = Object.keys(selectedContacts).length;

  let content = document.getElementById('add-task-contactsHTML');
  content.innerHTML = '';
  content.innerHTML += getFirstFourAddContacts(selectedContacts);
  content.innerHTML += getRestAddContacts(contactCount);
}



function getAddContactsHTML(selectedContacts) {
  // contacts = contacts || {}; // Ensure contacts is an object
  selectedContacts = selectedContacts || []; // Ensure selectedContacts is an array
  let contactCount = Object.keys(selectedContacts).length;

  let contactsHTML = getFirstFourAddContacts(selectedContacts);
  contactsHTML += getRestAddContacts(contactCount);

  return contactsHTML;
}

function getFirstFourAddContacts(selectedContacts) {
  let contactsHTML = "";
  let displayedContacts = 0;
  let contactKeys = Object.keys(contactsArray);
  console.log(contactKeys);
  console.log(contactsKeys);

  for (let i = 0; i < contactsKeys.length; i++) {
    if (selectedContacts[i]) {
      let contact = contactsArray[i];
      let initials = getInitials(contact.name);

      if (displayedContacts < 4) {
        contactsHTML += `
          <div class="show-task-contact">
              <div class="show-task-contact-letters" style="background-color: ${contact.color};">${initials}</div>
          </div>
        `;
        displayedContacts++;
      } else {
        break;
      }
    }
  }

  return contactsHTML;
}

function getRestAddContacts(contactCount) {
  contactCount = selectedContacts.filter(contact => contact === true).length;
  if (contactCount > 4) {
      let remainingContacts = contactCount - 4;
      return `
      <div class="show-task-contact">
          <div class="show-task-contact-letters" style="background-color: white; color: black; border: 2px solid black;">+${remainingContacts}</div>
      </div>
      `;
  }
  return "";
}





function openAddTask(boardCategory) {
  resetSelectedContacts();
  document.getElementById("show-task-layer").classList.remove("d-none");
  let content = document.getElementById("show-task-inner-layer");
  content.classList.add("width-auto");

  content.classList.remove("slide-in-right");
  content.classList.remove("slide-out-right");
  void content.offsetWidth;
  content.classList.add("slide-in-right");

  let contacts = {};
  
  let contactsHTML = getAddContactsHTML(contacts);

  content.innerHTML = "";
  content.innerHTML += generateAddTaskLayer(boardCategory, contactsHTML);
  console.log(boardCategory);
  standardButton();
  currentBoardCategory = boardCategory;
}


function closeTask() {
  let contentLayer = document.getElementById("show-task-layer");
  let content = document.getElementById("show-task-inner-layer");

  content.classList.remove("slide-out-right");
  void content.offsetWidth;
  content.classList.add("slide-out-right");

  content.removeEventListener("animationend", taskAnimationEnd);
  content.addEventListener(
    "animationend",
    () => {
      content.style.height = ""; 
      taskAnimationEnd();
    },
    { once: true }
  );
}


function taskAnimationEnd() {
  document.getElementById("show-task-layer").classList.add("d-none");
}