import React, { useEffect, useRef, useState, useCallback } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [Score, setScore] = useState(0);

  const resetGame = useCallback(() => {
    setGameKey(prevKey => prevKey + 1);
    setIsGameStarted(true);
    setScore(0);
  }, []);

  useEffect(() => {
    if (!isGameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let fps = 10;
    let pipes = [];
    let gap = 50;
    let birdY = 200;
    let birdX = 100;
    let birdR = 15;
    let isGameOver = false;
    // let score = 0;

    function drawPipe(pipeX, center, gap) {
      ctx.beginPath();
      ctx.rect(pipeX, center - gap, 10, -400);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(pipeX, center + gap, 10, 400);
      ctx.fill();
      ctx.stroke();
    }

    function createPipe() {
      let center = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
      pipes.push({ x: 400, center: center });
    }

    function movePipes() {
      if (isGameOver) return;

      clearCanvas();

      pipes.forEach(pipe => {
        pipe.x -= 10;
        drawPipe(pipe.x, pipe.center, gap);
        if (pipe.x === 100) {
          setScore(Score=>Score+1);
        }
      });
      pipes = pipes.filter(pipe => pipe.x > -10);

      setTimeout(() => {
        requestAnimationFrame(movePipes);
      }, 1000 / fps);
    }

    function checkCollision() {
      for (let pipe of pipes) {
        if (
          birdX + birdR > pipe.x &&
          birdX - birdR < pipe.x + 10 &&
          (birdY - birdR < pipe.center - gap || birdY + birdR > pipe.center + gap)
        ) {
          return true;
        }
      }
      return false;
    }

    function handleBirdJump() {
      birdY -= 25;
    }

    function animate() {
      birdY += 5;

      drawBird(birdX, birdY, birdR);

      if (birdY < 400 && birdY > 0 && !checkCollision()) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, 1000 / fps);
      } else {
        gameOver();
      }
    }

    function drawBird(birdX, birdY, birdR) {
      ctx.beginPath();
      ctx.arc(birdX, birdY, birdR, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, 500, 500);
    }

    function gameOver() {
      isGameOver = true;
    //   score = 0;
    //   setScore(0);
    }

    const handleClick = () => handleBirdJump();
    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        handleBirdJump();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keyup', handleKeyUp);

    movePipes();
    animate();

    const pipeInterval = setInterval(createPipe, 3000);

    return () => {
      clearInterval(pipeInterval);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameStarted, gameKey]);

  return (
    <div className='Game'>
      <button onClick={resetGame}>Start</button>
      <canvas
        key={gameKey}
        ref={canvasRef}
        width="500"
        height="500"
        style={{ backgroundColor: 'blue' }}
      ></canvas>
      <p>Score: {Score}</p>
    </div>
  )
}

export default Game