# black-box-re
Browser recreation of the puzzle game Black Box.

Although the game currently needs you to use the console (it also doesn't scale to the window yet), you can try the latest version here: https://farkasma.github.io/black-box-re/

## Rules

Within the field marked by the red squares, there are 3 balls. These balls interact with laser beams. If the laser hits the ball head on, it gets absorbed, and stops. But if the laser arrives into one of the tiles diagonal to the ball, it will turn 90° away from the ball, and continue (if it has no ball in front of it either). Now imagine firing a laser from one of the blue edge tiles into the field. The characters in these edge tiles represent one of 3 outcomes:

- H: The laser hit a ball head on, and got absorbed.
- R: The laser either got turned before it could even enter the field, or exited at the same edge tile it entered from.
- 1-n: The laser exited at the tile with the same number it entered.

Your goal is to find these balls.

## How to play

Left click on an edge tile to reveal the character in it. Alternatively you can use the `revealAllEdges()` command in the console to reveal all edges at the same time.

Right click on a red tile where you think a ball is to mark it.

To check your answer use the `checkBoard()` command in the console. All edge tiles, where the character does not match with the result of your answer will get circled in red.