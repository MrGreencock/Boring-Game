// main.js
let player;
let enemies = [];
let score = 0;
let keys = {};
let enemyBullets = [];
let currentMessage = '';

let currentEnemyTypeIndex = 1;
const enemyTypes = ['weak', 'average', 'advanced', 'pro'];
let enemiesDefeated = 0;
const enemyMessages = [
    "Jaj! Még nincs vége, mert jön a közepesen gonosz...",
    "Jaj! Megjelent Kövér László!!!",
    "Óh jaj! Németh Szilárd fel akar falni téged!",
    "Ó ne, csak ezt ne!!! A főni, Viktor!!!"
];

// Játék inicializálása
function startGame() {
    // Játékos inicializálása
    player = {
        x: 100,
        y: canvas.height - 150,
        width: 80,
        height: 120,
        speed: 5,
        lives: 100,
        bullets: []
    };

    // Billentyűk eseménykezelése
    document.addEventListener('keydown', function (e) {
        keys[e.key] = true;
        if (e.key === ' ') {
            shootBullet();
        }
    });

    document.addEventListener('keyup', function (e) {
        keys[e.key] = false;
    });

    // Ellenségek létrehozása időközönként
    setInterval(spawnEnemy, 2000);

    // Játékciklus indítása
    gameLoop();
}

function spawnEnemy() {
    const type = enemyTypes[currentEnemyTypeIndex - 1];
    const enemyMessages = {
        'weak': 'Csak a Fidesz!!!',
        'average': 'Kérem, csönd legyen a Parlamentben!',
        'advanced': 'Turkisi kebab, mekdánelc!',
        'pro': 'Dö matematiksz of lájf hez szám bézik formjulász!'
    };
    const message = enemyMessages[type];
    const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 120),
        width: 80,
        height: 120,
        speed: getEnemySpeed(type),
        image: images[type],
        points: getEnemyPoints(type),
        message: message,
        bulletSpeed: getEnemyBulletSpeed(type),  // Lövedék sebesség hozzárendelése
        bulletCooldown: getEnemyCooldown(type)
    };
    enemies.push(enemy);
}

// Játékciklus
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Játék állapotának frissítése
function update() {
    if(player.lives <= 0) {
        gameOver();
        return;
    }

    // Játékos mozgatása
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Lövedékek mozgatása
    player.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) {
            player.bullets.splice(index, 1);
        }
    });

    // Ellenségek mozgatása és lövedékek kezelése
    enemies.forEach((enemy, enemyIndex) => {
        enemy.x -= enemy.speed;

        if (enemy.bulletCooldown <= 0) {
            shootEnemyBullet(enemy);
            currentMessage = enemy.message; // Üzenet megjelenítése lövéskor
            enemy.bulletCooldown = getEnemyCooldown(enemy.type);
        } else {
            enemy.bulletCooldown--;
        }

        if (isColliding(player, enemy)) {
            player.lives -= 5;
            enemies.splice(enemyIndex, 1);
            if (player.lives <= 0) {
                gameOver();
            }
        }

        player.bullets.forEach((bullet, bulletIndex) => {
            if (isColliding(bullet, enemy)) {
                score += enemy.points;
                currentMessage = `${enemy.message}`; // Üzenet megjelenítése elpusztításkor
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                enemiesDefeated++;
            }
            if (enemiesDefeated >= 10) {
                enemiesDefeated = 0;
                currentEnemyTypeIndex++;
                if (currentEnemyTypeIndex < enemyTypes.length) {
                    currentMessage = enemyMessages[currentEnemyTypeIndex - 1];
                    setTimeout(() => {
                        currentMessage = '';
                        spawnEnemy();
                    }, 2000);
                }
            }
        });

        if (enemy.x + enemy.width < 0) {
            player.lives -= 5;
            enemies.splice(enemyIndex, 1);
            if (player.lives <= 0) {
                gameOver();
            }
        }
    });

    enemyBullets.forEach((bullet, index) => {
        bullet.x -= bullet.speed;
        if (bullet.x + bullet.width < 0) {
            enemyBullets.splice(index, 1);
        }
        if (isColliding(bullet, player)) {
            player.lives -= 10;
            enemyBullets.splice(index, 1);
            if (player.lives <= 0) {
                gameOver();
            }
        }
    });

    if (currentEnemyTypeIndex > enemyTypes.length && player.lives > 0) {
        gameWon();
    }
}

// Játék megjelenítése
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Játékos rajzolása
    ctx.drawImage(images.astley, player.x, player.y, player.width, player.height);

    // Lövedékek rajzolása
    player.bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Ellenségek rajzolása
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    enemyBullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // UI rajzolása
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontszám: ${score}`, 55, 30);
    ctx.fillText(`Élet: ${player.lives}`, 50, 60);

    if (currentMessage) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText(currentMessage, canvas.width / 2, canvas.height / 2);
    }
}

// Lövés indítása
function shootBullet() {
    const maxBullets = 1; // Csak egy lövedék lehet egyszerre a képernyőn

    if (player.bullets.length < maxBullets) {
        player.bullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2 - 5,
            width: 20,
            height: 10,
            speed: 10
        });
    }
}

function gameWon() {
    cancelAnimationFrame(gameLoop); // Játékciklus leállítása
    currentMessage = `Gratulálok! Minden ellenséget legyőztél! Elért pontszámod: ${score}`;
    drawGameOverScreen();
}

function drawGameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Játék vége! <br />', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText(`Elért pontszámod: ${score} <br />`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Gratulálok, legyőzted az összes ellenséget! <br />', canvas.width / 2, canvas.height / 2 + 50);
    ctx.font = '20px Arial';
    ctx.fillText('Nyomj F5-öt a játék újrakezdéséhez!', canvas.width / 2, canvas.height / 2 + 100);
}

// Ellenség lövedékének kilövése
function shootEnemyBullet(enemy) {
    const maxEnemyBullets = 10;
    if (enemyBullets.length < maxEnemyBullets) {
        enemyBullets.push({
            x: enemy.x,
            y: enemy.y + enemy.height / 2 - 5,
            width: 10,
            height: 10,
            speed: enemy.bulletSpeed
        });
    }
}

// Ellenség sebességének meghatározása
function getEnemySpeed(type) {
    switch (type) {
        case 'weak':
            return 3;
        case 'average':
            return 5;
        case 'advanced':
            return 7;
        case 'pro':
            return 10;
        default:
            return 3;
    }
}

// Ellenség pontszámának meghatározása
function getEnemyPoints(type) {
    switch (type) {
        case 'weak':
            return 10;
        case 'average':
            return 20;
        case 'advanced':
            return 30;
        case 'pro':
            return 50;
        default:
            return 10;
    }
}


function getEnemyBulletSpeed(type) {
    switch (type) {
        case 'weak':
            return 6;
        case 'average':
            return 10;
        case 'advanced':
            return 14;
        case 'pro':
            return 20;
        default:
            return 3;
    }
}

function getEnemyCooldown(type) {
    switch (type) {
        case 'weak':
            return 125; // Lassabb lövés
        case 'average':
            return 100;
        case 'advanced':
            return 50;
        case 'pro':
            return 25; // Gyorsabb lövés
        default:
            return 150;
    }
}


// Ütközés detektálása
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Játék vége
function gameOver() {
    cancelAnimationFrame(gameLoop); // Játékciklus leállítása
    currentMessage = `A játék véget ért! Elért pontszámod: ${score}`;
    drawGameOverScreen(); // Játék végi képernyő megjelenítése
}
function drawGameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Játék vége!', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText(`Elért pontszámod: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Sajnos az életed elfogyott.', canvas.width / 2, canvas.height / 2 + 50);
    ctx.font = '20px Arial';
    ctx.fillText('Nyomj F5-öt a játék újrakezdéséhez!', canvas.width / 2, canvas.height / 2 + 100);
}
