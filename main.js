// const for HTML elements
const startBtn = document.querySelector("#startBtn")
const resetBtn = document.querySelector("#resetBtn")
const displayText = document.querySelector(".aside-btm")
const displayTime = document.querySelector(".aside-top-left")
const displayScore = document.querySelector(".aside-top-right")
const displayNo1 = document.querySelector("#first")
const displayNo2 = document.querySelector("#second")
const displayNo3 = document.querySelector("#third")
const textIns = document.querySelector(".instructions")
const insBtn = document.querySelector("#insBtn")
const hideIns = document.querySelector("#hideIns")
const radioBtns = document.querySelectorAll('input[name="mode"]')

//Time Display including score increases per every 10 seconds played && win at 1 minute
let sec = 0;
let min = 0;
let score = 0;
let bestScore = []

function countSeconds() {
    sec += 1;
    if (sec < 10) {
        displayTime.innerText = `Time : 00 : 0${sec}`
    } else if (sec === 60) {
        min += 1;
        sec = 0;
        score += 100;
        displayTime.innerText = `Time : 0${min} : 0${sec}`
        scoreTracker();
        endGameWin();
        textWin();
    } else {
        displayTime.innerText = `Time : 00 : ${sec}`
        if (sec === 10 || sec === 20 || sec === 30 || sec === 40 || sec === 50) {
            score += 20;
        }
    }
}

//ScoreTrackers
function scoreTracker() {
    displayScore.innerText = `Score : ${score}`;
}

function bestScoreCalc() {
    bestScore.sort(function (a, b) { return b - a });
    if (bestScore.length === 1) {
        displayNo1.innerText = `1. ${bestScore[0]}`
        displayNo2.innerText = `2. `
        displayNo3.innerText = `3. `
    } else if (bestScore.length === 2) {
        displayNo1.innerText = `1. ${bestScore[0]}`
        displayNo2.innerText = `2. ${bestScore[1]}`
        displayNo3.innerText = `3. `
    } else {
        displayNo1.innerText = `1. ${bestScore[0]}`
        displayNo2.innerText = `2. ${bestScore[1]}`
        displayNo3.innerText = `3. ${bestScore[2]}`
    }
}


// Ants set up --- empty arrays for each base where ants will be "pushed" into once game starts
let antsTop = []
let antsBtm = []
let antsLeft = []
let antsRight = []

// Ants set up --- time for each intervals stored as variables (to be adjusted throughout the game based on kitty/brown ant collision)
let antTime = {
    T: 1000,
    B: 1000,
    L: 1000,
    R: 1000
}

function resetAntsTime() {
    Object.keys(antTime).forEach(key => antTime[key] = 1000)
}

//Ants set up --- Loop boolean set up to turn true/false based on collision activity to detect each collision activity only once at a time & start/stop pushing ants freely throughout the game

let antLoop = {
    T: true,
    B: true,
    L: true,
    R: true
}

function antLoopAllT() {
    Object.keys(antLoop).forEach(key => antLoop[key] = true)
}

function antLoopAllF() {
    Object.keys(antLoop).forEach(key => antLoop[key] = false)
}


//function for ants generator including randomRatio for red ants getting mixed-in
let randomRatio;
let randomTop = () => {
    if (antLoop.T) {
        if (Math.random() < randomRatio) {
            redPush("top")
        }
        else {
            antsTop.push(new component(410, 20, 22, 15, "./media/brown ant Down.png", "image", true, "brown"))
            setTimeout(randomTop, antTime.T)
        }
    }
    else if (inGame) { setTimeout(randomTop, antTime.T) }
}

let randomBtm = () => {
    if (antLoop.B) {
        if (Math.random() < randomRatio) {
            redPush("btm")
        }
        else {
            antsBtm.push(new component(410, 650, 22, 15, "./media/brown ant Up.png", "image", true, "brown"))
            setTimeout(randomBtm, antTime.B)
        }
    }
    else if (inGame) { setTimeout(randomBtm, antTime.B) }
}

let randomLeft = () => {
    if (antLoop.L) {
        if (Math.random() < randomRatio) {
            redPush("left")
        }
        else {
            antsLeft.push(new component(20, 330, 15, 22, "./media/brown ant Right.png", "image", true, "brown"))
            setTimeout(randomLeft, antTime.L)
        }
    }
    else if (inGame) { setTimeout(randomLeft, antTime.L) }
}

let randomRight = () => {
    if (antLoop.R) {
        if (Math.random() < randomRatio) {
            redPush("right")
        }
        else {
            antsRight.push(new component(810, 330, 15, 22, "./media/brown ant Left.png", "image", true, "brown"))
            setTimeout(randomRight, antTime.R)
        }
    }
    else if (inGame) { setTimeout(randomRight, antTime.R) }
}

//function for red ants generator
function redPush(location) {
    switch (location) {
        case ("top"):
            antsTop.push(new component(410, 20, 28, 18, "./media/red ant Down.png", "image", true, "red"))
            setTimeout(randomTop, antTime.T)
            break
        case ("btm"):
            antsBtm.push(new component(410, 650, 28, 18, "./media/red ant Up.png", "image", true, "red"))
            setTimeout(randomBtm, antTime.B)
            break
        case ("left"):
            antsLeft.push(new component(20, 330, 28, 18, "./media/red ant Right.png", "image", true, "red"))
            setTimeout(randomLeft, antTime.L)
            break
        case ("right"):
            antsRight.push(new component(810, 330, 28, 18, "./media/red ant Left.png", "image", true, "red"))
            setTimeout(randomRight, antTime.R)
            break
    }
}

//game area set up, to be run once game startGame function is triggered    
let gameArea = {
    canvas: document.querySelector("canvas"),
    start: function () {
        mp3background.play();
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        canvas.setAttribute('height', getComputedStyle(canvas)['height']);
        canvas.setAttribute('width', getComputedStyle(canvas)['width']);
        this.interval = setInterval(updateGameArea, 60);
        allBasesT();
        inGame = true;
        stateRedBlocks = true;
        antLoopAllT();
        this.topInterval = setTimeout(randomTop, antTime.T)
        this.btmInterval = setTimeout(randomBtm, antTime.B)
        this.leftInterval = setTimeout(randomLeft, antTime.L)
        this.rightInterval = setTimeout(randomRight, antTime.R)
        this.timerInterval = setInterval(countSeconds, 1000)
        this.fishInterval = setTimeout(itemFish, 3000)
        this.trapInterval = setTimeout(itemTrap, 5000)
        this.redBlocksInterval = setInterval(randomBlocks, 7000)
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// setting up game pieces and audio for game start
function startGame() {
    treasure = new component(345, 285, 140, 100, "./media/treasure.png", "image", true)
    kitty = new component(150, 150, 100, 100, "./media/Cat 15.png", "image", true)
    fish = new component(100, 100, 70, 50, "./media/fish.png", "image", false, "item")
    trap = new component(900, 100, 80, 60, "./media/trap.png", "image", false, "item")
    baseTop = new component(325, 0, 180, 20, "#666868", "base", true)
    baseBtm = new component(325, 650, 180, 20, "#666868", "base", true)
    baseLeft = new component(0, 245, 20, 180, "#666868", "base", true)
    baseRight = new component(810, 245, 20, 180, "#666868", "base", true)
    mp3base = new sound("./media/basehit.mp3", "effect")
    mp3fish = new sound("./media/fish.mp3", "effect")
    mp3background = new sound("./media/background.mp3", "background")
    mp3redblocks = new sound("./media/redblocks.mp3", "effect")
    mp3ants = new sound("./media/ants.mp3", "effect")
    mp3gameover = new sound("./media/gameover.mp3", "effect")
    mp3gamewin = new sound("./media/gamewin.mp3", "effect")
    mp3hiss = new sound("./media/hiss.mp3", "effect")
    modeCheck();
    speedReg();
    antsTop = []
    antsBtm = []
    antsLeft = []
    antsRight = []
    gameArea.start();
}

//variable set up for different difficulty mode -- stretch goal
let inGame; // boolean to be used to make sure when game stops, all time/interval activities stop immediately
let gameMode;
let regSpeed;
let slowSpeed = 0.1;

function modeCheck() {
    for (radiobtn of radioBtns) {
        if (radiobtn.checked) {
            gameMode = radiobtn.value;
        }
    }
    if (gameMode === "easy") {
        randomRatio = 0.1;
        regSpeed = 1.2;
    }
    else if (gameMode === "medium") {
        randomRatio = 0.2;
        regSpeed = 1.5;
        trap.width = 100;
        trap.height = 70;
    }
    else if (gameMode === "hard") {
        randomRatio = 0.3;
        regSpeed = 1.8;
        trap.width = 100;
        trap.height = 70;
    }
}

// OOP -- game pieces and sound classes

class component {
    constructor(x, y, width, height, color, type, alive, desc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.alive = alive;
        this.desc = desc;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
    }

    render() {
        const ctx = gameArea.context;
        if (this.type == "image") {
            if (this.alive) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            }
        } else {
            if (this.alive) {
                ctx.fillStyle = this.color
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
        }
    }
}

class sound {
    constructor(src, type) {
        this.sound = document.createElement("audio");
        this.src = src;
        this.type = type;
        this.sound.setAttribute("autostart", "0");
        this.sound.setAttribute("controls", "false");
        this.sound.setAttribute("volume", "0.3");
        this.sound.setAttribute("src", this.src);
        this.sound.setAttribute("paused", "true")
        this.sound.style.display = "none";
        if (this.type === "background") {
            this.sound.setAttribute("loop", "true");
            this.sound.setAttribute("volume", "0.1");
        }
        document.body.appendChild(this.sound);
        this.sound.load();
    }
    play() {
        this.sound.play();
    }

    stop() {
        this.sound.pause();
    }
}

//Game Loop -- where all game pieces and collision detections are rendered
function updateGameArea() {
    if (inGame) {
        gameArea.clear();
        baseTop.render();
        baseBtm.render();
        baseLeft.render();
        baseRight.render();
        treasure.render();
        kitty.render();
        scoreTracker();
        fish.render();
        trap.render();
        hitAntTreasure();
        hitBases();
        hitAnts();
        detectFish();
        detectTrap();
        detectHitRed();
    }
}


// "Key" events for game character (kitty) and detection between kitty/treasure
let numH = 0;
function movementHandler(e) {
    if (inGame) {
        const speed = 45;
        switch (e.keyCode) {
            case (38):
                kitty.y -= speed;
                if (kitty.y < 0) {
                    kitty.y = 0
                }
                if (detectHitKT(kitty, treasure)) {
                    kitty.y += speed;
                }
                break
            case (40):
                kitty.y += speed;
                if (kitty.y + kitty.height > canvas.height) {
                    kitty.y = canvas.height - kitty.height
                }
                if (detectHitKT(kitty, treasure)) {
                    kitty.y -= speed;
                }
                break
            case (37):
                kitty.x -= speed;
                if (kitty.x < 0) {
                    kitty.x = 0
                }
                if (detectHitKT(kitty, treasure)) {
                    kitty.x += speed;
                }
                break
            case (39):
                kitty.x += speed;
                if (kitty.x + kitty.width > canvas.width) {
                    kitty.x = canvas.width - kitty.width
                }
                if (detectHitKT(kitty, treasure)) {
                    kitty.x -= speed;
                }
                break
            case (72):
                if (gameMode === "easy") {
                    numH++
                    if (numH < 3) {
                        kitty.x = 10;
                        kitty.y = 10;
                        score -= 20;
                        antsTop = []
                        antsBtm = []
                        antsLeft = []
                        antsRight = []
                        mp3hiss.play();
                        textHiss();
                        allBasesT();
                    }
                    else { textNoHiss() }
                    break
                } else { noHissAllowed() }
        }
    }
}



//basic function for all collisions
function detectHit(objOne, objTwo) {
    const left = objOne.x + objOne.width >= objTwo.x + 15
    const right = objOne.x <= objTwo.x + objTwo.width - 15
    const top = objOne.y + objOne.height >= objTwo.y + 15
    const bottom = objOne.y <= objTwo.y + objTwo.height - 15
    if (left && right && top && bottom) {
        return true
    } else {
        return false
    }
}

//collision between kitty and treasure to adjust some pixels for more flexibility for kitty around the canvas
function detectHitKT(objOne, objTwo) {
    const left = objOne.x + objOne.width >= objTwo.x + 40
    const right = objOne.x <= objTwo.x + objTwo.width - 40
    const top = objOne.y + objOne.height >= objTwo.y + 40
    const bottom = objOne.y <= objTwo.y + objTwo.height - 40
    if (left && right && top && bottom) {
        return true
    } else {
        return false
    }
}

//ants rendering function including detect hit between ants and treasure
let speed = {
    T: 0,
    B: 0,
    L: 0,
    R: 0
}

function speedReg() {
    Object.keys(speed).forEach(key => speed[key] = regSpeed)
}

function speedZero() {
    Object.keys(speed).forEach(key => speed[key] = 0)
}

function hitAntTreasure() {
    for (let i = 0; i < antsTop.length; i++) {
        antsTop[i].y += speed.T
        antsTop[i].render();
        if (detectHit(antsTop[i], treasure)) {
            textAntsWin();
            endGame();
        }
    }
    for (let i = 0; i < antsBtm.length; i++) {
        antsBtm[i].y -= speed.B
        antsBtm[i].render();
        if (detectHit(antsBtm[i], treasure)) {
            textAntsWin();
            endGame();
        }
    }
    for (let i = 0; i < antsLeft.length; i++) {
        antsLeft[i].x += speed.L
        antsLeft[i].render();
        if (detectHit(antsLeft[i], treasure)) {
            textAntsWin();
            endGame();
        }
    }
    for (let i = 0; i < antsRight.length; i++) {
        antsRight[i].x -= speed.R
        antsRight[i].render();
        if (detectHit(antsRight[i], treasure)) {
            textAntsWin();
            endGame();
        }
    }
}

// detect kitty and bases: <state> booleans to avoid multiple detection in one collision & to make sure player does not hit same base twice in a row
let stateBase = {
    T: true,
    B: true,
    L: true,
    R: true
}

function allBasesT() {
    Object.keys(stateBase).forEach(key => stateBase[key] = true)
}

function allBasesF() {
    Object.keys(stateBase).forEach(key => stateBase[key] = false)
}

function hitBases() {
    if (stateBase.T) {
        if (detectHit(kitty, baseTop)) {
            mp3base.play();
            baseTop.color = "lightgreen";
            setTimeout(() => { baseTop.color = "#666868" }, 600)
            antLoop.T = false;
            antsTop = []
            score += 30;
            setTimeout(restartTop, 3000)
            stateBase.T = false;
            stateBase.B = true;
            stateBase.L = true;
            stateBase.R = true;
            textBaseHit();
        }
    }
    if (stateBase.B) {
        if (detectHit(kitty, baseBtm)) {
            mp3base.play();
            baseBtm.color = "lightgreen";
            setTimeout(() => { baseBtm.color = "#666868" }, 600)
            antLoop.B = false;
            antsBtm = []
            score += 30;
            setTimeout(restartBtm, 3000)
            stateBase.T = true;
            stateBase.B = false;
            stateBase.L = true;
            stateBase.R = true;
            textBaseHit();
        }
    }
    if (stateBase.L) {
        if (detectHit(kitty, baseLeft)) {
            mp3base.play();
            baseLeft.color = "lightgreen";
            setTimeout(() => { baseLeft.color = "#666868" }, 600)
            antLoop.L = false;
            antsLeft = []
            score += 30;
            setTimeout(restartLeft, 3000)
            stateBase.T = true;
            stateBase.B = true;
            stateBase.L = false;
            stateBase.R = true;
            textBaseHit();
        }
    }
    if (stateBase.R) {
        if (detectHit(kitty, baseRight)) {
            mp3base.play();
            baseRight.color = "lightgreen";
            setTimeout(() => { baseRight.color = "#666868" }, 600)
            antLoop.R = false;
            antsRight = []
            score += 30;
            setTimeout(restartRight, 3000)
            stateBase.T = true;
            stateBase.B = true;
            stateBase.L = true;
            stateBase.R = false;
            textBaseHit();
        }
    }
}

//functions to reset to normal speed/time/loops after each collision activity    
function restartTop() {
    antLoop.T = true;
    antTime.T = 1000;
    speed.T = regSpeed;
}
function restartBtm() {
    antLoop.B = true;
    antTime.B = 1000;
    speed.B = regSpeed;
}
function restartLeft() {
    antLoop.L = true;
    antTime.L = 1000;
    speed.L = regSpeed;
}
function restartRight() {
    antLoop.R = true;
    antTime.R = 1000;
    speed.R = regSpeed;
}


// detect kitty to ants (brown ants -- slow down speed to 0.1, red ants -- game over)  
function hitAnts() {
    if (inGame) {
        for (let i = 0; i < antsTop.length; i++) {
            if (detectHit(kitty, antsTop[i])) {
                if (antsTop[i].desc === "red") {
                    endGame();
                    textRedAnts();
                } else {
                    speed.T = slowSpeed;
                    antTime.T = 3000;
                    mp3ants.play();
                    setTimeout(restartTop, 3000)
                }
            }
        }

        for (let i = 0; i < antsBtm.length; i++) {
            if (detectHit(kitty, antsBtm[i])) {
                if (antsBtm[i].desc === "red") {
                    endGame();
                    textRedAnts();
                } else {
                    speed.B = slowSpeed;
                    antTime.B = 3000;
                    mp3ants.play();
                    setTimeout(restartBtm, 3000)
                }
            }
        }

        for (let i = 0; i < antsLeft.length; i++) {
            if (detectHit(kitty, antsLeft[i])) {
                if (antsLeft[i].desc === "red") {
                    endGame();
                    textRedAnts();
                } else {
                    speed.L = slowSpeed;
                    antTime.L = 3000;
                    mp3ants.play();
                    setTimeout(restartLeft, 3000)
                }
            }
        }

        for (let i = 0; i < antsRight.length; i++) {
            if (detectHit(kitty, antsRight[i])) {
                if (antsRight[i].desc === "red") {
                    endGame();
                    textRedAnts();
                } else {
                    speed.R = slowSpeed;
                    antTime.R = 3000;
                    mp3ants.play();
                    setTimeout(restartRight, 3000)
                }
            }
        }
    }
}

// set up items (fish & trap) to random axis -- stretch goal
let xArrFish = [533, 650, 700, 505, 304, 297, 104, 189, 74, 313, 532, 542, 244]
let yArrFish = [235, 114, 454, 566, 411, 118, 117, 442, 555, 459, 132, 154, 228]

let indexF;
let indexT;
let fishTimeout;
function itemFish() {
    if (inGame) {
        indexF = Math.round(Math.random() * xArrFish.length)
        fish.x = xArrFish[indexF]
        fish.y = yArrFish[indexF]
        fish.alive = true;
        setTimeout(() => {
            fish.alive = false
        }, 3000)
    }
    fishTimeout = setTimeout(itemFish, 7000)
}



function detectFish() {
    if (fish.alive && detectHit(kitty, fish)) {
        antLoopAllF();
        fish.alive = false;
        mp3fish.play();
        score += 50;
        speedZero();
        textFish();
        setTimeout(() => {
            antLoopAllT();
            speedReg();
        }, 2000)
    }
}

let trapTimeout;
let xArrTrap = [103, 734, 748, 258, 636, 243, 645, 236, 211, 694, 487, 321, 315]
let yArrTrap = [90, 496, 137, 451, 474, 182, 172, 95, 591, 531, 438, 431, 156]

function itemTrap() {
    if (inGame) {
        indexT = Math.round(Math.random() * xArrTrap.length)
        trap.x = xArrTrap[indexT]
        trap.y = yArrTrap[indexT]
        trap.alive = true;
        setTimeout(() => {
            trap.alive = false
        }, 3000)
    }
    trapTimeout = setTimeout(itemTrap, 10000)
}



function detectTrap() {
    if (trap.alive && detectHit(kitty, trap)) {
        trap.alive = false;
        endGame();
        textTrap();
    }
}

// random red blocks to appear throughout game -- added feature to avoid player from running around the edges the whole game
let indexRed;
let stateRedBlocks = true;
let redBlocks = []

function randomBlocks() {
    indexRed = Math.random() * 4
    switch (true) {
        case (indexRed <= 1):
            redBlocks.push(new component(540, 0, 280, 20, "red", "base", true, "item"))
            redBlocks.push(new component(20, 0, 280, 20, "red", "base", true, "item"))
            redBlocks.push(new component(20, 650, 280, 20, "red", "base", true, "item"))
            break
        case (indexRed <= 2 && indexRed > 1):
            redBlocks.push(new component(540, 650, 280, 20, "red", "base", true, "item"))
            redBlocks.push(new component(20, 650, 280, 20, "red", "base", true, "item"))
            break
        case (indexRed <= 3 && indexRed > 2):
            redBlocks.push(new component(0, 20, 20, 200, "red", "base", true, "item"))
            redBlocks.push(new component(0, 450, 20, 200, "red", "base", true, "item"))
            break
        case (indexRed <= 3 && indexRed > 3):
            redBlocks.push(new component(810, 20, 20, 200, "red", "base", true, "item"))
            redBlocks.push(new component(810, 450, 20, 200, "red", "base", true, "item"))
            redBlocks.push(new component(540, 0, 280, 20, "red", "base", true, "item"))
            break
    }
    setTimeout(() => { redBlocks = [] }, 5000)
}

function detectHitRed() {
    for (i = 0; i < redBlocks.length; i++) {
        redBlocks[i].render();
        if (stateRedBlocks && detectHit(kitty, redBlocks[i])) {
            stateRedBlocks = false;
            score -= 30;
            mp3redblocks.play();
            textRedBlocks();
            setTimeout(() => { stateRedBlocks = true }, 2000)
        }
    }
}

// Game over and Game Win to reset all items needed  prior to reset button is clicked to clear out the whole canvas and time/score
function endGame() {
    resetVar();
    bestScore.push(score)
    bestScoreCalc();
    mp3gameover.play();
}

function endGameWin() {
    resetVar();
    bestScore.push(score)
    bestScoreCalc();
    mp3gamewin.play();
}

function resetVar() {
    inGame = false;
    antLoopAllF();
    allBasesF();
    clearInterval(gameArea.interval)
    clearInterval(gameArea.timerInterval)
    redBlocks = []
    regSpeed;
    randomRatio;
    speedZero();
    resetAntsTime();
    mp3background.stop();
    clearInterval(gameArea.redBlocksInterval);
    clearTimeout(fishTimeout);
    clearTimeout(trapTimeout);
}

//Event Listeners for all buttons
document.addEventListener("keydown", movementHandler)

startBtn.addEventListener("click", () => {
    textIns.style.display = "none"
    canvas.style.display = ""
    startBtn.disabled = true;
    textStart();
    startGame();
})

insBtn.addEventListener("click", () => {
    textIns.style.display = "block"
    canvas.style.display = "none"
})

hideIns.addEventListener("click", () => {
    textIns.style.display = "none"
    canvas.style.display = ""
})

resetBtn.addEventListener("click", () => {
    resetVar();
    gameArea.clear();
    constructor = null
    score = 0;
    sec = 0;
    min = 0;
    numH = 0;
    startBtn.disabled = false;
    scoreTracker();
    displayTime.innerText = `Time: 00 : 00`
    textClear();
})

// Messages to be displayed in Text area according to activity through out the game

let msgTrack; // to make sure the setTimeouts avoid clearing text from next activity
let textBaseHit = () => {
    textClear();
    displayText.innerText = "Base Attack! +30"
    displayText.style.color = "green"
    displayText.style.backgroundColor = "lightgreen"
    msgTrack = 1
    if (inGame) { setTimeout(() => { if (msgTrack === 1) { textClear } }, 2000) }
}

let textAntsWin = () => {
    textClear();
    displayText.innerText = "Game Over 😿 Try Again!"
    displayText.style.color = "#F5B7B1"
    displayText.style.backgroundColor = "#CB4335"
}

let textRedAnts = () => {
    textClear();
    displayText.innerText = "Red Ants are Poisonous! Game Over 😿 "
    displayText.style.color = "#F5B7B1"
    displayText.style.backgroundColor = "#CB4335"
}

let textFish = () => {
    textClear();
    displayText.innerText = "Yummy!😺 +50"
    displayText.style.color = "#AED6F1"
    displayText.style.backgroundColor = "#2E86C1"
    msgTrack = 2
    if (inGame) { setTimeout(() => { if (msgTrack === 2) { textClear } }, 2000) }
}

let textTrap = () => {
    textClear();
    displayText.innerText = "Kitty is trapped! Game Over 😿 "
    displayText.style.color = "#F5B7B1"
    displayText.style.backgroundColor = "#CB4335"
}

let textRedBlocks = () => {
    textClear();
    displayText.innerText = "Red Block Alert -30 "
    displayText.style.color = "#CB4335"
    msgTrack = 3
    if (inGame) { setTimeout(() => { if (msgTrack === 3) { textClear } }, 2000) }
}

let textStart = () => {
    textClear();
    displayText.innerText = "Start! Good Luck Kitty 🍀"
    displayText.style.color = "#16A085"
    msgTrack = 4
    if (inGame) { setTimeout(() => { if (msgTrack === 4) { textClear } }, 2000) }
}

let textWin = () => {
    textClear();
    displayText.innerText = "Kitty saves the day! +100 🎉 "
    displayText.style.color = "#D1F2EB"
    displayText.style.backgroundColor = "#16A085"
}

let textHiss = () => {
    textClear();
    displayText.innerText = "Hiss Hiss 😼"
    displayText.style.color = "#F7DC6F"
    msgTrack = 5
    if (inGame) { setTimeout(() => { if (msgTrack === 5) { textClear } }, 2000) }
}

let textNoHiss = () => {
    textClear();
    displayText.innerText = "Ants are not scared anymore 🙀"
    displayText.style.color = "#EC7063"
    msgTrack = 6
    if (inGame) { setTimeout(() => { if (msgTrack === 6) { textClear } }, 2000) }
}

let noHissAllowed = () => {
    textClear();
    displayText.innerText = "Hissing is not allowed in this mode 😿"
    displayText.style.color = "#EC7063"
    msgTrack = 7
    if (inGame) { setTimeout(() => { if (msgTrack === 7) { textClear } }, 2000) }
}

let textClear = () => {
    displayText.innerText = ""
    displayText.style.color = "#D2B4DE"
    displayText.style.backgroundColor = "black"
}


