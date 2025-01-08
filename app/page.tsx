"use client";

import React, { useState, useEffect, useCallback } from "react";

const ROWS = 20;
const COLS = 20;
const GRID_SIZE = 25;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Cell = { x: number; y: number };

const generateFoodPosition = (snake: Cell[]): Cell => {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
      return food;
    }
  }
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Cell[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Cell>(generateFoodPosition(snake));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prev) => {
      const head = prev[0];
      const newHead = {
        x:
          direction === "LEFT"
            ? head.x - 1
            : direction === "RIGHT"
            ? head.x + 1
            : head.x,
        y:
          direction === "UP"
            ? head.y - 1
            : direction === "DOWN"
            ? head.y + 1
            : head.y,
      };

      // Check collision with walls
      if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
        setGameOver(true);
        return prev;
      }

      // Check collision with itself
      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];
      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFoodPosition(newSnake));
      } else {
        newSnake.pop(); // Remove the tail if no food eaten
      }
      return newSnake;
    });
  }, [direction, food, gameOver]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    },
    [direction, gameOver]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFoodPosition([{ x: 10, y: 10 }]));
    setDirection("RIGHT");
    setGameOver(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Snake Game</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Controls:</strong>
        </p>
        <p>Arrow Keys: Move the snake</p>
      </div>
      {gameOver && <h2>Game Over ! Press &quot;Restart&quot; to play again.</h2>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${GRID_SIZE}px)`,
          gap: "1px",
          backgroundColor: "black",
        }}
      >
        {Array.from({ length: ROWS }).map((_, rowIndex) =>
          Array.from({ length: COLS }).map((_, colIndex) => {
            const isSnake = snake.some((segment) => segment.x === colIndex && segment.y === rowIndex);
            const isFood = food.x === colIndex && food.y === rowIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: GRID_SIZE,
                  height: GRID_SIZE,
                  backgroundColor: isSnake
                    ? "green" // Snake
                    : isFood
                    ? "red" // Food
                    : "#333", // Empty cell
                }}
              />
            );
          })
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={restartGame} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
