// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "https://join-23123-default-rtdb.firebaseio.com/",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', init);

/**
 * Initializes the signup form and its elements.
 */
function init() {
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');
    const acceptPolicyImage = document.getElementById('acceptPolicy');

    if (signupForm && signupButton && acceptPolicyImage) {
        setupFormSubmission(signupForm);
    } else {
        console.error('One or more elements not found in the DOM');
    }
}

/**
 * Toggles the checkbox image and enables/disables the signup button.
 */
function toggleCheckboxImage() {
    const image = document.getElementById('acceptPolicy');
    const signupButton = document.getElementById('signupButton');

    if (image.src.includes('Rectangle1.png')) {
        image.src = 'img/Rectangle2.png';
        signupButton.disabled = false;
    } else {
        image.src = 'img/Rectangle1.png';
        signupButton.disabled = true;
    }
}

/**
 * Sets up the form submission event listener.
 * @param {HTMLFormElement} form - The signup form element.
 */
function setupFormSubmission(form) {
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!validateName(name)) {
        alert('Please enter both your first and last name.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    signupUser(name, email, password);
}

/**
 * Validates the name to ensure it contains at least a first and last name.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(name) {
    const nameParts = name.split(' ');
    return nameParts.length >= 2 && nameParts[0] && nameParts[1];
}

/**
 * Validates the email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

/**
 * Signs up the user by pushing their data to the Firebase Realtime Database.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
function signupUser(name, email, password) {
    const usersRef = ref(database, 'users');
    push(usersRef, {
        name: name,
        email: email,
        password: password
    })
    .then(() => {
        alert('Signup successful!');
        window.location.href = 'index.html'; 
    })
    .catch((error) => {
        console.error('Error pushing data to Firebase: ', error);
        alert('Error signing up, please try again.');
    });
}

// Attach the function to the window object to make it globally accessible
window.toggleCheckboxImage = toggleCheckboxImage;
