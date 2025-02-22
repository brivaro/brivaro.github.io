// 🎵 Configuración del audio 🎵
export const listener = new THREE.AudioListener();
export const oceanSound = new THREE.Audio(listener);
export const diveSound = new THREE.Audio(listener);
export const fireworkSound = new THREE.Audio(listener);
export const melodySound = new THREE.Audio(listener);
export const dayNightSound = new THREE.Audio(listener);
export const menuSound = new THREE.Audio(listener);
export const walkSound = new THREE.Audio(listener);
export let isMuted = false;

const audioLoader = new THREE.AudioLoader();
const muteButton = document.getElementById('muteButton');
const muteIcon = document.getElementById('muteIcon');

// Cargar sonido boton dia noche
audioLoader.load('../sounds/day.mp3', function(buffer) {
    dayNightSound.setBuffer(buffer);
    dayNightSound.setLoop(false);
    dayNightSound.setVolume(0.7);
});

// Cargar sonido melodia
audioLoader.load('../sounds/melody.mp3', function(buffer) {
    melodySound.setBuffer(buffer);
    melodySound.setLoop(true);
    melodySound.setVolume(0.2);
});

// Cargar sonido walking
audioLoader.load('../sounds/walk.mp3', function(buffer) {
    walkSound.setBuffer(buffer);
    walkSound.setLoop(false);
    walkSound.setVolume(0.6);
});

// Cargar sonido menus
audioLoader.load('../sounds/menu.mp3', function(buffer) {
    menuSound.setBuffer(buffer);
    menuSound.setLoop(false);
    menuSound.setVolume(0.6);
});

// Cargar sonido ambiente (olas)
audioLoader.load('../sounds/ocean.mp3', function(buffer) {
    oceanSound.setBuffer(buffer);
    oceanSound.setLoop(true);
    oceanSound.setVolume(0.5);
    //oceanSound.play();
});

// Cargar sonido de inmersión (bajo el agua)
audioLoader.load('../sounds/dive.mp3', function(buffer) {
    diveSound.setBuffer(buffer);
    diveSound.setLoop(true);
    diveSound.setVolume(0); // Inicialmente en silencio
    //diveSound.play();
});

// Cargar sonido ambiente (olas)
audioLoader.load('../sounds/fireworks.mp3', function(buffer) {
    fireworkSound.setBuffer(buffer);
    fireworkSound.setLoop(true);
    fireworkSound.setVolume(0); // Inicialmente en silencio
    //fireworkSound.play();
});

muteButton.addEventListener('click', () => {
    // Reanudar el AudioContext si aún no está en marcha
    if (listener.context.state === 'suspended') {
        listener.context.resume()/*.then(() => {
            console.log('AudioContext reanudado');
        })*/;
    }
    
    isMuted = !isMuted;
    menuSound.play();

    // Ajustar volumen
    melodySound.setVolume(isMuted ? 0 : 0.2);
    oceanSound.setVolume(isMuted ? 0 : 0.5);
    diveSound.setVolume(isMuted ? 0 : 0.5);

    // Cambiar icono
    muteIcon.src = isMuted ? "icons/sound-off.png" : "icons/sound-on.png";
});

// Función para iniciar la música
export function startAudio() {
    if (listener.context.state === 'suspended') {
        listener.context.resume().then(() => {
            console.log('AudioContext reanudado.');
        });
    }
    melodySound.play();
    oceanSound.play();
    diveSound.play();
    fireworkSound.play();
}
