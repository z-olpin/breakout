// Set up canvas
const canvas = document.createElement('canvas')
const restart = document.getElementById('restart')
canvas.id = "canvas"
document.body.insertBefore(canvas, restart)
const ctx = canvas.getContext('2d')
const width = canvas.width = 900
const height = canvas.height = 700
canvas.style.border = '30px solid #a7cdff'
canvas.style.borderRadius = '20px'

const ball = {
  direction: {
    x: -1,
    y: -1
  },
  velocity: {
    x: -11 +
      Math.pow(
        -1,
        Math.round(Math.random())
      ),
    y: -9 +
      Math.pow(
        -1,
        Math.round(Math.random())
      )
  },
  position: {
    x: 500,
    y: 688
  }
}

const game = {
  started: false,
  lostGame: false,
  wonGame: false
}

const paddle = {
  moveRight: () => {
    if (paddle.farRight < width) {
    paddle.farLeft += 10
    paddle.left += 10
    paddle.center += 10
    paddle.right += 10
    paddle.farRight += 10
    }
  },
  moveLeft: () => {
    if (paddle.farLeft > 0) {
    paddle.farLeft -= 10
    paddle.left -= 10
    paddle.center -= 10
    paddle.right -= 10
    paddle.farRight -= 10
    }
  },
  collisionPoint: undefined,
  direction: undefined,
  farLeft: 20,
  left: 56,
  center: 92,
  right: 128,
  farRight: 164
}

// Event handlers to move paddle
const keydown = (e) => {
  let code = e.keyCode
  game.started = true
  switch (code) {
    case 37:
      paddle.direction = 'left'
      break
    case 39:
      paddle.direction = 'right'
      break
    case 13:
      if (game.lostGame || game.wonGame) location.reload()
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
  if (!!x) {
    ctx.fillStyle = '#a7cdff'
    ctx.fillRect(x, y, w, h)
  }
}

// Store blocks in 2D array -> [x-coord, y-coord, width, height]
const blocks = [...Array(4)]
  .map(_col => [...Array(10)])
  .map((row, idx) => {
    return row.map((_block, jdx) => {
      return [
        (width / 10) * jdx,
        40 * idx,
        width / 10,
        40,
      ]
    })
  })

const draw = () => {
  if (game.started) {
    if (game.lostGame) {
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'white'
      ctx.font = '55px helvetica'
      ctx.fillText(':( Press enter to play again!', 105, height/2)
    }

    if (game.wonGame) {
      ctx.fillStyle = '#1a5733'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'white'
      ctx.font = '120px helvetica'
      ctx.fillText('YOU WON :)', 105, height/2)
    } else {
      if (!!game.lostGame) {
        // Draw background
        ctx.fillStyle = '#a7cdff'
        ctx.fillRect(0, 0, width, height)

        // Draw paddle
        if (paddle.direction === 'left') paddle.moveLeft()
        else if (paddle.direction === 'right') paddle.moveRight()
        ctx.fillStyle = '#1a5733'
        ctx.fillRect(
          paddle.farLeft,
          height - 30,
          144,
          20
        )
      
        // Draw blocks
        blocks.forEach(row => {
          row.forEach(block => {
            drawBlock(...block)
          })
        })

        // :( :( :( :( :( :( :(
        for (let row = 0; row < blocks.length; row++) {
          for (let block = 0; block < blocks[row].length; block++) {
            if (
              blocks[row][block][0] < ball.position.x &&
              blocks[row][block][1] < ball.position.y &&
              ball.position.x < blocks[row][block][0] + blocks[row][block][2] &&
              ball.position.y < blocks[row][block][1] + blocks[row][block][3]
            ) {
              if (blocks[row][block][0] !== null) {
                blocks[row][block] = [null, null, null, null]
                ball.velocity.y *= -1
              }
            }
          }
        }

        // Check if ball has hit something
        if (ball.position.x >= width - 13) ball.velocity.x *= -1
        if (ball.position.x <= 20) ball.velocity.x *= -1
        if (ball.position.y <= 20) ball.velocity.y *= -1
        if (ball.position.x > paddle.farLeft &&
            ball.position.x < paddle.farRight &&
            ball.position.y >= height - 52
        ) {
          ball.velocity.y *= -1
          paddle.collisionPoint = ball.position.x - paddle.center
          if (paddle.collisionPoint < 0) {
            ball.velocity.x -=
              Math.abs(
                Math.round(
                  paddle.collisionPoint / 30
                )
              )
           } else if (paddle.collisionPoint > 0) {
             ball.velocity.x +=
               Math.abs(
                 Math.round(
                   paddle.collisionPoint / 30
                 )
               )
             }
           }
           if (ball.position.y >= height) {
             game.lostGame = true
           }
            
          if (ball.velocity.x === 0) {
            ball.velocity.x += 
              Math pow(
                -1,
                Math.round(Math.random())
              )
          }

          // Draw ball
          ctx.beginPath()
          ctx.fillStyle = '#ffffff'
          ctx.ellipse(
            ball.position.x,
            ball.position.y, 
            15,
            15,
            0,
            0,
            2 * Math.PI
          )
          ctx.closePath()
          ctx.fill()

          // Set ball position for next render
          ball.position.x += ball.velocity.x
          ball.position.y += ball.velocity.y
      }
    }
  } else {
    // Game not started
    ctx.fillStyle = '#a7cdff'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'black'
    ctx.font = '70px helvetica'
    ctx.fillText('Use the arrow keys', 105, 170)
    ctx.fillText('to control the paddle.', 105, 270)
    ctx.fillText('_________________', 105, 360)
    ctx.fillText('Press any key to play!', 105, 500)
  }

  if (blocks
       .flat()
       .flat()
       .every(block => !!block)
  ) {
    game.wonGame = true
  }

  // ////////////////////////
  requestAnimationFrame(draw)
}


requestAnimationFrame(draw)
document.addEventListener("keydown", keydown)
document.addEventListener("keyup", keyup)
