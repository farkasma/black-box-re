class Tile {
    element;
    ball = false
}

var field = document.getElementById("field")
var size = 5
var balls = 3
var board = []
var exits = 1

initialize()

function initialize() {
    field.setAttribute("style", "width: " + (size + 2) * 20 + "px; height: " + (size + 2) * 20 + "px")
    for (let i = 0; i < size + 2; i++) {
        board[i] = []
        for (let j = 0; j < size + 2; j++) {
            var tempelem = document.createElement("div")
            tempelem.classList.add("tile")
            if ((i == 0 || i == size + 1) && (j == 0 || j == size + 1)) {
                tempelem.classList.add("corner")
            } else if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                tempelem.classList.add("edge")
                tempelem.setAttribute("onclick", "laser(" + i + ", " + j + ")")
            } else {
                tempelem.classList.add("inner")
                tempelem.setAttribute("onclick", "reveal(" + i + ", " + j + ")")
                tempelem.setAttribute("oncontextmenu", "flag(" + i + ", " + j + "); return false;")
            }
            tempelem.style.left = j * 20 + "px"
            tempelem.style.top = i * 20 + "px"
            var temptile = new Tile
            temptile.element = tempelem
            board[i][j] = temptile
            field.appendChild(tempelem)
        }
    }
    var i = balls
    while (i > 0) {
        var x, y
        x = Math.floor(Math.random() * 5 + 1)
        y = Math.floor(Math.random() * 5 + 1)
        if (board[x][y].ball === false) {
            board[x][y].ball = true
            i--
        }
    }
}

function laser(r, c) {
    var startr = r
    var startc = c
    var start = board[r][c]
    if (start.element.innerHTML != "") return
    var x = 0, y = 0 //x: row delta, y: column delta
    switch (r) {
        case 0: x = 1; break;
        case 6: x = -1; break;
        default:
            switch (c) {
                case 0: y = 1; break;
                case 6: y = -1; break;
            }
    }
    var state = 0
    while (state != 12) {
        switch (state) {
            case 0:
                if (board[r + x][c + y].ball === true) {
                    start.element.innerHTML = "H"
                    state = 12
                    break
                }
                state = 1
                break
            case 1:
                if (x == 0) {
                    if (board[r + 1][c + y].ball === true) {
                        start.element.innerHTML = "R"
                        state = 12
                        break
                    }
                    if (board[r - 1][c + y].ball === true) {
                        start.element.innerHTML = "R"
                        state = 12
                        break
                    }
                } else { //y = 0
                    if (board[r + x][c + 1].ball === true) {
                        start.element.innerHTML = "R"
                        state = 12
                        break
                    }
                    if (board[r + x][c - 1].ball === true) {
                        start.element.innerHTML = "R"
                        state = 12
                        break
                    }
                }
                r += x
                c += y
                state = 2
                break
            case 2:
                if (board[r][c].element.classList.contains("edge")) {
                    state = 11
                } else {
                    state = 3
                }
                break
            case 3:
                if (board[r + x][c + y].ball === true) {
                    start.element.innerHTML = "H"
                    state = 12
                    break
                }
                state = 4
                break
            case 4:
                if (x == 0) {
                    state = 5
                } else { //y == 0
                    state = 8
                }
                break
            case 5:
                if (board[r + 1][c + y].ball === true) {
                    state = 6
                } else {
                    state = 7
                }
                break
            case 6:
                if (board[r - 1][c + y].ball === true) {
                    y = -y
                } else {
                    y = 0
                    x = -1
                }
                r += x
                c += y
                state = 2
                break
            case 7:
                if (board[r - 1][c + y].ball === true) {
                    y = 0
                    x = 1
                }
                r += x
                c += y
                state = 2
                break
            case 8:
                if (board[r + x][c + 1].ball === true) {
                    state = 9
                } else {
                    state = 10
                }
                break
            case 9:
                if (board[r + x][c - 1].ball === true) {
                    x = -x
                } else {
                    x = 0
                    y = -1
                }
                r += x
                c += y
                state = 2
                break
            case 10:
                if (board[r + x][c - 1].ball === true) {
                    x = 0
                    y = 1
                }
                r += x
                c += y
                state = 2
                break
            case 11:
                if (startr == r && startc == c) {
                    board[r][c].element.innerHTML = "R"
                    state = 12
                    break
                } else {
                    start.element.innerHTML = exits
                    board[r][c].element.innerHTML = exits
                    exits++
                    state = 12
                    break
                }
        }
    }
}

function reveal(r, c) {
    if (board[r][c].ball === true) {
        console.log("yes")
    }
}

function flag(r, c) {
    if (board[r][c].element.firstChild == null) {
        board[r][c].element.appendChild(document.createElement("div"))
        board[r][c].element.firstChild.classList.add("ball")
    } else {
        board[r][c].element.removeChild(board[r][c].element.firstChild)
    }
}
