function updateImageSource() {
    var image = document.getElementById('responsive-image');
    var startingScreen = document.getElementById('startingScreen');

    if (window.innerWidth <= 428) {
        image.src = './img/Capa.png';
        document.body.style.backgroundColor = '#2A3647';
        startingScreen.style.left = '38px';
        startingScreen.style.top = '37px';
        // Additional adjustments as needed for smaller screens
    } else {
        image.src = './img/Capa 2.png';
        document.body.style.backgroundColor = '#F6F7F8';
        startingScreen.style.left = '583px';
        startingScreen.style.top = '345px';
        // Additional adjustments for larger screens
    }
}

window.addEventListener('resize', updateImageSource);
window.addEventListener('load', updateImageSource);

const startingScreen = document.getElementById('startingScreen');
const image = document.getElementById('responsive-image');

startingScreen.addEventListener('animationend', function() {
    if (window.innerWidth <= 428) {
        image.src = './img/Capa 2.png';
        document.body.style.backgroundColor = '#F6F7F8';
    }
});