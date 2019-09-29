// Set up canvas
const canvas = document.createElement('canvas')
const restart = document.getElementById('restart')
canvas.id = "canvas"
document.body.insertBefore(canvas, restart)
const ctx = canvas.getContext('2d')
const width = canvas.width = 800
const height = canvas.height = 700
canvas.style.border = '30px solid #a7cdff'
canvas.style.borderRadius = '20px'
restart.addEventListener("click", () => location.reload())
// Event handlers to move paddle
const keydown = e => {
  let code = e.keyCode
  switch (code) {
    case 37:
      dir = 'left'
      break
    case 39:
      dir = 'right'
      break
    default:
      break
  }
}

const keyup = () => {
  dir = null
}

document.addEventListener("keydown", keydown)
document.addEventListener("keyup", keyup)

// Store blocks in 2D array where block -> x-coordinate
let blocks = [[...Array(10)], [...Array(10)], [...Array(10)], [...Array(10)], [...Array(10)]]
blocks = blocks.map(row=>row.map((v, i) => (width / 10) * i+2))

let paddleX = 20
let xDirection = -1
let yDirection = -1
let xVelocity = 6
let yVelocity = 8
let ballPosition = {x: 500, y: 688}
let lostGame = false
let dir = null
let paddle = {
  moveRight: () => {
    paddle.farLeft += 10
    paddle.left += 10
    paddle.center += 10
    paddle.right += 10
    paddle.farRight += 10
  },
  moveLeft: () => {
    paddle.farLeft -= 10
    paddle.left -= 10
    paddle.center -= 10
    paddle.right -= 10
    paddle.farRight -= 10
  },
  farLeft: 20,
  left: 45,
  center: 70,
  right: 95,
  farRight: 120
}

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

    // Draw paddle
    if (dir == 'left') paddle.moveLeft()
    else if (dir == 'right') paddle.moveRight()
    ctx.fillStyle = '#1a5733'
    ctx.fillRect(paddle.farLeft, height - 30, 100, 20)
    
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
   if (ballPosition.x > paddle.farLeft && ballPosition.x < paddle.farRight && ballPosition.y >= height - 52) {
      if (paddle.farLeft < ballPosition.x && ballPosition.x < paddle.left) {
        if (xDirection == -1) {
          xVelocity += 2
        } else {
          xVelocity -= 2
        }
      if (paddle.left < ballPosition.x && ballPosition.x < paddle.center) {
        if (xDirection == -1) {
          xVelocity += 1
        } else {
          xVelocity -= 1
        }

      if (paddle.right < ballPosition.x && ballPosition.x < paddle.farRight) {
        if (xDirection == -1) {
          xVelocity += 2
        } else {
          xVelocity -= 2
        }      
      }
      if (paddle.center < ballPosition.x && ballPosition.x < paddle.right) {
        if (xDirection == -1) {
          xVelocity += 1
        } else {
          xVelocity -= 1
        }      
      }
      if (xVelocity < 1) xVelocity = 1
    }
  }
      // if (paddle.center < ballPosition.x < paddle.farRight) {
      //   xVelocity -= 30
      //   console.log('asdfasdfa')

      // }
        console.log(ballPosition.x, xVelocity, xDirection)
      yDirection = -1
    }


    // Draw ball
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(ballPosition.x, ballPosition.y, 15, 15, 0, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Set ball position for next render
    ballPosition.x += xDirection * xVelocity
    ballPosition.y += yDirection * yVelocity

    requestAnimationFrame(draw)
  }
}
requestAnimationFrame(draw)



