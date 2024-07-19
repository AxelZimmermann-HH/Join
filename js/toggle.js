

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