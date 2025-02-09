import React, { useRef, useEffect } from 'react';
import { Position, GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  cellSize: number;
  boardSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, cellSize, boardSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSnake = (ctx: CanvasRenderingContext2D, snake: Position[]) => {
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80';
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      
      // Draw snake eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000';
        const eyeSize = cellSize / 8;
        ctx.fillRect(x + cellSize / 4, y + cellSize / 4, eyeSize, eyeSize);
        ctx.fillRect(x + cellSize * 3/4 - eyeSize, y + cellSize / 4, eyeSize, eyeSize);
      }
    });
  };

  const drawFood = (ctx: CanvasRenderingContext2D, food: Position) => {
    const x = food.x * cellSize;
    const y = food.y * cellSize;
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      x + cellSize / 2,
      y + cellSize / 2,
      cellSize / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, boardSize * cellSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(boardSize * cellSize, i * cellSize);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawGrid(ctx);
    drawFood(ctx, gameState.food);
    drawSnake(ctx, gameState.snake);
  }, [gameState, cellSize, boardSize]);

  return (
    <canvas
      ref={canvasRef}
      width={boardSize * cellSize}
      height={boardSize * cellSize}
      className="border-2 border-gray-200 rounded-lg shadow-lg"
    />
  );
};

export default GameBoard;