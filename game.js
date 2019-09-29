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

let ball = {
  direction: {
    x: -1,
    y: -1
  },
  velocity: {
    x: 6,
    y: 9
  },
  position: {
    x: 500,
    y: 688
  }
}

let lostGame

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
  direction: undefined,
  farLeft: 20,
  left: 50,
  center: 80,
  right: 110,
  farRight: 140
}

// Event handlers to move paddle
const keydown = e => {
  let code = e.keyCode
  switch (code) {
    case 37:
      paddle.direction = 'left'
      break
    case 39:
      paddle.direction = 'right'
      break
    default:
      break
  }
}

const keyup = () => {
 paddle.direction = undefined
}

const drawBlock = (x, y, w, h) => {
  ctx.fillStyle = '#a7cdff'
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = '#dd7777'
  ctx.fillRect(x+5, y+5, w-10, h-10)
  if (x == null) {
    ctx.fillStyle = '#a7cdff'
    ctx.fillRect(x, y, w, h)
  }
}

// Store blocks in 2D array -> [x-coord, y-coord, width, height]
let blocks = [...Array(4)].map(e => [...Array(10)])
blocks = blocks.map((row, j)=>row.map((v, i) => [(width / 10) * i, 40 * j, width/10, 40]))

const draw = () => {

  if (lostGame) {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 0, width, height)
  } else {

    // Set background
    ctx.fillStyle = '#a7cdff'
    ctx.fillRect(0, 0, width, height)

    // Draw paddle
    if (paddle.direction == 'left') paddle.moveLeft()
    else if (paddle.direction == 'right') paddle.moveRight()
    ctx.fillStyle = '#1a5733'
    ctx.fillRect(paddle.farLeft, height - 30, 120, 20)
    
    // Draw blocks
    blocks.map(row => row.map(block => drawBlock(...block)))

    // :(
    for (let row = 0; row < blocks.length; row++) {
      for (let block = 0; block < blocks[row].length; block++) {
        if (blocks[row][block][0] < ball.position.x && blocks[row][block][1] < ball.position.y && ball.position.x < blocks[row][block][0] + blocks[row][block][2] && ball.position.y < blocks[row][block][1] + blocks[row][block][3]) {
          if (blocks[row][block][0] != null) {
            blocks[row][block] = [null, null, null, null]
            ball.direction.y =  ball.direction.y * -1
          }
        }
      }
    }

    // Check if ball has hit something
    if (ball.position.y >= height) lostGame = true
    if (ball.position.x >= width - 13) ball.direction.x = -1
    if (ball.position.x <= 20) ball.direction.x = 1
    if (ball.position.y <= 20) ball.direction.y = 1
    if (ball.position.x > paddle.farLeft &&
        ball.position.x < paddle.farRight &&
        ball.position.y >= height - 52) ball.direction.y = -1
    if (ball.position.y >= height) lostGame = true

    // Draw ball
    ctx.beginPath()
    ctx.fillStyle = '#ffffff'
    ctx.ellipse(ball.position.x, ball.position.y, 15, 15, 0, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // Set ball position for next render
    ball.position.x += ball.direction.x * ball.velocity.x
    ball.position.y += ball.direction.y * ball.velocity.y

    requestAnimationFrame(draw)
  }
}
requestAnimationFrame(draw)

restart.addEventListener("click", () => location.reload())
document.addEventListener("keydown", keydown)
document.addEventListener("keyup", keyup)

