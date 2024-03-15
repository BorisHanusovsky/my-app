import React, { useRef, useEffect } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

export default function DisplayPanel({ activations, dataset, load }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && activations.length > 0) {
      const ctx = canvas.getContext('2d');
      const scaleFactor = 4; // Scaling factor (1 pixel to a 4x4 block)
      const size = 26; // Original size of each activation map
      const numRows = 4; // For displaying 4 rows
      const numCols = 4; // For displaying 4 columns
      const paddedSize = size * scaleFactor; // Size of each activation map after scaling
      const gap = 2; // Gap between each scaled activation map
  
      // Adjust the canvas size based on the scaled activation maps and gaps
      canvas.width = numCols * (paddedSize + gap) - gap;
      canvas.height = numRows * (paddedSize + gap) - gap;
  
      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Assume 'activations' is a 4D array-like structure with shape [1, height, width, num_maps]
      // and we're visualizing the last dimension (16 maps of 26x26 each)
      for (let mapIndex = 0; mapIndex < 16; mapIndex++) {
        const row = Math.floor(mapIndex / numCols);
        const col = mapIndex % numCols;
        const xOffset = col * (paddedSize + gap);
        const yOffset = row * (paddedSize + gap);
  
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            // Get the pixel intensity value; assuming it's normalized between 0 and 1
            const intensity = activations[0][i][j][mapIndex];
            // Set the fill style based on the intensity
            ctx.fillStyle = `rgb(${intensity * 255}, ${intensity * 255}, ${intensity * 255})`;
            // Draw the pixel as a scaled block
            ctx.fillRect(
              xOffset + j * scaleFactor,
              yOffset + i * scaleFactor,
              scaleFactor,
              scaleFactor
            );
          }
        }
      }
    }
  }, [activations, load]);

  return (
    <div className="kernel_panel" id="imageContainer">
      <h2>Display panel</h2>
      <canvas ref={canvasRef} style={{ display: load ? 'none' : 'block' }}></canvas>
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD" style={{ position: 'relative', display: 'flex', justifyContent: 'center', top: '40%' }}/>
    </div>
  );
}