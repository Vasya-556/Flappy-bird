import React, { useEffect, useRef, useState, useCallback } from 'react';
import birdImageSrc from '../assets/bird3.png';
import pipe1ImageSrc from '../assets/pipe1.png';
import pipe2ImageSrc from '../assets/pipe2.png';
import backgroundImageSrc from '../assets/background.png';

function Game() {
  const canvasRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [Score, setScore] = useState(0);

  const birdImage = new Image();
  birdImage.src = birdImageSrc;
  
  const pipe1Image = new Image();
  pipe1Image.src = pipe1ImageSrc;
  
  const pipe2Image = new Image();
  pipe2Image.src = pipe2ImageSrc;

  const backgroundImage = new Image();
  backgroundImage.src = backgroundImageSrc;

  const resetGame = useCallback(() => {
    setGameKey(prevKey => prevKey + 1);
    setIsGameStarted(true);
    setScore(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ctx.drawImage(backgroundImage,0,0);
    backgroundImage.onload = function(){
      ctx.drawImage(backgroundImage,0,0,500,500);
      ctx.drawImage(birdImage,100,200,15*2,15*2);
    }

    if (!isGameStarted) return;


    let fps = 10;
    let pipes = [];
    let gap = 70;
    let birdY = 200;
    let birdX = 100;
    let birdR = 15;
    let isGameOver = false;

    function drawPipe(pipeX, center, gap) {
      ctx.beginPath();
      ctx.rect(pipeX, center - gap, 10, -400);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();

      // console.log(`pipeX = ${pipeX} center - gap = ${center-gap} center + gap = ${center+gap}`);
      // ctx.drawImage(pipe2Image,pipeX,center - gap,20,-400);

      ctx.beginPath();
      ctx.rect(pipeX, center + gap, 10, 400);
      ctx.fill();
      ctx.stroke();
      // ctx.drawImage(pipe1Image,pipeX,center - gap,20,400);
    }

    function createPipe() {
      let center = Math.floor(Math.random() * (290 - 100 + 1)) + 100;
      pipes.push({ x: 500, center: center });
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
        let birdLeft = birdX - birdR / 2;
        let birdRight = birdX + birdR * 2; 
        let birdTop = birdY - birdR / 2;
        let birdBottom = birdY + birdR * 2;

        // Calculate pipe bounds
        let pipeLeft = pipe.x-birdR/2;
        let pipeRight = pipe.x + 10; // pipe width is 10
        let pipeTopGap = pipe.center - gap;
        let pipeBottomGap = pipe.center + gap;

        if (
          birdRight > pipeLeft &&
          birdLeft < pipeRight &&
          (birdTop < pipeTopGap || birdBottom > pipeBottomGap)
        ) {
          return true;
        }
      }
      return false;
    }

    function handleBirdJump() {
      birdY -= 45;
    }

    function animate() {
      birdY += 10;

      drawBird(birdX, birdY, birdR);

      if (birdY < 390 && birdY > 0 && !checkCollision()) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, 1000 / fps);
      } else {
        gameOver();
      }
    }

    function drawBird(birdX, birdY, birdR) {
      // ctx.beginPath();
      // ctx.arc(birdX, birdY, birdR, 0, Math.PI * 2);
      // ctx.fillStyle = 'yellow';
      // ctx.fill();
      // console.log(`birdX = ${birdX} birdY = ${birdY} birdR*2 = ${birdR*2}`)
      ctx.drawImage(birdImage,birdX,birdY,birdR*2,birdR*2);
    }

    function clearCanvas() {
      // ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(backgroundImage,0,0);
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
    // eslint-disable-next-line 
  }, [isGameStarted, gameKey]);

  return (
    <div className='Game'>
      <button onClick={resetGame}>Start</button>
      <canvas
        key={gameKey}
        ref={canvasRef}
        width="500"
        height="500"
      ></canvas>
      <div className='ScoreBoard'>
        <p className='p1'>Score:</p>
        <p className='p2'>{Score}</p>
      </div>
    </div>
  )
}

export default Game