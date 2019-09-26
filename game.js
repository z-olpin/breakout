// Set up canvas
const canvas = document.createElement('canvas')
canvas.id = "canvas"
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
const width = canvas.width = 800
const height = canvas.height = 700
canvas.style.border = '30px solid #a7cdff'
canvas.style.borderRadius = '30px'


// Event handler to move paddle
const leftRight = e => {
  let code = e.keyCode
  switch (code) {
    case 37:
      paddleX -= 30
      break
    case 39:
        paddleX += 30
        break
    default:
      break
  }
}
document.addEventListener('keydown', leftRight)

// Store blocks in 2D array where block -> x-coordinate
let blocks = [[...Array(10)], [...Array(10)], [...Array(10)], [...Array(10)], [...Array(10)]]
blocks = blocks.map(row=>row.map((v, i) => (width / 10) * i+2))

let paddleX = 20
let xDirection = -1
let yDirection = -1
let xVelocity = 10
let yVelocity = 8
let ballPosition = {x: 500, y: 688}
let lostGame = false

const drawBlock = (x, y) => {
  ctx.fillStyle = '#dd7777'
  ctx.fillRect(x, y, width/10-8, 25)
}

const draw = () => {
  
  // Check if lostGame
  if (lostGame) {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 0, width, height)
  } else {

    // Set background
    ctx.fillStyle = '#a7cdff'
    ctx.fillRect(0, 0, width, height)
    
    // Draw blocks
    blocks[0].map(x => drawBlock(x, 4))
    blocks[1].map(x => drawBlock(x, 37))
    blocks[2].map(x => drawBlock(x, 70))
    blocks[3].map(x => drawBlock(x, 103))
    blocks[4].map(x => drawBlock(x, 137))

    // Check if ball hit wall
    if (ballPosition.y >= height) lostGame = true
    if (ballPosition.x >= width - 13) xDirection = -1
    if (ballPosition.x <= 20) xDirection = 1
    if (ballPosition.y <= 20) yDirection = 1
    if (ballPosition.x > paddleX && ballPosition.x < paddleX + 120 && ballPosition.y >= height - 49) yDirection = -1

    // Draw ball
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(ballPosition.x, ballPosition.y, 15, 15, 0, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Draw paddle
    ctx.fillStyle = '#1a5733'
    ctx.fillRect(paddleX, height - 30, 140, 20)

    // Set ball position for next render
    ballPosition.x += xDirection * xVelocity
    ballPosition.y += yDirection * yVelocity

    requestAnimationFrame(draw)
  }
}
requestAnimationFrame(draw)



