function toggleMenu() {
    const userContent = document.getElementById('user-content');
    if (userContent.style.display === 'block') {
        userContent.style.display = 'none';
    } else {
        userContent.style.display = 'block';
    }
}

window.onclick = function(event) {
    if (!event.target.matches('#user-logo')) {
        const userContent = document.getElementById('user-content');
        if (userContent.style.display === 'block') {
            userContent.style.display = 'none';
        }
    }
}

