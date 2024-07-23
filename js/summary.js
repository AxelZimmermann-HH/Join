/**
 * This function initializes summary.html with body onload
 */
async function summaryInit() {
    await fetchTasksJson();
    generateCounts();
    generateGreets();
    generateUpcomingDate();
    generateInitials();
}

/**
 * This function generates the correct numbers in the fields counting tasks in the board categories.
 */
function generateCounts() {
    let toDo = document.getElementById('toDoCount');
    let done = document.getElementById('doneCount');
    let inProgress = document.getElementById('inProgressCount');
    let awaitFeedback = document.getElementById('awaitFeedbackCount');
    let urgent = document.getElementById('urgentCount');
    let allTasks = document.getElementById('allTasks');

    toDo.innerHTML = ''
    toDo.innerHTML = counter('to-do');

    done.innerHTML = '';
    done.innerHTML = counter('done');

    inProgress.innerHTML = '';
    inProgress.innerHTML = counter('in-progress');

    awaitFeedback.innerHTML = '';
    awaitFeedback.innerHTML = counter('await-feedback');

    urgent.innerHTML = '';
    urgent.innerHTML = countUrgentTasks();

    allTasks.innerHTML = '';
    allTasks.innerHTML = countAllTasks();
}

/**
 * This function returns the number of tasks in the relevant boar category.
 * @param {string} category 
 * @returns number of tasks in the relevant boar category
 */
function counter(category) {
    return tasksArray.filter(task => task.board_category === category).length;
}

/**
 * This function returns the number of tasks with the prio urgent.
 * @returns the number of tasks with the prio urgent
 */
function countUrgentTasks() {
    return tasksArray.filter(task => task.prio === 'urgent').length;
}

/**
 * This function returns the number of all tasks on the board.
 * @returns the number of all tasks on the board
 */
function countAllTasks() {
    return tasksArray.length;
}

/**
 * This function generates the day time and shows the name of the logged in user.
 */
function generateGreets() {
    let greetingTime = getGreeting();
    let userName = sessionStorage.getItem('userName');
    let content = document.getElementById('greeting-container');
    if (userName === "Guest") {
        content.innerHTML = '';
        content.innerHTML = `<span class="greet-text">Good ${greetingTime}</span>`
    } else {
        content.innerHTML = '';
        content.innerHTML = `<span class="greet-text">Good ${greetingTime},</span>
          <span class="greet-user-name">${userName}</span>
          `;
    }

}

/**
 * This function returns the current day time.
 * @returns the current day time
 */
function getGreeting() {
    let now = new Date();
    let hours = now.getHours();

    if (hours >= 5 && hours < 12) {
        return "morning";
    } else if (hours >= 12 && hours < 18) {
        return "afternoon";
    } else if (hours >= 18 && hours < 22) {
        return "evening";
    } else {
        return "night";
    }
}

/**
 * This function pushes the closest due date of all urgent tasks.
 */
function generateUpcomingDate() {
    let content = document.getElementById('upcomingDate');
    content.innerHTML = '';
    content.innerHTML = getClosestUrgentDueDate();
}

/**
 * This function returns the closest due date of all urgent tasks.
 * @returns the closest due date of all urgent tasks
 */
function getClosestUrgentDueDate() {
    let urgentTasks = tasksArray.filter(task => task.prio === 'urgent');

    if (urgentTasks.length === 0) {
        return null;
    }

    let currentDate = new Date();
    let closestDate = null;
    let minDifference = Infinity;

    urgentTasks.forEach(task => {
        let dueDate = new Date(task.due_date);
        let difference = dueDate - currentDate;

        if (difference >= 0 && difference < minDifference) {
            minDifference = difference;
            closestDate = dueDate;
        }
    });

    if (closestDate) {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        return closestDate.toLocaleDateString('en-US', options);
    } else {
        return null;
    }
}

/**
 * This function handles the animation of the two relevant containers on mobile devices.
 */
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 800) {
        const greetingContainer = document.querySelector('.greeting-container');
        const summaryCardContainer = document.querySelector('.summary-card-container');
        

        if (!localStorage.getItem('greetingShown')) {
            localStorage.setItem('greetingShown', 'true');
            setTimeout(() => {
                greetingContainer.classList.add('hidden');
                setTimeout(() => {
                    summaryCardContainer.classList.add('visible');                    
                }, 1000);
            }, 2000); 
        } else {
            summaryCardContainer.classList.add('visible');
        }
    } else {
        document.querySelector('.summary-card-container').style.display = 'block';
    }
});







