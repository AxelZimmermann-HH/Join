function goToSummary() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-summary');
    const img = link.querySelector('img');
    img.src = '../img/sidebar_summary_white.svg'; 
    link.style.backgroundColor = '#091931'; 
    link.style.color = '#FFFFFF'; 
}

function goToTask() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-task');
    const img = link.querySelector('img');
    img.src = '../img/edit_square_white.svg'; 
    link.style.backgroundColor = '#091931'; 
    link.style.color = '#FFFFFF'; 
}

function goToBoard() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-board');
    const img = link.querySelector('img');
    img.src = '../img/sidebar_board_white.svg'; 
    link.style.backgroundColor = '#091931'; 
    link.style.color = '#FFFFFF'; 
}

function goToContacts() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-contacts');
    const img = link.querySelector('img');
    img.src = '../img/sidebar_contacts_white.svg'; 
    link.style.backgroundColor = '#091931'; 
    link.style.color = '#FFFFFF'; 
}

function resetLinks() {
    const defaultLinks = [
        { id: 'link-summary', imgSrc: '../img/sidebar_summary.svg' },
        { id: 'link-task', imgSrc: '../img/edit_square.svg' },
        { id: 'link-board', imgSrc: '../img/sidebar_board.svg' },
        { id: 'link-contacts', imgSrc: '../img/sidebar_contacts.svg' }
    ];
    
    defaultLinks.forEach(linkInfo => {
        const link = document.getElementById(linkInfo.id);
        const img = link.querySelector('img');
        img.src = linkInfo.imgSrc;
        link.style.backgroundColor = ''; 
        link.style.color = ''; 
    });
}

function resetBottomLinks() {
    const links = document.querySelectorAll('.sidebar-menu-bottom a');
    links.forEach(link => {
        link.classList.remove('active');
    });
}

function goToPrivacyPolicy() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-privacy-policy');
    link.classList.add('active');
}

function goToLegalNotice() {
    resetLinks();
    resetBottomLinks();
    const link = document.getElementById('link-legal-notice');
    link.classList.add('active');
}

function toggleMenu() {
    const userContent = document.getElementById('user-content');
    if (userContent.style.display === 'block') {
        userContent.style.display = 'none';
    } else {
        userContent.style.display = 'block';
    }
}


function checkBoxClicked() {
 
    var checkbox = document.getElementById('checkbox');
    
   
    if (checkbox.src.endsWith('Rectangle1.png')) {
        checkbox.src = 'img/Rectangle2.png';
        localStorage.setItem('rememberMe', 'true');
    } else {
        checkbox.src = 'img/Rectangle1.png';
        localStorage.setItem('rememberMe', 'false');
    }
}

function goToSignUp() {
    window.location.href = 'signup.html';
}


