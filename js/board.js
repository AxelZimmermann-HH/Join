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