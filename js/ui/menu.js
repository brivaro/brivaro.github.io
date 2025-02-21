import { menuSound } from "./music.js";

export const menuIcon = document.getElementById('menuIcon');
export const playerIcon = document.getElementById('playerView');
export const menuOverlay = document.getElementById('menuOverlay');
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

export function setFirstPerson(state) {
    fp = state;
}

export function setMenu(state) {
    menuOpen = state;
}
