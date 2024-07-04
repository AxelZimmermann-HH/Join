window.onload = function() {
    var rememberMe = localStorage.getItem('rememberMe');
    var checkbox = document.getElementById('checkbox');
    if (rememberMe === 'true') {
        checkbox.src = 'img/Rectangle2.png';
    } else {
        checkbox.src = 'img/Rectangle1.png';
    }
}