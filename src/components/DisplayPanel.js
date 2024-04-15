import React, { useRef, useEffect, useState } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

export default function DisplayPanel({activations, imgs, load,epochNum, onEpochNumChange}) { // komponent zobrazenia aktivačných máp 
  const canvasRef = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // index obrázka, z ktorého boli mapy vytvorené
  const [displayImages, setDisplayImages] = useState(false); // premenn8 rozhodujúca či sa majú zobraziť vstupy do siete alebo aktivácie, prednastvená hodnota zobrauje aktivácie
  const [epoch, setEpoch] = useState(epochNum) // číslo epochy
  let images = displayImages ? [imgs?.[selectedImageIndex]] : activations?.[selectedImageIndex]; // premenná uchovávajúca pole aktuálne zobrazených obrázkov

  function handleOnChangeImageClick() { // udalosť po kliknutí na tlačidlo pre zmenu vstupu do siete
    setDisplayImages(false);
    setSelectedImageIndex((prevIndex) => (prevIndex === 9 ? 0 : prevIndex + 1));
  }

  function handleEpochChange(event){ // udalosť po zmene hodnoty posuvníka pre výber epochy
    setEpoch(event.target.value)
    onEpochNumChange(event.target.value -1)
  }

  function handleOnShowInputClick() { // udalosť po kliknutí na tlačidlo pre zobrazenie vstupu do siete
    setDisplayImages(true); 
    console.log(imgs)
  }

  useEffect(() => {setDisplayImages(false);},[activations]) // zmena zobrazenia po zmene aktivácií

  useEffect(() => {  // logika zobrazenia poľa obrázkov na plátne
    const canvas = canvasRef.current;
    if (canvas && activations && images) {
      const ctx = canvas.getContext('2d');
      const scaleFactor = 4; 
      let numRows, numCols, size, paddedSize, gap;
  
      const firstElement = images[0];
      
      // Rozhodnutie či sa jedná o 1D alebo 2D pole
      // 2D
      if (Array.isArray(firstElement)) { 
          numRows = Math.floor(Math.sqrt(images.length));
          numCols = Math.ceil(images.length / numRows);
          size = firstElement.length;
          gap = 5;
          paddedSize = size * scaleFactor;
      } 
      // 1D
      else{
        numRows = 30
          numCols = images.length
          size = 10;
          gap = 0
          paddedSize = 20
      }
      
      // širka a výška plátna
      canvas.width = numCols * (paddedSize + gap) - gap;
      canvas.height = numRows * (paddedSize + gap) - gap;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let row,col,xOffset, yOffset
      
      // vykreslenie farebn-eho obrazu
      if (Array.isArray(images[0]) && Array.isArray(images[0][0])  && Array.isArray(images[0][0][0])){
        console.log(images)
            // Render 2D activation as image
            for (let i = 0; i < size; i++) { // Loop over the height
              for (let j = 0; j < size; j++) { // Loop over the width
                  // Calculate the position for this image based on its index
                  row = numRows;
                  col = numCols;
                  xOffset = col * (paddedSize + gap);
                  yOffset = row * (paddedSize + gap);
    
                  // Get the RGB values from the current pixel
                  let r = images[0][i][j][0] * 255;
                  let g = images[0][i][j][1] * 255;
                  let b = images[0][i][j][2] * 255;
    
                  // Set the fill style to the current pixel's color
                  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    
                  // Draw the pixel
                  ctx.fillRect(
                      xOffset + j * scaleFactor,
                      yOffset + i * scaleFactor,
                      scaleFactor,
                      scaleFactor
                  );
              }
          }
     
      }
      // vykreslenie šedotónového obrazu
      if (Array.isArray(images[0])){
        images.forEach((image, index) => {
            // Render 2D activation as image
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    row = Math.floor(index / numCols);
                    col = index % numCols;
                    xOffset = col * (paddedSize + gap);
                    yOffset = row * (paddedSize + gap);
                    let intensity = image[i][j];
                    intensity = Math.min(Math.max(intensity, 0), 1); // Clamp to [0, 1]
                    intensity *= 255; // Scale to [0, 255]
                    ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
                    ctx.fillRect(
                        xOffset + j * scaleFactor,
                        yOffset + i * scaleFactor,
                        scaleFactor,
                        scaleFactor);
                }
            }
        }) 
      }
      // vykreslenie 1D obrazu
      else {
          draw1D(images, 20, ctx);
      }}}, 
        [images, selectedImageIndex, displayImages]);
        // implementácia vykreslenia 1D obrazu
        function draw1D(arr, width, ctx) {
            let currPos = 0;
            const min = Math.min(arr)
            const max = Math.max(arr)
            for (let i = 0; i < arr.length; i++) {
              
              let intensity = (arr[i] - min)/(max - min);
                  intensity = arr[i] *255; // Example to map to 0-255 scale
                ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
                ctx.fillRect(currPos, 0, width, width);
                drawSquare(intensity, currPos, width, ctx);
                currPos += width;
            }
        }
        // implementácia vykreslenia štvorca
        function drawSquare(intensity, currPos, width, ctx) {
          ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
          ctx.fillRect(currPos, 0, width, width);
        }
  return (
    <div className="kernel_panel" id="imageContainer">
      <div >
        <h2 >Display panel</h2>
        <button style={activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnChangeImageClick}> Change image</button>
        <button style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnShowInputClick}> Show input</button>
        <span style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} }>Epoch: {epoch}</span>
        <input  type="range" min={1} max={activations?.length}  step={1}  onChange={(event) => handleEpochChange(event)} style={ {accentColor : "#DDF2FD" ,width : '30%', marginLeft :'10px', visibility: activations?.length > 0 ? "visible" : "collapse"} } ></input>
      </div>
      <div style={{display : 'flex', alignItems : 'center', justifyContent: 'center'}}>
      <canvas ref={canvasRef}  width={1000} style={{ display: load ? 'none' : 'block' }}></canvas>
      {/* Animácia počas trénovania */}
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD"/>
      </div>
    </div>
  );
}