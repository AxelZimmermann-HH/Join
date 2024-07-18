import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBLwkvdC-k--cb_0Z5y83ZEtcbRiXMxxKE",
    authDomain: "join-23123.firebaseapp.com",
    databaseURL: "https://join-database-3d39f-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "join-23123",
    storageBucket: "join-23123.appspot.com",
    messagingSenderId: "801789402962",
    appId: "1:801789402962:web:d84538bda53119e058e48b",
    measurementId: "G-CFY9BZ9NV5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.onload = function () {
    const rememberMe = localStorage.getItem('rememberMe');
    const checkbox = document.getElementById('checkbox');
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (rememberMe === 'true') {
        checkbox.src = 'img/Rectangle2.png';
        emailField.value = localStorage.getItem('email');
        passwordField.value = localStorage.getItem('password');
    } else {
        checkbox.src = 'img/Rectangle1.png';
    }
   
    init();
};

function init() {
    const signinForm = document.getElementById('signinForm');
    const signinButton = document.getElementById('signinButton');

    if (signinForm && signinButton) {
        setupFormSubmission(signinForm);
        console.log('Form and button found, event listener set up.');
    } else {
        console.error('One or more elements not found in the DOM');
    }
}

function setupFormSubmission(form) {
    form.addEventListener('submit', login);
    console.log('Event listener for form submission added.');
}

document.getElementById('checkbox').addEventListener('click', checkBoxClicked);

function checkBoxClicked() {
    const checkbox = document.getElementById('checkbox');
    const rememberMe = localStorage.getItem('rememberMe');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (rememberMe === 'true') {
        checkbox.src = 'img/Rectangle1.png';
        localStorage.setItem('rememberMe', 'false');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    } else {
        checkbox.src = 'img/Rectangle2.png';
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    }
}

function login(event) {
    event.preventDefault();
    console.log('Login function called.');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    }

    validateUser(email, password)
        .then((result) => {
            if (result.isAuthenticated) {
                sessionStorage.setItem('userName', result.name); 
                goToSummary();
     
            } else {
                alert('Invalid email or password.');
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            alert('Error logging in, please try again.');
        });
}

function validateUser(email, password) {
    const usersRef = ref(database, 'users');
    return get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (let key in users) {
                if (users[key].email === email && users[key].password === password) {
                    return { isAuthenticated: true, name: users[key].name };                    
                }
            }
        }
        return false;
    }).catch((error) => {
        console.error('Error fetching user data:', error);
        return false;
    });
}

document.getElementById('signupButton').addEventListener('click', goTosignup);

function goTosignup() {
    window.location.href = 'signup.html';
}

document.getElementById('guestLoginButton').addEventListener('click', guestLogin);

function guestLogin(event) {
    event.preventDefault();
    goToSummary();
    sessionStorage.setItem('userName', 'Guest');
}