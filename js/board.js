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
    // IDs für verschiedene Board-Kategorien, entsprechen den Firebase-Werten
    const boardIds = {
        'to-do': 'to-do',
        'in-progress': 'in-progress',
        'await-feedback': 'await-feedback',
        'done': 'done'
    };

    // Bereinigen aller board-Kategorien-Bereiche
    for (let id in boardIds) {
        let content = document.getElementById(boardIds[id]);
        if (content) {
            content.innerHTML = '';
        }
    }

    for (let i = 0; i < tasksArray.length; i++) {
        let task = tasksArray[i];
        let key = tasksKeys[i];
        
        // Generiere die Kontakte HTML
        let contactsHTML = generateContactsHTML(task.contacts);
        let boardId = boardIds[task.board_category] || 'to-do';
        let content = document.getElementById(boardId);

        let prioSrc;
        if (task.prio === 'urgent') {
            prioSrc = '/add_task_img/high.svg';
        } else if (task.prio === 'medium') {
            prioSrc = '/add_task_img/medium.svg';
        } else if (task.prio === 'low') {
            prioSrc = '/add_task_img/low.svg';
        } else {
            prioSrc = '/add_task_img/medium.svg'; // Fallback falls prio nicht gesetzt ist
        }

        content.innerHTML += `
            <div draggable="true" ondragstart="startDragging('${key}')" class="task-on-board">
                <div class="task-on-board-category">${task.task_category}</div>
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
        `;
    }
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