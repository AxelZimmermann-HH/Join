

let input_toggle = document.getElementById('toggle_button')
let password_input = document.getElementById('loginPassword')


function changeImage() {
    input_toggle.src = './img/visibility.png'
}

function toggle() {


    if (password_input.type === 'password') {
        password_input.type = 'text'
        input_toggle.src = './img/visibility_off.png'
    } else {
        password_input.type = 'password'
        input_toggle.src = './img/visibility.png'
    }
}

let signup_toggle_confirm  = document.getElementById('toggle_button_confirm')
let signup_password = document.getElementById('password')
let confirm_signup_password = document.getElementById('confirmPassword')
let signup_toggle  = document.getElementById('toggle_button')

function changeImageSignupConfirm() {
    signup_toggle.src = './img/visibility.png'
}

function changeImageSignup() {
    signup_toggle.src = './img/visibility.png'
}

function signupToggleConfirm() {


    if (confirm_signup_password.type === 'password') {
        confirm_signup_password.type = 'text'
        signup_toggle_confirm.src = './img/visibility_off.png'
    } else {
        confirm_signup_password.type = 'password'
        signup_toggle_confirm.src = './img/visibility.png'
    }
}

//function changeImageSignup() {
    //signup_toggle.src = './img/visibility.png'
//}

function signupToggle() {


    if (signup_password.type === 'password') {
        signup_password.type = 'text'
        signup_toggle.src = './img/visibility_off.png'
    } else {
        signup_password.type = 'password'
        signup_toggle.src = './img/visibility.png'
    }
}