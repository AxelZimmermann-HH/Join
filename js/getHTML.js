/**
 * This function returns the code for task cards on board.html.
 * @param {string} key - task key
 * @param {string} categoryClass - board category
 * @param {object} task - task object
 * @param {number} i
 * @param {string} contactsHTML - HTML for the contact bubbles
 * @param {string} prioSrc - name of the img used for priorise the task
 * @param {number} totalSubtasks - all subtasks of the task
 * @param {number} completedSubtasks - nubmer of checked subtasks
 * @param {number} progressPercentage - totalSubtasks/completedSubtasks
 * @returns code for the task cards on board.html
 */
function getTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc, totalSubtasks, completedSubtasks, progressPercentage) {
  let truncatedDescription = truncateDescription(task.description, 50);

  return `
        <div onclick="openTask('${key}')" draggable="true" ondragstart="startDragging('${key}')" class="task-on-board">
        
            <div class="task-on-board-category ${categoryClass}">${task.task_category}</div>
             <button class="move-up" onclick="moveTask('up', 'task1')">↑</button>
             <button class="move-down" onclick="moveTask('down', 'task1')">↓</button>
            <div class="task-on-board-headline">${task.title}</div>
            <div class="task-on-board-text">${truncatedDescription}</div>
            ${
              totalSubtasks > 0
                ? `
                <div class="task-on-board-subtasks">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                    </div>
                    <div class="task-on-board-subtasks-text">${completedSubtasks}/${totalSubtasks} Subtasks</div>
                </div>`
                : ""
            }
            <div class="task-on-board-lastrow">
                <div class="task-on-board-contacts" id="task-on-board-contacts${i}">
                    ${contactsHTML}
                </div>
                <img src="${prioSrc}" alt="" class="task-on-board-relevance">
            </div>
        </div>
    `;
}

/**
 * This function ensures that the description only is less than 51 letters long on the task cards
 * @param {string} description -description text
 * @param {*} maxLength - max length 50
 * @returns the description with max 50 letters
 */
function truncateDescription(description, maxLength) {
    description = description || "";
    return description.length > maxLength ? description.substring(0, maxLength) + "..." : description;
  }

/**
 * This function shows the task details when clicking on the task card.
 * @param {object} task
 * @param {string} key - task key
 * @param {string} categoryClass - board category
 * @param {string} contactsHTML - HTML of the contact bubbles
 * @param {string} subtasksHTML - HTML of the subtaskks
 * @returns HTML of the task details
 */
function getTaskLayerHTML(task, key, categoryClass, contactsHTML, subtasksHTML) {
  return `
        <div class="show-task-firstrow">
            <div class="show-task-category ${categoryClass}">${task.task_category}</div>
            <div class="show-task-close" onclick="closeTask()">
                <img src="img/add-contact-close.svg" alt="">
            </div>
        </div>
        <h1>${task.title}</h1>
        <div class="show-task-scroll">
            <p class="show-task-description">${task.description}</p>
            <div class="show-task-text-rows">
                <p class="show-task-characteristic">Due date:</p><p>${task.due_date}</p>
            </div>
            <div class="show-task-text-rows">
                <p class="show-task-characteristic">Priority:</p>
                <p>${capitalize(task.prio)}</p>
                <img src="/add_task_img/${task.prio}.svg" alt="">
            </div>
            <div id="assigned-headline" class="show-task-text-rows pb8 mt12">
                <p class="show-task-characteristic">Assigned To:</p>
            </div>
            <div class="show-task-contacts">
                ${contactsHTML}
            </div>
            <div id="subtasks-headline" class="show-task-text-rows pb8 mt12">
                <p class="show-task-characteristic">Subtasks:</p>
            </div>
            <div class="show-task-subtasks">
                ${subtasksHTML}
            </div>
            <div class="show-task-lastrow mt12">
                <a href="#" class="show-task-lastrow-link" onclick="deleteTask('${key}')"><img class="show-task-icon" src="/add_task_img/delete.svg" alt="">Delete</a>
                <div class="show-task-lastrow-line"></div>
                <a href="#" class="show-task-lastrow-link" onclick="showEditTask('${key}')"><img class="show-task-icon" src="img/edit2.svg" alt="">Edit</a>
            </div>
        </div>
    `;
}

/**
 * This function generates the edit task layer by onclick.
 * @param {} task
 * @param {string} key - task key
 * @param {string} contactsHTML - generates the HTML for the contact bubbles
 * @param {string} subtasksHTML - generates the HTML for the subtasks to edit
 * @param {string} highSelected - css-class for the button prio
 * @param {string} highImgSrc - src of the prio image
 * @param {string} mediumSelected - css-class for the button prio
 * @param {string} mediumImgSrc - src of the prio image
 * @param {string} lowSelected - css-class for the button prio
 * @param {string} lowImgSrc - src of the prio image
 * @returns HTML of the edit task layer
 */
function getEditHTML(task, key, contactsHTML, subtasksHTML, highSelected, highImgSrc, mediumSelected, mediumImgSrc, lowSelected, lowImgSrc) {
  return `
        <div class="show-task-firstrow flex-end">
            <div class="show-task-close" onclick="closeTask()">
                <img src="img/add-contact-close.svg" alt="">
            </div>
        </div>
        <div class="edit-scroll-area">
            <div class="edit-task-element">
                <p>Title</p>
                <input type="text" id="edit-title-input" value="${task.title}">
            </div>
            <div class="edit-task-element">
                <p>Description</p>
                <input type="text" id="edit-description-input" value="${task.description}">
            </div>
            <div class="edit-task-element">
                <p>Due Date</p>
                <div class="input-container">
                    <input class="edit-task-input" id="edit-date-input" value="${task.due_date}" required type="date">
                </div>
            </div>
            <div class="edit-task-element">
                <p>Priority</p>
                <div class="buttons">
                    <button id="highButton" onclick="highButton()" class="prio-buttons pb-edit prio-buttons-shadow ${highSelected}">Urgent <img id="highButtonImg" src="${highImgSrc}"></button>
                    <button id="mediumButton" onclick="mediumButton()" class="prio-buttons pb-edit prio-buttons-shadow ${mediumSelected}">Medium <img id="mediumButtonImg" src="${mediumImgSrc}"></button>
                    <button id="lowButton" onclick="lowButton()" class="prio-buttons pb-edit prio-buttons-shadow ${lowSelected}">Low <img id="lowButtonImg" src="${lowImgSrc}"></button>
                </div>
            </div>
            <div class="edit-task-element">
                <p>Assigned to</p>
                <div onclick="showContacts()" class="select-contact select-contact-edit">
                    <span>Select contact to assign</span>
                    <img src="add_task_img/arrow-down.svg" alt="">
                </div>
                <div class="add-task-contacts add-task-contacts-edit d-none" id="add-task-contacts"></div>
                <div class="edit-task-contacts">
                    ${contactsHTML}
                </div>
            </div>
            <div class="edit-task-element">
                <p>Subtasks</p>
                <div class="subtask-layout">
                    <input placeholder="add new subtask" onclick="newSubtask()" id="subtask-field" class="subtasks-field">
                    <div class="d-none" id="edit-subtask"></div>
                    <img onclick="newSubtask()" id="subtask-plus" class="subtask-plus" src="add_task_img/plus.svg" alt="">  
                </div>
                <div class="create-subtask pos-relative" id="create-subtask">${subtasksHTML}</div>
            </div>
        </div>
        <div class="show-task-lastrow">
            <button class="button-dark" onclick="saveTaskChanges('${key}')">Ok <img src="add_task_img/check-white.svg" alt=""></button>
        </div>
    `;
}

/**
 * This function returns the code for the add task layer in board.html.
 * @param {*} boardCategory - board category
 * @param {*} contactsHTML - HTML for the already added contacts rendered in the layer.
 * @returns code for the add task layer in board.html
 */
function generateAddTaskLayer(boardCategory, contactsHTML) {
  return `
          <div class="add-task-section add-task-section-layer width-auto no-margin-left">
        <div class="add-task-firstrow align-items-start">
            <h1 class="headline">Add Task</h1>
            <div class="show-task-close" onclick="closeTask()">
                    <img src="img/add-contact-close.svg" alt="">
                </div>
        </div>
        <div class="add-task-content border-bottom scroll">
            <div class="left-section">
                
                <p class="title-headline">Title<span class="span-red">*</span></p>
                <input class="title" id="title-input" onkeyup="emptyTitle()" required type="text"
                    placeholder="Enter a title">
                <span id="title-required"></span>
                <p class="description">Description</p>
                <textarea placeholder="Enter a Description" name="" id="description-input"></textarea>
                <p class="assigned-to">Assigned to</p>

                <div id="select-contact" onclick="showContacts()" class="select-contact">
                    <span>Select contact to assign</span>
                    <img src="add_task_img/arrow-down.svg" alt="">
                </div>
                <div class="add-task-contacts d-none" id="add-task-contacts">

                </div>
                <div id="add-task-contactsHTML" class="edit-task-contacts-site">
                    ${contactsHTML}
                </div>
                
            </div>

            <div class="parting-line"></div>

            <div class="right-section">
                <p>Due date<span class="span-red">*</span></p>
                <input class="date-input" onclick="emptyDate()" id="date-input" required type="date">
                <span id="date-required"></span>

                <p class="prio">Prio</p>
                <div class="buttons">
                    <button id="highButton" onclick="highButton()" class="prio-buttons">Urgent <img id="highButtonImg"
                            src="add_task_img/high.svg"></button>
                    <button id="mediumButton" onclick="mediumButton()" class="prio-buttons">Medium <img id="mediumButtonImg"
                            src="add_task_img/medium.svg"></button>
                    <button id="lowButton" onclick="lowButton()" class="prio-buttons">Low <img id="lowButtonImg"
                            src="add_task_img/low.svg"></button>
                </div>

                <p class="category">Category<span class="span-red">*</span></p>
                <div class="dropdown-category">
                    <div id="category-input" onclick="category()" required class="category-menu">
                        <span id="task-category">Select task category</span>
                        <img src="add_task_img/arrow-down.svg" alt="">
                    </div>
                    <div id="category-required"></div>
                    <div class="d-none" id="category"></div>
                </div>

                <p class="subtasks">Subtasks</p>
                <div class="subtask-layout">
                    <input placeholder="add new subtask" onclick="newSubtask()" id="subtask-field" class="subtasks-field">
                    <div class="d-none" id="edit-subtask"></div>
                    <img onclick="newSubtask()" id="subtask-plus" class="subtask-plus" src="add_task_img/plus.svg" alt="">
                </div>
                <div id="subtask-required"></div>
                <div class="create-subtask pos-relative-add" id="create-subtask"></div>
                <div class="mobile-create">
                <div class="required-text-mobile bottom-0 required-text-mobile-layer mt12">
                    <p><span class="span-red">*</span>This field is required</p>
                    <div>
                        <button onclick="createTask()" class="create-task-button-mobile">Create Task <img
                                src="add_task_img/check-white.svg" alt=""></button>
                    </div>
                </div>
            </div>
                
            </div>
            
        </div>
        
        
        <div class="add-task-bottom">
            <div class="required-text  required-text-layer">
                <p><span class="span-red">*</span>This field is required</p>
            </div>
            

            <div class="bottom-buttons bottom-buttons-layer">
                <button onclick="clearTask()" class="clear-button">Clear <img src="add_task_img/x.svg" alt=""></button>
                <button id="create-task" onclick="createTask('${boardCategory}')" class="create-task-button">Create Task <img
                        src="add_task_img/check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
    <div id="added-to-board">
        <img id="addedBoardImg" src="./add_task_img/Added to board.svg" alt="">
    </div>
      `;
}

/**
 * This function retruns the code for the contact bubbles in the task cards on board.html.
 * @param {object} contact
 * @returns code for the contact bubbles in the task cards on board.html
 */
function generateContact(contact) {
  const initials = getInitials(contact.name);
  return `
          <div class="task-on-board-contact" style="background-color: ${contact.color};">${initials}</div>
      `;
}

/**
 * This function returns the code of the last contact bubble in the task cards on board.html,
 * which shows the number of the further contacts more than four.
 * @param {number} remainingContacts - further contacts mor than four
 * @returns code of the last contact bubble in the task cards on board.html
 */
function generateRemainingContactsHTML(remainingContacts) {
  return `
        <div class="task-on-board-contact" style="background-color: white; color: black; border: 1px solid black;">+${remainingContacts}</div>
    `;
}

/**
 * This function returns the code of the icons shown wehn clicking on the plus for  new subtask
 * in add_task.html and in the add task layer in board.html.
 * @returns a close- and a check-img
 */
function newSubtaskHTML() {
  return `<div id="closeAndCheck" class="closeAndCheck">
    <img id="closeSubtask" onclick="closeSubtask()" src="add_task_img/close.svg" alt="" />
    <div class="subtask-line"></div>
    <img onclick="createSubtask()" id="checkSubtask" src="add_task_img/check.svg" alt="" />
  </div>`;
}

/**
 * This function returns the code for a new added subtask as a list element in
 * add_task.html and in the add task layer in board.html.
 * @param {number} i
 * @param {object} subtask
 * @returns list-element with edit- and save-button
 */
function createSubtaskHTML(i, subtask) {
  return `<div id="subtask-tasks${i}" class="subtasks-tasks">
      <div>
        <ul class="subtask-list">
          <li id="subtask-${i}" ondblclick="changeSubtask(${i})" class="subtask-list-element">${subtask.title}</li>
        </ul>
      </div>
      <div class="subtask-list-icons">
        <img id="edit-logo${i}" onclick="whichSourceSubtask(${i})" src="add_task_img/edit.svg" alt="" />
        <div class="subtask-line"></div>
        <img onclick="deleteSubtask(${i})" src="add_task_img/delete.svg" alt="" />
      </div>
    </div>`;
}

/**
 * This function returns the code for a new added subtask as a list element in
 * add_task.html and in the add task layer in board.html.
 * @param {number} i
 * @param {object} subtask
 * @returns list-element with edit- and save-button
 */
function renderSubtasksHTML(i, subtask) {
  return `
      <div id="subtask-tasks${i}" class="subtasks-tasks">
        <div>
          <ul class="subtask-list">
            <li id="subtask-${i}" ondblclick="changeSubtask(${i})" class="subtask-list-element">${subtask.title}</li>
          </ul>
        </div>
        <div class="subtask-list-icons">
          <img id="edit-logo${i}" onclick="whichSourceSubtask(${i})" src="add_task_img/edit.svg" alt="Delete" />
          <div class="subtask-line"></div>
          <img onclick="deleteSubtask(${i})" src="add_task_img/delete.svg" alt="" />
        </div>
      </div>`;
}
