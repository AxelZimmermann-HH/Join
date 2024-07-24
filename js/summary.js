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

    toDo.innerHTML = counter('to-do');
    done.innerHTML = counter('done');
    inProgress.innerHTML = counter('in-progress');
    awaitFeedback.innerHTML = counter('await-feedback');
    urgent.innerHTML = countUrgentTasks();
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
    
    if (window.innerWidth <= 800) {
        if (content) {
            content.parentNode.removeChild(content);
        }
    } else {
        if (content) {
            content.innerHTML = userName === "Guest" 
                ? `<span class="greet-text">Good ${greetingTime}!</span>` 
                : `<span class="greet-text">Good ${greetingTime},</span>
                   <span class="greet-user-name">${userName}</span>`;
        }
    }
}

function getGreeting() {
    let now = new Date();
    let hours = now.getHours();
    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    if (hours >= 18 && hours < 22) return "evening";
    return "night";
}

function generateUpcomingDate() {
    let content = document.getElementById('upcomingDate');
    content.innerHTML = getClosestUrgentDueDate();
}

function getClosestUrgentDueDate() {
    let urgentTasks = tasksArray.filter(task => task.prio === 'urgent');
    if (urgentTasks.length === 0) return '';

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
        return '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const animationScreen = document.getElementById('animationScreen');
    const summaryCardContainer = document.querySelector('.summary-card-container');

    if (window.innerWidth <= 800) {
        if (!localStorage.getItem('greetingShown')) {
            localStorage.setItem('greetingShown', 'true');
            if (animationScreen) {
                let greetingTime = getGreeting();
                let userName = sessionStorage.getItem('userName');
                animationScreen.innerHTML = userName === "Guest" 
                    ? `<span class="greet-text">Good ${greetingTime}</span>` 
                    : `<div class="greeting-user-animation"><span class="greet-text">Good ${greetingTime},</span>
                       <span class="greet-user-name">${userName}</div></span>`;
                       
                animationScreen.classList.remove('hidden');
                animationScreen.classList.add('fadeIn');
                setTimeout(() => {
                    animationScreen.classList.remove('fadeIn');
                    animationScreen.classList.add('fadeOut');
                    setTimeout(() => {
                        animationScreen.classList.add('hidden');
                        if (summaryCardContainer) {
                            summaryCardContainer.classList.add('visible');
                        }
                    }, 1000); // Duration of fadeOut animation
                }, 1000); // Display greeting for 1 second
            }
        } else {
            if (summaryCardContainer) {
                summaryCardContainer.classList.add('visible');
            }
        }
    } else {
        if (summaryCardContainer) {
            summaryCardContainer.classList.add('visible');
        }
    }
});

function logout() {
    localStorage.removeItem('greetingShown');
    // Other logout logic
}