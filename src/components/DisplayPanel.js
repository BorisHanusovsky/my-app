import React, { useRef, useEffect } from 'react';

export default function DisplayPanel({ dataset }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (dataset) {
      const onesArray = Array.from({ length: 28 }, () => Array(28).fill(1));

      const numRows = Math.min(dataset.length, 20); // Display 10 rows
      const numCols = 20; // Display 10 columns
      const gap = 2; // Set the gap between images

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const imgd = dataset[row * numCols + col]; // Get the current image

          for (let i = 0; i < 28; i++) {
            for (let j = 0; j < 28; j++) {
              const intensity = imgd[i][j] * 255;
              ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
              ctx.fillRect(col * (28 + gap) + j, row * (28 + gap) + i, 1, 1);
            }
          }
        }
      }
    }
  }, [dataset]);

  return (
    <div className="kernel_panel" id="imageContainer">
      <h2>Display panel</h2>
      <canvas ref={canvasRef} width={600} height={600} ></canvas>
    </div>
  );
}