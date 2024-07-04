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

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');
    const acceptPolicyCheckbox = document.getElementById('acceptPolicy');

    // Enable the signup button only if the privacy policy is accepted
    acceptPolicyCheckbox.addEventListener('change', function() {
        console.log('Checkbox checked:', this.checked); // Log checkbox state
        signupButton.disabled = !this.checked;
        console.log('Signup button disabled:', signupButton.disabled); // Log button state
    });

    // Handle form submission
    signupForm.addEventListener('submit', function(event) {
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

        // Perform signup logic here (e.g., send data to Firebase)
        const usersRef = ref(database, 'users');
        push(usersRef, {
            name: name,
            email: email,
            password: password
        })
        .then(() => {
            alert('Signup successful!');
            // Redirect to index.html after signup
            window.location.href = 'index.html'; // Change to your target page
        })
        .catch((error) => {
            console.error('Error pushing data to Firebase: ', error);
            alert('Error signing up, please try again.');
        });
    });

    function validateName(name) {
        const nameParts = name.split(' ');
        return nameParts.length >= 2 && nameParts[0] && nameParts[1];
    }

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    }
});
