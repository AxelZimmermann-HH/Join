/**
 * This function shows tasks details when clicking on a task card on the board.
 * @param {string} key - task key
 */
function openTask(key) {
    const task = tasksData[key];
    currentTaskKey = key;
    showTaskLayer();
    let content = document.getElementById("show-task-inner-layer");
    let background = document.getElementById("board-content");
    animateContent(content, background);
    updateContent(content, task, key);
    updateHeadlineVisibility();
  }
  
  /**
   * This function enables the layer for task details. It is used in openTask(key).
   */
  function showTaskLayer() {
    document.getElementById("show-task-layer").classList.remove("d-none");
  }
  
  /**
   * This function animates the slide-in-and-out of the task layer. It is used in openTask(key).
   * @param {id} content - show-task-inner-layer, defined in openTask(key)
   */
  function animateContent(content, background) {
    content.classList.remove("width-auto");
    content.classList.remove("slide-in-right");
    content.classList.remove("slide-out-right");
    void content.offsetWidth;
    content.classList.add("slide-in-right");
    background.classList.add('background-noscroll');
  }
  
  /**
   * This function calls the rendering of the task layer.
   * @param {id} content
   * @param {object} task - tasksData[key], defined in openTask(key)
   * @param {string} key - task key
   */
  function updateContent(content, task, key) {
    content.innerHTML = "";
    content.innerHTML += generateTaskLayer(task, key);
  }
  
  /**
   * This function ensures that no irrelevant headlines are shown in the tasks, when the relevant content is empty.
   */
  function updateHeadlineVisibility() {
    updateSubtasksHeadline();
    updateContactsHeadline();
  }
  
  /**
   * This function ensures that the subtasks headline disappears, when the content is empty.
   */
  function updateSubtasksHeadline() {
    let subtasksHeadline = document.getElementById("subtasks-headline");
    let subtasksContainer = document.querySelector(".show-task-subtasks");
  
    if (subtasksContainer && subtasksContainer.innerHTML.trim() === "") {
      subtasksHeadline.classList.add("d-none");
    } else {
      subtasksHeadline.classList.remove("d-none");
    }
  }
  
  /**
   * This function ensures that the contact headline disappears, when the relevant content is empty.
   */
  function updateContactsHeadline() {
    let contactsHeadline = document.getElementById("assigned-headline");
    let contactsContainer = document.querySelector(".show-task-contacts");
  
    if (contactsContainer && contactsContainer.innerHTML.trim() === "") {
      contactsHeadline.classList.add("d-none");
    } else {
      contactsHeadline.classList.remove("d-none");
    }
  }
  
  /**
   * This function renders the content of the task layer. It is called in updateContent(), which is called in openTask().
   * @param {object} task
   * @param {string} key - task key
   * @returns the task layer HTML
   */
  function generateTaskLayer(task, key) {
    let contacts = task.contacts || {};
    let subtasks = task.subtasks || {};
    let categoryClass = getCategoryClass(task.task_category);
  
    initializeSelectedContacts(contactsArray);
  
    let userName = sessionStorage.getItem("userName");
    let contactsHTML = generateContactsInTaskLayer(task.contacts, userName);
    let subtasksHTML = generateSubtasksInTaskLayer(subtasks, key);
  
    return getTaskLayerHTML(task, key, categoryClass, contactsHTML, subtasksHTML);
  }
  
  /**
   * This function returns the correct task category. It is used in generateTaskLayer().
   * @param {sting} taskCategory - user-story or technical-task
   * @returns returns the correct task category
   */
  function getCategoryClass(taskCategory) {
    return taskCategory === "User Story" ? "user-story" : "technical-task";
  }
  
  /**
   * This function generates an array selectedContacts, which has the same length as contactsArray.
   * The array only includes true or false. It is important for editing specific task contacts.
   * @param {array} contactsArray - defined global in contacts.js
   */
  function initializeSelectedContacts(contactsArray) {
    selectedContacts = new Array(contactsArray.length).fill(false);
  }
  
  /**
   * This function renders the contact bubbles in the task layer under the select contact field.
   * @param {array} contacts - task contacts
   * @param {string} userName - relevant for putting the word YOU behind a logged in user.
   * @returns the contact bubbles HTMLs
   */
  function generateContactsInTaskLayer(contacts, userName) {
    if (!contacts || typeof contacts !== "object") {
      return "";
    }
    return Object.values(contacts)
      .map((contact) => {
        const contactIndex = contactsArray.findIndex((c) => c.email === contact.email && c.name === contact.name);
  
        if (contactIndex !== -1) {
          selectedContacts[contactIndex] = true;
        }
        return getContactHTMLInTaskLayer(contact, userName);
      })
      .join("");
  }

  /**
 * This function is for illustrating if a subtask is done. It sets a check img and pushes the new status on firebase.
 * @param {string} taskKey - task key
 * @param {string} subtaskKey - subtask key
 * @param {string} imgElement - img name
 */
async function checkSubtask(taskKey, subtaskKey, imgElement) {
    const subtask = tasksData[taskKey].subtasks[subtaskKey];
    const updatedStatus = !subtask.completed;
  
    await updateSubtaskStatus(taskKey, subtaskKey, updatedStatus);
    updateSubtaskUI(subtask, imgElement);
  
    await boardInit();
}

/**
  * This function updates the completion status of a subtask on the server.
 * @param {string} taskKey - The key identifying the main task.
 * @param {string} subtaskKey - The key identifying the subtask.
 * @param {boolean} updatedStatus - The new completion status of the subtask.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateSubtaskStatus(taskKey, subtaskKey, updatedStatus) {
    try {
      let response = await fetch(TASKS_URL + taskKey + "/subtasks/" + subtaskKey + "/completed.json", {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(updatedStatus),
      });
      await response.json();
      tasksData[taskKey].subtasks[subtaskKey].completed = updatedStatus;
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
}
  
/**
   * This function updates the UI to reflect the new completion status of a subtask.
   * @param {Object} subtask - The subtask object.
   * @param {HTMLElement} imgElement - The image element representing the subtask's completion status.
   */
function updateSubtaskUI(subtask, imgElement) {
    imgElement.src = subtask.completed ? "/add_task_img/subtasks_checked.svg" : "/add_task_img/subtasks_notchecked.svg";
}
  
  
/**
   * This function is called in the task layer to switch to the edit mode.
   * @param {*} taskKey - task key
   */
function showEditTask(taskKey) {
    const task = tasksData[taskKey];
    let content = document.getElementById("show-task-inner-layer");
    let currentHeight = content.scrollHeight;
    content.style.height = currentHeight + "px";
    content.innerHTML = generateEditTaskLayer(task, taskKey);
}
  
/**
   * Standard put-function for updating tasks. It is used in saveTaskChanges().
   * @param {string} key - task key
   * @param {object} updatedTask - new object to be put
   * @returns response.json
   */
async function updateTask(key, updatedTask) {
    try {
      let response = await fetch(TASKS_URL + key + ".json", {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(updatedTask),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
}
  
/**
   * This function executes the changes in the task edit layer and shows them.
   * @param {string} key - task key
   */
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
  
/**
   * This function updates changes in contacts of edit task layer and shows them.
   * @param {string} key - task key
   */
async function saveEditContacts(key) {
    try {
      const selectedContactsData = getSelectedContactsData();
      const subtasksObj = getSubtasksObj();
      const updatedTask = getUpdatedTask(selectedContactsData, subtasksObj);
  
      await updateTask(key, updatedTask);
      await boardInit();
  
      showEditTask(currentTaskKey);
    } catch (error) {
      console.error("Error updating task:", error);
    }
}
  
/**
   * This function filters all elements of selectedContacts which are true and returns them.
   * @returns true elements as objects
   */
function getSelectedContactsData() {
    return selectedContacts.reduce((acc, isSelected, index) => {
      if (isSelected) {
        acc[`contact${index + 1}`] = contactsArray[index];
      }
      return acc;
    }, {});
}
  
/**
   * This function filters all elements of subtasks which are dependant to a specific task and returns them.
   * @returns relevant subtasks as objects.
   */
function getSubtasksObj() {
    return subtasks.reduce((acc, subtask, index) => {
      acc[`subtask${index + 1}`] = {
        title: subtask.title,
        completed: subtask.completed,
      };
      return acc;
    }, {});
}
  
/**
   * This function returns an updated task object.
   * @param {array} selectedContactsData - relevant contacts
   * @param {array} subtasksObj - relevant subtasks
   * @returns updated task object
   */
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
  
/**
   * This function returns the marked prio for getUpdatedTask():
   * @returns marked prio
   */
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
  
/**
   * This function defines the end of saveTaskChanges(). It closes the layer and renders the board.
   */
function handleTaskUpdateSuccess() {
    closeTask();
    boardInit();
    subtasks = [];
}
  
/**
   * This function generates the edit task layer.
   * @param {object} task
   * @param {string} key - task key
   * @returns the HTML of the relevant edit task layer
   */
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
  
/**
   * This function generates HTML for all subtasks in the edit layer and updates the global subtasks array.
   *
   * @param {Object} taskSubtasks - An object containing all subtasks for a task.
   * @returns {string} The concatenated HTML string for all subtasks.
   */
function getEditSubtasksHTML(taskSubtasks) {
    subtasks = [];
  
    return Object.keys(taskSubtasks)
      .map((subtaskKey, index) => {
        let subtask = taskSubtasks[subtaskKey];
        subtasks.push({ title: subtask.title, completed: subtask.completed });
        return getSubtaskHTML(subtask, index);
      })
      .join("");
}
  
/**
   * This function renders the existing contact bubbles in the edit task layer. The first four contacts are shown with initials,
   * followed by a bubble with the number of further connected contacts.
   * @param {array} contacts
   * @returns the HTMLs of the contact bubbles and the number of the rest contacts.
   */
function getEditContactsHTML(contacts) {
    contacts = contacts || {};
    let contactCount = Object.keys(contacts).length;
  
    let contactsHTML = getFirstFourContacts(contacts);
    contactsHTML += getRestContacts(contactCount);
  
    return contactsHTML;
}
  
/**
   * This function renders the existing contact bubbles in the edit task layer. The first four contacts are shown with initials.
   * @param {array} contacts
   * @returns the HTMLs of the first four contact bubbles
   */
function getFirstFourContacts(contacts) {
    let contactsHTML = "";
    let displayedContacts = 0;
  
    for (let key in contacts) {
      if (contacts.hasOwnProperty(key)) {
        let contact = contacts[key];
        if (displayedContacts < 4) {
          contactsHTML += getContactHTML(contact);
          displayedContacts++;
        } else {
          break;
        }
      }
    }
    return contactsHTML;
}
  
/**
   * This function has the same effect as getEditContactsHTML(), but handles the add task site. It is needed so it can be implemented on addEventListener,
   * when clicked aside of the dropdown.
   * @param {array} selectedContacts
   */
async function getAddContactSiteHTML(selectedContacts) {
    selectedContacts = selectedContacts || [];
    let contactCount = Object.keys(selectedContacts).length;
  
    let content = document.getElementById("add-task-contactsHTML");
    content.innerHTML = "";
    content.innerHTML += getFirstFourAddContacts(selectedContacts);
    content.innerHTML += getRestAddContacts(contactCount);
}
  
/**
   * This function has the same effect as getEditContactsHTML(), but handles the add task layer. It is needed so it can be implemented on addEventListener,
   * when clicked aside of the dropdown.
   * @param {array} selectedContacts
   * @returns the HTMLs of the contact bubbles and the number of the rest contacts.
   */
function getAddContactsHTML(selectedContacts) {
    selectedContacts = selectedContacts || [];
    let contactCount = Object.keys(selectedContacts).length;
  
    let contactsHTML = getFirstFourAddContacts(selectedContacts);
    contactsHTML += getRestAddContacts(contactCount);
  
    return contactsHTML;
}
  
/**
   * This function has the same effect as getFirstFourContacts(), but handles the add task site and the add task layer.
   * It is needed so it can be implemented on addEventListener,
   * when clicked aside of the dropdown.
   * @param {array} selectedContacts
   * @returns the first four contacts in bubbles
   */
function getFirstFourAddContacts(selectedContacts) {
    let contactsHTML = "";
    let displayedContacts = 0;
    for (let i = 0; i < contactsArray.length; i++) {
      if (selectedContacts[i]) {
        let contact = contactsArray[i];
        if (displayedContacts < 4) {
          contactsHTML += getContactHTMLInAddTaskLayer(contact);
          displayedContacts++;
        } else {
          break;
        }
      }
    }
    return contactsHTML;
}
  
/**
   * This function opens the add task layer dependant to which board category the new task should be added.
   * @param {string} boardCategory
   */
function openAddTask(boardCategory) {
    resetSelectedContacts();
    document.getElementById("show-task-layer").classList.remove("d-none");
  
    let contacts = {};
    let contactsHTML = getAddContactsHTML(contacts);
  
    displayAddTaskLayer(boardCategory, contactsHTML);
}
  
/**
   * This function prepares and displays the add task layer with the specified board category and contacts HTML.
   * @param {string} boardCategory - The category of the board.
   * @param {string} contactsHTML - The HTML string for the contacts.
   */
function displayAddTaskLayer(boardCategory, contactsHTML) {
    let content = document.getElementById("show-task-inner-layer");
    content.classList.add("width-auto");
  
    content.classList.remove("slide-in-right");
    content.classList.remove("slide-out-right");
    void content.offsetWidth;
    content.classList.add("slide-in-right");
  
    content.innerHTML = "";
    content.innerHTML += generateAddTaskLayer(boardCategory, contactsHTML);
    standardButton();
    currentBoardCategory = boardCategory;
}
  
/**
   * This function closes the task layer with an animation.
   */
function closeTask() {
    let contentLayer = document.getElementById("show-task-layer");
    let content = document.getElementById("show-task-inner-layer");
    content.classList.remove("slide-out-right");
    void content.offsetWidth;
    content.classList.add("slide-out-right");
    content.removeEventListener("animationend", taskAnimationEnd);
    content.addEventListener("animationend",
      () => {
        content.style.height = "";
        taskAnimationEnd();
      },
      { once: true }
    );
}
  
/**
   * This function lets the layer disappear.
   */
function taskAnimationEnd() {
    document.getElementById("show-task-layer").classList.add("d-none");
    document.getElementById("board-content").classList.remove('background-noscroll');
}