function showGameOverScreen(score) {
    cancelAnimationFrame(gameLoop);  // Játékciklus leállítása
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Játék vége!', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText(`Elért pontszám: ${score}`, canvas.width / 2, canvas.height / 2);

    const restartButton = document.createElement('button');
    restartButton.innerText = 'Újraindítás';
    restartButton.style.position = 'absolute';
    restartButton.style.left = `${canvas.width / 2 - 50}px`;
    restartButton.style.top = `${canvas.height / 2 + 50}px`;
    restartButton.style.padding = '10px 20px';
    restartButton.style.margin = '0 auto';
    restartButton.style.display = 'block';
    restartButton.style.fontSize = '20px';
    document.body.appendChild(restartButton);

    restartButton.addEventListener('click', function () {
        location.reload();
    });
}
