import React, { useRef, useEffect } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

export default function DisplayPanel({activations, imgs, load, position = 0 }) {
  const canvasRef = useRef();
  const images = activations

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && images?.length > 0) {
      const ctx = canvas.getContext('2d');
      const scaleFactor = 4; // Adjust as needed for visibility
      let numRows, numCols, size, paddedSize, gap;

      const firstElement = images[0];
      if (Array.isArray(firstElement) && Array.isArray(firstElement[0])) {
        if (typeof firstElement[0][0] === 'number') {
          numRows = Math.floor(Math.sqrt(images.length));
          numCols = Math.ceil(images.length / numRows);
          size = firstElement.length;
        } else {
          numRows = 4;
          numCols = 4;
          size = firstElement[0].length;
        }
      }
      else if(Array.isArray(firstElement)){
        if (typeof firstElement[0] === 'number') {
          //numRows = Math.floor(Math.sqrt(images.length));
          numRows = images.length;
          numCols = 1;
          size = firstElement.length;
        } 
        else{
          alert("Daco zle s obrazkami")
        }
      }
      else {
        console.error('Unexpected data shape in activations.');
        return;
      }

      paddedSize = size * scaleFactor;
      gap = 5;

      canvas.width = numCols * (paddedSize + gap) - gap;
      canvas.height = numRows * (paddedSize + gap) - gap;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      images.forEach((activation, index) => {
        const row = Math.floor(index / numCols);
        const col = index % numCols;
        const xOffset = col * (paddedSize + gap);
        const yOffset = row * (paddedSize + gap);
        if (Array.isArray(firstElement) && Array.isArray(firstElement[0])){

          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              let intensity = activation[i][j]; // Assuming direct intensity access is correct
              if (intensity < 0 || intensity > 1) {
                intensity = Math.min(Math.max(intensity, 0), 1); // Clamp to [0, 1] if out of bounds
              }
              intensity *= 255; // Scale to [0, 255]
              ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
              ctx.fillRect(
                xOffset + j * scaleFactor,
                yOffset + i * scaleFactor,
                scaleFactor,
                scaleFactor
              );
            }
          }
        }
        else if(Array.isArray(firstElement)){
          if (typeof firstElement[0] === 'number') {
            for (let i = 0; i < size; i++) {
              for (let j = 0; j < size; j++) {
                let intensity = activation[i][j]; // Assuming direct intensity access is correct
                if (intensity < 0 || intensity > 1) {
                  intensity = Math.min(Math.max(intensity, 0), 1); // Clamp to [0, 1] if out of bounds
                }
                intensity *= 255; // Scale to [0, 255]
                ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
                ctx.fillRect(
                  xOffset + j * scaleFactor,
                  yOffset + i * scaleFactor,
                  scaleFactor,
                  scaleFactor
                );
              }
            }
          } 
          else{
            alert("Daco zle s obrazkami")
          }
        }
      });
    }
  }, [imgs, load, position,activations]);

  return (
    <div className="kernel_panel" id="imageContainer">
      <h2>Display panel</h2>
      <canvas ref={canvasRef} style={{ display: load ? 'none' : 'block' }}></canvas>
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD" style={{ position: 'relative', display: 'flex', justifyContent: 'center', top: '40%' }}/>
    </div>
  );
}
// import React, { useRef, useEffect } from 'react';
// import { ClimbingBoxLoader } from 'react-spinners';

// export default function DisplayPanel({ activations, imgs, load, position = 0 }) {
//   const canvasRef = useRef();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas && activations?.length > 0) {
//       const ctx = canvas.getContext('2d');
//       const scaleFactor = 1; // Increase scale factor for better visibility
//       let numRows, numCols, paddedSize, gap = 0; // Adjust gap for clarity

//       const firstElement = activations[0];
//       const is2D = Array.isArray(firstElement) && Array.isArray(firstElement[0]);

//       if (is2D) {
//         // Handling 2D activations: assume square shape for simplicity in calculation
//         numRows = activations.length; // Number of activation maps
//         numCols = firstElement.length; // Assuming square activation maps for simplicity
//         canvas.width = numCols * scaleFactor + (numCols - 1) * gap;
//         canvas.height = numRows * scaleFactor + (numRows - 1) * gap;
//       } else {
//         // Handling 1D activations
//         numRows = 1; // Single row for 1D activations
//         numCols = activations.length; // Number of activations
//         canvas.width = numCols * scaleFactor + (numCols - 1) * gap;
//         canvas.height = scaleFactor; // Use a single scale factor as height for 1D
//       }

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       activations.forEach((activation, index) => {
//         if (is2D) {
//           // Render each 2D activation as an enlarged image
//           activation.forEach((row, i) => {
//             row.forEach((value, j) => {
//               const intensity = Math.min(Math.max(value, 0), 1) * 255;
//               ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
//               ctx.fillRect(
//                 j * scaleFactor + j * gap,
//                 i * scaleFactor + i * gap,
//                 scaleFactor,
//                 scaleFactor
//               );
//             });
//           });
//         } else {
//           // Render 1D activations as vertical bars across the canvas height
//           const intensity = Math.min(Math.max(activation, 0), 1) * 255;
//           ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
//           ctx.fillRect(
//             index * scaleFactor + index * gap, // X position
//             0, // Start at top of canvas
//             scaleFactor, // Width of bar
//             canvas.height // Height of canvas to draw a line across
//           );
//         }
//       });
//     }
//   }, [activations, load]);

//   return (
//     <div className="kernel_panel" id="imageContainer">
//       <h2>Display Panel</h2>
//       <canvas ref={canvasRef} style={{ display: load ? 'none' : 'block' }}></canvas>
//       <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD" style={{ position: 'relative', display: 'flex', justifyContent: 'center', top: '40%' }}/>
//     </div>
//   );
// }