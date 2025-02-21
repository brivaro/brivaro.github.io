import { menuSound } from "./music.js";

const menuIcon = document.getElementById('menuIcon');
const playerIcon = document.getElementById('playerView');
const menuOverlay = document.getElementById('menuOverlay');
let menuOpen = false;
let fp = false;

export function iniMenu(menuButton, playerView){
    menuButton.addEventListener('click', () => {
        menuOpen  = !menuOpen;
    
        if (menuOpen) {
            menuOverlay.classList.add('open');
            menuIcon.src = "icons/menu-close.png"; // Icono para cerrar el menú
        } else {
            menuOverlay.classList.remove('open');
            menuIcon.src = "icons/menu.png"; // Icono para abrir el menú
        }
        menuSound.play();
        //document.activeElement.blur();
        //menuButton.blur();
    });

    playerView.addEventListener('click', () => {
        fp  = !fp;
    
        if (fp) {
            playerIcon.src = "icons/camera.png"; // Icono para cerrar el menú
        } else {
            playerIcon.src = "icons/fp.png"; // Icono para abrir el menú
        }
        menuSound.play();
        playerView.blur();
    });
}

