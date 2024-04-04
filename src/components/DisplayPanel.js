import React, { useRef, useEffect, useState } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

export default function DisplayPanel({activations, imgs, load,epochNum, onEpochNumChange}) {
  const canvasRef = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  //const [images, setImages] = useState(imgs)
  const [displayImages, setDisplayImages] = useState(false);
  const [epoch, setEpoch] = useState(epochNum)
  //let images = activations?.[selectedImageIndex]
  let images = displayImages ? [imgs?.[selectedImageIndex]] : activations?.[selectedImageIndex];
  
  
  // function handleOnChangeImageClick(){
  //   if(selectedImageIndex == 9)
  //     setSelectedImageIndex(0)
  //   else
  //   setSelectedImageIndex(selectedImageIndex +1)
  // }

  // function handleOnShowInputClick(){
  //   images = imgs
  // }

    function handleOnChangeImageClick() {
    setDisplayImages(false); // Ensure we're displaying activations upon changing image
    setSelectedImageIndex((prevIndex) => (prevIndex === 9 ? 0 : prevIndex + 1));
  }

  function handleEpochChange(event){
    setEpoch(event.target.value)
    onEpochNumChange(event.target.value -1)
  }

  function handleOnShowInputClick() {
    setDisplayImages(true); // Switch to displaying imgs
    console.log(imgs)
  }

  useEffect(() => {setDisplayImages(false);},[activations])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && activations && images) {
      const ctx = canvas.getContext('2d');
      const scaleFactor = 4; // Adjust as needed for visibility
      let numRows, numCols, size, paddedSize, gap;
  
      const firstElement = images[0];
      
      // Determine the structure of the data (1D or 2D) and set variables accordingly
      if (Array.isArray(firstElement)) {
          numRows = Math.floor(Math.sqrt(images.length));
          numCols = Math.ceil(images.length / numRows);
          size = firstElement.length;
          gap = 5;
          paddedSize = size * scaleFactor;

      } 
      else{
        numRows = 30
          numCols = images.length
          size = 10;
          gap = 0
          paddedSize = 20
      }
      
      canvas.width = numCols * (paddedSize + gap) - gap;
      canvas.height = numRows * (paddedSize + gap) - gap;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let row,col,xOffset, yOffset
      
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
      else {
          draw1D(images, 20, ctx);
      }}}, 
        [images, selectedImageIndex, displayImages]);
        function draw1D(arr, width, ctx) {
        console.log(arr)
        //const width = canvasSize / arr.length > 50 ? 50 : canvasSize / arr.length
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
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD"/>
      </div>
    </div>


  );

  
}