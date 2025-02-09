import { useState, useEffect, useCallback } from 'react';
import { GameState, Position, Direction } from '../types/game';

const INITIAL_SNAKE_LENGTH = 3;
const MOVEMENT_SPEED = 150;

const generateFood = (snake: Position[], size: number): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useGameLogic = (boardSize: number) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialSnake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
      x: Math.floor(boardSize / 2),
      y: Math.floor(boardSize / 2) + i,
    }));

    return {
      snake: initialSnake,
      food: generateFood(initialSnake, boardSize),
      direction: 'UP',
      isGameOver: false,
      score: 0,
    };
  });

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (prev.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= boardSize ||
        head.y < 0 ||
        head.y >= boardSize
      ) {
        return { ...prev, isGameOver: true };
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === prev.food.x && head.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake, boardSize),
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [boardSize, gameState.isGameOver]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      // Prevent 180-degree turns
      const invalidMoves = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (invalidMoves[newDirection] === prev.direction) {
        return prev;
      }

      return { ...prev, direction: newDirection };
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
      x: Math.floor(boardSize / 2),
      y: Math.floor(boardSize / 2) + i,
    }));

    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake, boardSize),
      direction: 'UP',
      isGameOver: false,
      score: 0,
    });
  }, [boardSize]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default scroll behavior

      const keyMap: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        KeyW: 'UP',
        KeyS: 'DOWN',
        KeyA: 'LEFT',
        KeyD: 'RIGHT',
      };

      const newDirection = keyMap[event.code];
      if (newDirection) {
        changeDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, MOVEMENT_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return { gameState, resetGame };
};