class Tile {
    element;
    ball
}

var field = document.getElementById("field")
var size = 5
var balls = 3
var board = []

initialize()

function initialize() {
    field.setAttribute("style", "width: " + (size + 2) * 20 + "px; height: " + (size + 2) * 20 + "px")
    for (let i = 0; i < size + 2; i++) {
        board[i] = []
        for (let j = 0; j < size + 2; j++) {
            var tempelem = document.createElement("div")
            var temptile = new Tile
            tempelem.classList.add("tile")
            if ((i == 0 || i == size + 1) && (j == 0 || j == size + 1)) {
                tempelem.classList.add("corner")
            } else if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                tempelem.classList.add("edge")
                tempelem.setAttribute("onclick", "laser(" + i + ", " + j + ")")
                temptile.ball = "0"
            } else {
                tempelem.classList.add("inner")
                tempelem.setAttribute("onclick", "reveal(" + i + ", " + j + ")")
                temptile.ball = false
            }
            tempelem.setAttribute("style", "left: " + j * 20 + "px; top: " + i * 20 + "px")
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
            board[x][y].element.appendChild(document.createElement("div"))
            board[x][y].ball = true
            i--
        }
    }
}

function laser(r, c) {
    var start = board[r][c]
    if (start.element.innerHTML != "") return
    var x = 0, y = 0
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
    while (state != 7) {
        switch (state) {
            case 0:
                if (board[r + x][c + y].ball === true) {
                    start.element.innerHTML = "H"
                    state = 7
                    break
                }
                state = 1
                break
            case 1:
                if (x == 0) {
                    if (board[r + 1][c + y].ball === true) {
                        start.element.innerHTML = "R"
                        state = 7
                        break
                    }
                    if (board[r - 1][c + y].ball === true) {
                        start.element.innerHTML = "R"
                        state = 7
                        break
                    }
                } else { //y = 0
                    if (board[r + x][c + 1].ball === true) {
                        start.element.innerHTML = "R"
                        state = 7
                        break
                    }
                    if (board[r + x][c - 1].ball === true) {
                        start.element.innerHTML = "R"
                        state = 7
                        break
                    }
                }
                r += x
                c += y
                state = 2
                break
            case 2:
        }
    }
    if (board[r + x][c + y].ball === true) {
        start.element.innerHTML = "H"
        break
    } else {
        if (x == 0) {
            if (board[r + 1][c + y].ball === true) {
                if (firstrow) {
                    start.element.innerHTML = "R"
                    break
                } else {
                    both = true
                }
            }
            if (board[r - 1][c + y].ball === true) {
                if (firstrow) {
                    start.element.innerHTML = "R"
                    break
                } else {
                    if (both) {
                        y = -y
                        break
                    } else {
                        y = 0
                        x = 1
                    }
                }
            }
            if (both) {
                y = 0
                x = -1
            }
        } else { //y = 0
            if (board[r + x][c + 1].ball === true) {
                if (firstrow) {
                    start.element.innerHTML = "R"
                    break
                } else {
                    both = true
                }
            }
            if (board[r + x][c - 1].ball === true) {
                if (firstrow) {
                    start.element.innerHTML = "R"
                    break
                } else {
                    if (both) {
                        x = -x
                        break
                    } else {
                        y = 1
                        x = 0
                    }
                }
            }
            if (both) {
                y = -1
                x = 0
            }
        }
        firstrow = false
    }
    r += x
    c += y
    console.log("edge")
}

function reveal(r, c) {
    if (board[r][c].ball === true) {
        board[r][c].element.firstChild.classList.add("ball")
    }
    console.log("inner")
}