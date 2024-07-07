const TASKS_URL =
  "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/tasks/";

let tasksData = {}; 
let tasksArray = [];
let tasksKeys = [];

async function boardInit() {
    await fetchTasksJson();
    createTaskOnBoard();
    checkAndAddNoTask();
}

async function fetchTasksJson() {
    try {
        let response = await fetch(TASKS_URL + ".json");
        let responseToJson = await response.json();
        tasksData = responseToJson || {};
        console.log(tasksData);
        tasksArray = Object.values(tasksData);
        console.log(tasksArray);
        tasksKeys = Object.keys(tasksData);
        console.log(tasksKeys);

    } catch (error) {
        console.error("Error fetching data:", error);
        return false; 
    }
}


function createTaskOnBoard() {
    const boardIds = {
        'to-do': 'to-do',
        'in-progress': 'in-progress',
        'await-feedback': 'await-feedback',
        'done': 'done'
    };
    clearBoards(boardIds);

    for (let i = 0; i < tasksArray.length; i++) {
        let task = tasksArray[i];
        let key = tasksKeys[i];

        let contactsHTML = generateContactsHTML(task.contacts);
        let boardId = boardIds[task.board_category] || 'to-do';
        let content = document.getElementById(boardId);
        let prioSrc = handlePrio(task.prio);
        let categoryClass = task.task_category === 'User Story' ? 'user-story' : 'technical-task';

        content.innerHTML += generateTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc);
    }
}


function clearBoards(boardIds) {
    for (let id in boardIds) {
        let content = document.getElementById(boardIds[id]);
        if (content) {
            content.innerHTML = '';
        }
    }
}


function generateContactsHTML(contacts) {
    let contactsHTML = '';
    for (let key in contacts) {
        if (contacts.hasOwnProperty(key)) {
            let contact = contacts[key];
            let initials = getInitials(contact.name);
            contactsHTML += `
                <div class="task-on-board-contact" style="background-color: ${contact.color};">${initials}</div>
            `;
        }
    }
    return contactsHTML;
}


function handlePrio(prio) {
    if (prio === 'urgent') {
        return '/add_task_img/high.svg';
    } else if (prio === 'medium') {
        return '/add_task_img/medium.svg';
    } else if (prio === 'low') {
        return '/add_task_img/low.svg';
    } else {
        return '/add_task_img/medium.svg'; // Fallback falls prio nicht gesetzt ist
    }
}


function generateTaskOnBoardHTML(key, categoryClass, task, i, contactsHTML, prioSrc) {
    
    let totalSubtasks = Object.keys(task.subtasks).length;
    let completedSubtasks = Object.values(task.subtasks).filter(subtask => subtask.completed).length;
    let progressPercentage = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

    return `
        <div onclick="openTask('${key}')" draggable="true" ondragstart="startDragging('${key}')" class="task-on-board">
            <div class="task-on-board-category ${categoryClass}">${task.task_category}</div>
            <div class="task-on-board-headline">${task.title}</div>
            <div class="task-on-board-text">${task.description}</div>
            <div class="task-on-board-subtasks">
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class="task-on-board-subtasks-text">${completedSubtasks}/${totalSubtasks} Subtasks</div>
            </div>
            <div class="task-on-board-lastrow">
                <div class="task-on-board-contacts" id="task-on-board-contacts${i}">
                    ${contactsHTML}
                </div>
                <img src="${prioSrc}" alt="" class="task-on-board-relevance">
            </div>
        </div>
    `;
}


function generateTaskOnBoardHTML2(key, categoryClass, task, i, contactsHTML, prioSrc) {
    return `
        <div onclick="openTask('${key}')" draggable="true" ondragstart="startDragging('${key}')" class="task-on-board">
                <div class="task-on-board-category ${categoryClass}">${task.task_category}</div>
                <div class="task-on-board-headline">${task.title}</div>
                <div class="task-on-board-text">${task.description}</div>
                <div class="task-on-board-subtasks">
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="task-on-board-subtasks-text">1/2 Subtasks</div>
                </div>
                <div class="task-on-board-lastrow">
                    <div class="task-on-board-contacts" id="task-on-board-contacts${i}">
                        ${contactsHTML}
                    </div>
                    <img src="${prioSrc}" alt="" class="task-on-board-relevance">
                </div>
            </div>
    `
}


// Speichert ID der Task
function startDragging(key) {
    currentDraggedTaskKey = key;
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(category) {
    if (currentDraggedTaskKey) {
        await updateTaskBoardCategory(currentDraggedTaskKey, category);
        await fetchTasksJson();
        createTaskOnBoard();
        checkAndAddNoTask();
    }
}


async function updateTaskBoardCategory(key, newBoardCategory) {
    try {
        let response = await fetch(TASKS_URL + key + "/board_category.json", {
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


function getInitials(name) {
    let initials = name.split(' ').map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
}


function checkAndAddNoTask() {
    const taskAreas = ["to-do", "in-progress", "await-feedback", "done"];

    taskAreas.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.children.length === 0) {
            const noTaskDiv = document.createElement("div");
            noTaskDiv.className = "no-task";
            noTaskDiv.innerHTML = `No tasks ${id.replace(/-/g, ' ')}`;
            element.appendChild(noTaskDiv);
        }
    });
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


async function addTask() {
    // let board_category = ;
    // let contacts = ;
    // let description = ;
    // let dueDate = ;
    // let prio = ;
    // let subtasks = ;
    // let taskCategory = ;
    // let title = ;
  
    let newTask = {
        board_category: 'to-do',
        contacts: {
            contact1: {
                color: '#477BFF',
                email: 'yovan.davchev@gmx.net',
                name: 'Yovan Davchev',
                phone: '151978675643'
            },
            contact2: {
                color: '#6CC9FF',
                email: 'ogulcan.erdag@gmx.net',
                name: 'Ogulcan Erdag',
                phone: '160112233445'
            }
        },
        description: "Das ist eine Test-Task",
        due_date: "01.09.2024",
        prio: "medium",
        subtasks: {
            // Beispielhafte Subtasks
            subtask1: {
                title: "Subtask 1",
                completed: false
            },
            subtask2: {
                title: "Subtask 2",
                completed: false
            }
        },
        task_category: "Technical Task",
        title: "Test-Task"
    };

    let postResponse = await postTask("", newTask);
  
    let dataFetched = await boardInit(); // Warten bis die Kontaktliste aktualisiert wurde
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


function generateTaskLayer(task, key) {
    const contactsHTML = Object.values(task.contacts).map(contact => `
        <div class="show-task-contact">
            <div class="show-task-contact-letters" style="background-color: ${contact.color};">${getInitials(contact.name)}</div>
            <p>${contact.name}</p>
        </div>
    `).join('');

    const subtasksHTML = Object.keys(task.subtasks).map(subtaskKey => {
        const subtask = task.subtasks[subtaskKey];
        return `
            <div class="show-task-subtask" onclick="checkSubtask('${key}', '${subtaskKey}', this.querySelector('img'))">
                <img src="/add_task_img/${subtask.completed ? 'subtasks_checked' : 'subtasks_notchecked'}.svg" alt="">
                <p>${subtask.title}</p>
            </div>
        `;
    }).join('');

    return `
        <div class="show-task-firstrow">
            <div class="show-task-category">${task.task_category}</div>
            <div class="show-task-close" onclick="closeTask()">
                <img src="img/add-contact-close.svg" alt="">
            </div>
        </div>
        <h1>${task.title}</h1>
        <p class="show-task-description">${task.description}</p>
        <div class="show-task-text-rows">
            <p class="show-task-characteristic">Due date:</p><p>${task.due_date}</p>
        </div>
        <div class="show-task-text-rows">
            <p class="show-task-characteristic">Priority:</p>
            <p>${task.prio.charAt(0).toUpperCase() + task.prio.slice(1)}</p>
            <img src="/add_task_img/${task.prio}.svg" alt="">
        </div>
        <div class="show-task-text-rows pb8 mt12">
            <p class="show-task-characteristic">Assigned To:</p>
        </div>
        <div class="show-task-contacts">
            ${contactsHTML}
        </div>
        <div class="show-task-text-rows pb8 mt12">
            <p class="show-task-characteristic">Subtasks:</p>
        </div>
        <div class="show-task-subtasks">
            ${subtasksHTML}
        </div>
        <div class="show-task-lastrow mt12">
            <a href="#" class="show-task-lastrow-link" onclick="deleteTask('${key}')"><img class="show-task-icon" src="/add_task_img/delete.svg" alt="">Delete</a>
            <div class="show-task-lastrow-line"></div>
            <a href="#" class="show-task-lastrow-link"><img class="show-task-icon" src="/img/edit2.svg" alt="">Edit</a>
        </div>
    `;
}


function openTask(key) {
    const task = tasksData[key];
    document.getElementById('show-task-layer').classList.remove('d-none');
    let content = document.getElementById('show-task-inner-layer');

    content.classList.remove('slide-in-right');
    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-in-right');

    content.innerHTML = '';
    content.innerHTML += generateTaskLayer(task, key);
}

function closeTask() {
    let contentLayer = document.getElementById('show-task-layer');
    let content = document.getElementById('show-task-inner-layer');
  
    content.classList.remove('slide-out-right');
    void content.offsetWidth; 
    content.classList.add('slide-out-right');
    
    content.removeEventListener('animationend', taskAnimationEnd);
    content.addEventListener('animationend', taskAnimationEnd, { once: true });
  }

function taskAnimationEnd() {
    document.getElementById('show-task-layer').classList.add('d-none');
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
        imgElement.src = updatedStatus ? '/add_task_img/subtasks_checked.svg' : '/add_task_img/subtasks_notchecked.svg';

        await boardInit();
    } catch (error) {
        console.error("Error updating subtask status:", error);
    }
}