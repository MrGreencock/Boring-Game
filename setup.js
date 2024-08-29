// setup.js

// Canvas és context definiálása
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Képek betöltése
const images = {};

// Betöltendő képek listája
const imageSources = {
    astley: 'astley.png',
    weak: 'idosek.png',
    average: 'koverlaszlo.png',
    advanced: 'nemethszilard.png',
    pro: 'viktor.png'
};

// Képek betöltése és visszajelzés a betöltés befejezéséről
function loadImages(callback) {
    let loadedImages = 0;
    const totalImages = Object.keys(imageSources).length;

    for (let key in imageSources) {
        images[key] = new Image();
        images[key].src = imageSources[key];
        images[key].onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                callback();
            }
        };
        images[key].onerror = () => {
            console.error(`Hiba történt a(z) ${imageSources[key]} kép betöltése során.`);
        };
    }
}

// Képek betöltésének indítása és az intro elindítása
loadImages(() => {
    console.log('Minden kép betöltődött.');
    startIntro();
});
