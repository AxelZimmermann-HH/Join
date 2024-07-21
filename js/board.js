const TASKS_URL = "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/tasks/";

let tasksData = {};
let tasksArray = [];
let tasksKeys = [];

currentTask = null;

async function boardInit() {
  await fetchTasksJson();
  await fetchDataJson();
  createTaskOnBoard();
  checkAndAddNoTask();
  generateInitials();
}


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


function findTask() {
  let input = document.getElementById("find-task").value.toLowerCase();
  let filteredTasks = tasksArray.filter((task) => {
    return task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input);
  });
  renderFilteredTasks(filteredTasks);
}


function findTaskMobile() {
  let input = document.getElementById("find-task2").value.toLowerCase();
  let filteredTasks = tasksArray.filter((task) => {
    return task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input);
  });
  renderFilteredTasks(filteredTasks);
}


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


function clearBoards(boardIds) {
  for (let id in boardIds) {
    let content = document.getElementById(boardIds[id]);
    if (content) {
      content.innerHTML = "";
    }
  }
}


function generateContactsHTML(contacts) {
  contacts = contacts || {};
  const contactCount = Object.keys(contacts).length;
  const displayedContacts = getDisplayedContactsHTML(contacts);
  const remainingContacts = getRemainingContactsHTML(contactCount);

  return displayedContacts + remainingContacts;
}


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


function getRemainingContactsHTML(contactCount) {
  if (contactCount > 4) {
    const remainingContacts = contactCount - 4;
    return generateRemainingContactsHTML(remainingContacts);
  }
  return "";
}


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
                            <li id="subtask-${subtasks.length - 1}" onclick="changeSubtask(${subtasks.length - 1})" class="subtask-list-element">${subtask.title}</li>
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


function openAddTask(boardCategory) {
  resetSelectedContacts();
  document.getElementById("show-task-layer").classList.remove("d-none");
  let content = document.getElementById("show-task-inner-layer");
  content.classList.add("width-auto");

  content.classList.remove("slide-in-right");
  content.classList.remove("slide-out-right");
  void content.offsetWidth;
  content.classList.add("slide-in-right");

  content.innerHTML = "";
  content.innerHTML += generateAddTaskLayer(boardCategory);
  standardButton();
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