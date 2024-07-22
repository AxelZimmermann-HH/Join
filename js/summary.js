async function summaryInit() {
    await fetchTasksJson();
    generateCounts();
    generateGreets();
    generateUpcomingDate();
    generateInitials();
}

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


function counter(category) {
    return tasksArray.filter(task => task.board_category === category).length;
}

function countUrgentTasks() {
    return tasksArray.filter(task => task.prio === 'urgent').length;
}

function countAllTasks() {
    return tasksArray.length;
}

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

function generateUpcomingDate() {
    let content = document.getElementById('upcomingDate');
    content.innerHTML = '';
    content.innerHTML = getClosestUrgentDueDate();
}

function getClosestUrgentDueDate() {
    let urgentTasks = tasksArray.filter(task => task.prio === 'urgent');

    if (urgentTasks.length === 0) {
        return null; // Keine dringenden Aufgaben vorhanden
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
        // Formatieren des nächstliegenden Datums im Format "Month DD, YYYY"
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        return closestDate.toLocaleDateString('en-US', options);
    } else {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth <= 800) {
        const greetingContainer = document.querySelector('.greeting-container');
        const summaryCardContainer = document.querySelector('.summary-card-container');

        setTimeout(() => {
            greetingContainer.classList.add('hidden');
            setTimeout(() => {
                summaryCardContainer.classList.add('visible');
            }, 1000); // Match this duration with the CSS transition duration for opacity
        }, 2000); // Duration to wait before starting the fade-out
    } else {
        document.querySelector('.summary-card-container').style.display = 'block';
    }
});







