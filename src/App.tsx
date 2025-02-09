import { useGameLogic } from './hooks/useGameLogic';
import GameBoard from './components/GameBoard';
import { Gamepad2, RotateCcw } from 'lucide-react';

const BOARD_SIZE = 20;
const CELL_SIZE = 25;

function App() {
  const { gameState, resetGame } = useGameLogic(BOARD_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-8 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">Snake Game</h1>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Score: {gameState.score}
          </div>
        </div>

        <GameBoard
          gameState={gameState}
          cellSize={CELL_SIZE}
          boardSize={BOARD_SIZE}
        />

        {gameState.isGameOver && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-red-500 mb-4">Game Over!</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-medium mb-2">How to play:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use arrow keys or WASD to control the snake</li>
            <li>Eat the red food to grow and score points</li>
            <li>Avoid hitting the walls and yourself</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;