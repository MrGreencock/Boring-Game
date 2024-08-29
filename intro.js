// intro.js

function startIntro() {
    const texts = [
        "Polkorrekt Játék",
        "Szembeszállsz a hatalommal?",
        "Induljon a játék!",
        "Vigyázz! Az idősek támadnak!!!"
    ];
    let currentTextIndex = 0;
    let opacity = 0;
    let fadingIn = true;
    const textDuration = 2000; // milliszekundum
    const fadeSpeed = 0.02;

    function drawIntro() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "50px Arial";
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.textAlign = "center";
        ctx.fillText(texts[currentTextIndex], canvas.width / 2, canvas.height / 2);

        if (fadingIn) {
            opacity += fadeSpeed;
            if (opacity >= 1) {
                opacity = 1;
                fadingIn = false;
                setTimeout(() => {
                    fadingIn = false;
                }, textDuration);
            }
        } else {
            opacity -= fadeSpeed;
            if (opacity <= 0) {
                opacity = 0;
                currentTextIndex++;
                if (currentTextIndex < texts.length) {
                    fadingIn = true;
                } else {
                    // Intro vége, játék indítása
                    startGame();
                    return;
                }
            }
        }

        requestAnimationFrame(drawIntro);
    }

    drawIntro();
}
