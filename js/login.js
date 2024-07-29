import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/**
 * Firebase configuration object.
 * @type {Object}
 */
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

/**
 * Initializes Firebase app.
 * @type {firebase.app.App}
 */
const app = initializeApp(firebaseConfig);

/**
 * Gets the database service for the default app or a given app.
 * @type {firebase.database.Database}
 */
const database = getDatabase(app);

/**
 * Executes when the window loads.
 */
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

/**
 * Initializes the sign-in form.
 */
function init() {
    const signinForm = document.getElementById('signinForm');
    const signinButton = document.getElementById('signinButton');

    if (signinForm && signinButton) {
        setupFormSubmission(signinForm);
    } 
}

/**0
 * Sets up the form submission event listener.
 * @param {HTMLFormElement} form - The form element to attach the event listener to.
 */
function setupFormSubmission(form) {
    form.addEventListener('submit', login);
}

document.getElementById('checkbox').addEventListener('click', checkBoxClicked);

/**
 * Handles the checkbox click event for remembering user credentials.
 */
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

/**
 * Handles the login form submission.
 * 
 * @param {Event} event - The form submission event.
 */
function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (localStorage.getItem('rememberMe') === 'true') {
        storeCredentials(email, password);
    }

    validateUser(email, password).then(result => {
        if (result.isAuthenticated) {
            handleSuccess(result.name);
        } else {
            showError();
        }
    }).catch(showError);
}

/**
 * Stores the user's credentials in local storage.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
function storeCredentials(email, password) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
}

/**
 * Handles successful authentication.
 * 
 * @param {string} userName - The authenticated user's name.
 */
function handleSuccess(userName) {
    sessionStorage.setItem('userName', userName);
    localStorage.removeItem('greetingShown');
    goToSummary();
}

/**
 * Displays an error message indicating incorrect password.
 */
function showError() {
    document.getElementById('wrongPasswordConteiner').innerHTML = 'Ups! your password don’t match';
    document.getElementById('pasowrdConteiner').classList.add('login-red');
}


/**
 * Validates the user credentials against the Firebase database.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to an object indicating if the user is authenticated and their name.
 */
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
        return { isAuthenticated: false };
    }).catch(() => {
        return { isAuthenticated: false };
    });
}

document.getElementById('signupButton').addEventListener('click', goTosignup);

/**
 * Redirects the user to the signup page.
 */
function goTosignup() {
    window.location.href = 'signup.html';
}

document.getElementById('guestLoginButton').addEventListener('click', guestLogin);

/**
 * Handles the guest login event.
 * @param {Event} event - The form submit event.
 */
function guestLogin(event) {
    event.preventDefault();
    localStorage.removeItem('greetingShown'); 
    goToSummary();
    sessionStorage.setItem('userName', 'Guest');
}
