class Tile {
    element;
    errorElement;
    value = "";
    checkingValue = "";
    ball = false;
    guess = false;
    pair = null
    sync() {
        this.element.innerText = this.value
        if (this.errorElement != null) {
            this.element.appendChild(this.errorElement)
        }
    }
}

var controls = {
    edgeSwap: false,
    innerSwap: false,
    update() {
        this.edgeSwap = document.getElementById("edge-input").checked
        this.innerSwap = document.getElementById("inner-input").checked
    }
}

//Logical variables
var field = document.getElementById("field")
var size = 5
var balls = 3
var board = []
var exits = 1
var checkingExits = 1
var correct = true
var currentPage = "rules"

//Visual variables
var dynamicMargin = window.innerWidth * 0.01
var fieldHeight = (window.innerHeight < window.innerWidth) ? (window.innerHeight - dynamicMargin * 2) : ((window.innerWidth - dynamicMargin * 2) * 0.98)
var tileHeight = fieldHeight / (size + 2)
var tileBorder = ((tileHeight * 0.03) < 1) ? 1 : tileHeight * 0.03
var tileEdge = tileHeight - tileBorder
fieldHeight += tileBorder

initialize()

function initialize() {
    if ((window.innerWidth - fieldHeight - dynamicMargin * 7) > 384) {
        document.getElementById("sidebar-header").setAttribute("style", "width: " + (window.innerWidth - fieldHeight - dynamicMargin * 7) + "px")
        document.getElementById("sidebar").setAttribute("style", "width: " + (window.innerWidth - fieldHeight - dynamicMargin * 7) + "px; top: 12vh")    
        field.setAttribute("style", "width: " + fieldHeight + "px; height: " + fieldHeight + "px")
    } else {
        document.getElementById("sidebar-header").setAttribute("style", "width: 98%; top: " + (fieldHeight + dynamicMargin * 3) + "px")
        document.getElementById("sidebar").setAttribute("style", "width: 98%; top: " + (fieldHeight + window.innerHeight * 0.12) + "px")    
        field.setAttribute("style", "width: " + fieldHeight + "px; height: " + fieldHeight + "px; left: " + ((window.innerWidth - fieldHeight * 1.032) / 2) + "px")
    }
    for (let i = 0; i < size + 2; i++) {
        board[i] = []
        for (let j = 0; j < size + 2; j++) {
            var tempelem = document.createElement("div")
            tempelem.classList.add("tile")
            if ((i == 0 || i == size + 1) && (j == 0 || j == size + 1)) {
                tempelem.classList.add("corner")
                tempelem.style.border = tileBorder + "px transparent solid"
            } else if (i == 0 || i == size + 1 || j == 0 || j == size + 1) {
                tempelem.classList.add("edge")
                tempelem.setAttribute("onclick", "inputWrapper(" + i + ", " + j + ", 'left', false)")
                tempelem.setAttribute("oncontextmenu", "inputWrapper(" + i + ", " + j + ", 'right', false); return false;")
                tempelem.style.border = tileBorder + "px black solid"
            } else {
                tempelem.classList.add("inner")
                tempelem.setAttribute("onclick", "inputWrapper(" + i + ", " + j + ", 'left', true)")
                tempelem.setAttribute("oncontextmenu", "inputWrapper(" + i + ", " + j + ", 'right', true); return false;")
                tempelem.style.border = tileBorder + "px black solid"
            }
            tempelem.style.width = tileEdge + "px"
            tempelem.style.fontSize = (tileEdge * 0.9) + "px"
            tempelem.style.height = tileEdge + "px"
            tempelem.style.left = j * tileHeight + "px"
            tempelem.style.top = i * tileHeight + "px"
            var temptile = new Tile
            temptile.element = tempelem
            board[i][j] = temptile
            field.appendChild(tempelem)
        }
    }
    populate()
}

function inputWrapper(r, c, action, field) {
    controls.update()
    if (action == "left") {
        if (!field) {
            if (!controls.edgeSwap) {
                laser(r, c, false)
                board[r][c].sync()
            } else {
                //placeholder
            }
        } else {
            if (!controls.innerSwap) {
                //placeholder
            } else {
                toggleChild(board[r][c], "ball")
            }
        }
    } else {
        if (!field) {
            if (!controls.edgeSwap) {
                //placeholder
            } else {
                laser(r, c, false)
                board[r][c].sync()
            }
        } else {
            if (!controls.innerSwap) {
                toggleChild(board[r][c], "ball")
            } else {
                //placeholder
            }
        }
    }
}

function populate() {
    var a = balls
    while (a > 0) {
        var x, y
        x = Math.floor(Math.random() * 5 + 1)
        y = Math.floor(Math.random() * 5 + 1)
        if (board[x][y].ball === false) {
            board[x][y].ball = true
            a--
        }
    }
}

function laser(r, c, checking) {
    var startr = r
    var startc = c
    var start = board[r][c]
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
    var read, write, exit
    if (checking) {
        read = "guess"
        write = "checkingValue"
        exit = "checkingExits"
    } else {
        if (start.value != "") return
        read = "ball"
        write = "value"
        exit = "exits"
    }
    var state = 0
    while (state != 12) {
        switch (state) {
            case 0:
                if (board[r + x][c + y][read] === true) {
                    start[write] = "H"
                    state = 12
                    break
                }
                state = 1
                break
            case 1:
                if (x == 0) {
                    if (board[r + 1][c + y][read] === true) {
                        start[write] = "R"
                        state = 12
                        break
                    }
                    if (board[r - 1][c + y][read] === true) {
                        start[write] = "R"
                        state = 12
                        break
                    }
                } else { //y = 0
                    if (board[r + x][c + 1][read] === true) {
                        start[write] = "R"
                        state = 12
                        break
                    }
                    if (board[r + x][c - 1][read] === true) {
                        start[write] = "R"
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
                if (board[r + x][c + y][read] === true) {
                    start[write] = "H"
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
                if (board[r + 1][c + y][read] === true) {
                    state = 6
                } else {
                    state = 7
                }
                break
            case 6:
                if (board[r - 1][c + y][read] === true) {
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
                if (board[r - 1][c + y][read] === true) {
                    y = 0
                    x = 1
                }
                r += x
                c += y
                state = 2
                break
            case 8:
                if (board[r + x][c + 1][read] === true) {
                    state = 9
                } else {
                    state = 10
                }
                break
            case 9:
                if (board[r + x][c - 1][read] === true) {
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
                if (board[r + x][c - 1][read] === true) {
                    x = 0
                    y = 1
                }
                r += x
                c += y
                state = 2
                break
            case 11:
                if (startr == r && startc == c) {
                    board[r][c][write] = "R"
                    state = 12
                    break
                } else {
                    start[write] = window[exit] //not very clean, but will do
                    board[r][c][write] = window[exit]
                    if (!checking) {
                        start.pair = board[r][c]
                        board[r][c].pair = start
                        board[r][c].sync()
                    }
                    window[exit]++
                    state = 12
                    break
                }
        }
    }
}

function checkBoard() {
    var originalExits = exits
    correct = true
    for (let i = 0; i < 7; i += 6) {
        for (let j = 1; j < 6; j++) {
            laser(i, j, true)
            if (board[i][j].value == "") {
                laser(i, j, false)
                checkTile(board[i][j])
                board[i][j].value = ""
                if (board[i][j].pair != null) board[i][j].pair.value = ""
            } else {
                checkTile(board[i][j])
            }
            laser(j, i , true)
            if (board[j][i].value == "") {
                laser(j, i, false)
                checkTile(board[j][i])
                board[j][i].value = ""
                if (board[j][i].pair != null) board[j][i].pair.value = ""
            } else {
                checkTile(board[j][i])
            }
        }
    }
    exits = originalExits
    if (correct == true) {
        setTimeout(() => {
            window.alert("Congratulations!\nYou solved the puzzle.")
        }, 50)
    }
}

function checkTile(tile) {
    if (typeof(tile.value) == "string") {
        if (tile.value != tile.checkingValue) {
            if (tile.errorElement == null) {
                toggleChild(tile, "error")
            }
            correct = false
        } else {
            if (tile.errorElement != null) {
                toggleChild(tile, "error")
            }
        }
    } else {
        if (typeof(tile.checkingValue) == "number") {
            if (tile.pair.checkingValue != tile.checkingValue) { //slightly less ewww
                if (tile.errorElement == null) {
                    toggleChild(tile, "error")
                }
                correct = false
            } else {
                if (tile.errorElement != null) {
                    toggleChild(tile, "error")
                }
            }    
        } else {
            if (tile.errorElement == null) {
                toggleChild(tile, "error")
            }
            correct = false
        }
    }
}

function newGame() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            board[i][j].value = ""
            board[i][j].sync()
            board[i][j].checkingValue = ""
            board[i][j].ball = false
            board[i][j].pair = null
            board[i][j].guess = false
            if (board[i][j].errorElement != null) {
                toggleChild(board[i][j], "error")
            }
        }
    }
    exits = 1
    checkingExits = 1
    populate()
}

function revealAllEdges() {
    for (let i = 0; i < 7; i += 6) {
        for (let j = 1; j < 6; j++) {
            laser(i, j, false)
            laser(j, i, false)
            board[i][j].sync()
            board[j][i].sync()
            if (board[i][j].pair != null) board[i][j].pair.sync()
            if (board[j][i].pair != null) board[j][i].pair.sync()
        }
    }
}

function toggleChild(tile, type) {
    switch (type) {
        case "error":
            if (tile.errorElement == null) {
                let temp = document.createElement("div")
                temp.classList.add("error")
                temp.style.width = (tileEdge * 0.8) + "px"
                temp.style.height = (tileEdge * 0.8) + "px"
                temp.style.borderRadius = (tileEdge / 2) + "px"
                temp.style.borderWidth = (tileEdge * 0.1) + "px"
                tile.errorElement = temp
                tile.element.appendChild(temp)
            } else {
                tile.errorElement.remove()
                tile.errorElement = null
            }
            break
        case "ball":
            if (tile.element.firstChild == null) {
                let temp = document.createElement("div")
                temp.classList.add("ball")
                temp.style.height = tileEdge + "px"
                temp.style.width = tileEdge + "px"
                temp.style.borderRadius = (tileEdge / 2) + "px"
                tile.element.appendChild(temp)
                tile.guess = true
            } else {
                tile.element.firstChild.remove()
                tile.guess = false
            }
        }    
}

function changePage(newPage) {
    if (newPage == currentPage) return
    document.getElementById(currentPage).setAttribute("style", "display: none")
    document.getElementById(newPage).setAttribute("style", "display: block")
    document.getElementById("btn-" + currentPage).setAttribute("style", "color: black")
    document.getElementById("btn-" + newPage).setAttribute("style", "color: blue")
    currentPage = newPage
}
