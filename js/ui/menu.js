export const menuButton = document.getElementById('menuButton');

const menuIcon = document.getElementById('menuIcon');
const menuOverlay = document.getElementById('menuOverlay');
let menuOpen = false;

menuButton.addEventListener('click', () => {
    menuOpen  = !menuOpen;

    if (menuOpen) {
        menuOverlay.classList.add('open');
        menuIcon.src = "icons/menu-close.png"; // Icono para cerrar el menú
    } else {
        menuOverlay.classList.remove('open');
        menuIcon.src = "icons/menu.png"; // Icono para abrir el menú
    }
});
