
let num = 0;
let OXO = false;
let cells = [[], [], [], []];
let freeCells = [];
let enemy = false;
let locked = false;
let field = document.getElementById('field');

let button = document.getElementsByClassName('semi-transparent-button')[0];
button.addEventListener('click', startGame);

function startGame() {
    setParams();
    clearField();
    addCells();
}

function setParams() {
    enemy = document.getElementById('pve').checked;
    OXO = document.getElementById('cross').checked;
}

function clearField() {
    for (let child of field.children) {
        child.parentElement.removeChild(child);
    }
}

function addCells() {
    let counter = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            cells[i][j] = document.createElement('div');
            cells[i][j].className = 'cell';
            cells[i][j].addEventListener('click', click);

            if (enemy) {
                cells[i][j].addEventListener('click', enemiesGame);
            }

            field.appendChild(cells[i][j]);
            freeCells[counter++] = cells[i][j];
        }
    }
}

function click() {
    if (locked) return;
    
    locked = true;
    clickActions(this);
    this.removeEventListener('click', click);
}

function clickActions(cell) {
    fillCell(cell);
    endOrContinue();
}


function fillCell(cell) {
    cell.innerHTML = player();
    let index = freeCells.indexOf(cell);
    freeCells.splice(index, 1);
    num++;
}

function endOrContinue() {
    if (win()) {
        return final(player() + ' is winner!');
    }

    if (num === 16) {
        return final('Draw!');
    }
    
    locked = false;
    OXO = !OXO;
}

function win() {
    let horizontal = '';
    let vertical = '';
    let diagonal1 = '';
    let diagonal2 = '';
    
    for (let i = 0; i < 4; i++) {
        horizontal = cells[i][0].innerHTML + cells[i][1].innerHTML + cells[i][2].innerHTML + cells[i][3].innerHTML;
        vertical = cells[0][i].innerHTML + cells[1][i].innerHTML + cells[2][i].innerHTML + cells[3][i].innerHTML;
        
        if (horizontal === '✘✘✘✘' || horizontal === 'OOOO' || vertical === '✘✘✘✘' || vertical === 'OOOO') {
            return true;
        }

        diagonal1 += cells[i][i].innerHTML;
        diagonal2 += cells[i][3 - i].innerHTML;
    }

    if (diagonal1 === '✘✘✘✘' || diagonal1 === 'OOOO' || diagonal2 === '✘✘✘✘' || diagonal2 === 'OOOO') {
        return true;
    }
}


function final(string) {
    let message = document.createElement('div');
    message.innerHTML = string;
    message.className = 'text';
    document.body.appendChild(message);

    let button = document.createElement('div');
    button.innerHTML = "⟳";
    button.className = 'semi-transparent-button';
    button.addEventListener('click', retry);
    document.body.appendChild(button);
}


function player() {
    return OXO ? "✘" : "O";
}

function retry() {
    location.reload();
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function enemiesGame () {
    if (locked) return;
    
    locked = true;
    let r = getRandom(freeCells.length);
    setTimeout(() => clickActions(freeCells[r]), 300);
    this.removeEventListener('click', enemiesGame);
    freeCells[r].removeEventListener('click', enemiesGame);
    freeCells[r].removeEventListener('click', click);
}