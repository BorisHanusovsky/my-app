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
  let canvasSize = 1000
  
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
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');

            // Assuming you want to draw something based on `images`
            // For now, just demonstrating clearing the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            alert(canvas.width)
            draw1D([1,2,3,4,5,6,7,8,9], ctx); // Example drawing function
            //ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
            //ctx.fillRect(0, 0, 100, 100);
    }
}, [images, selectedImageIndex, displayImages]);
    
function draw1D(arr, ctx) {

  const width = canvasSize / arr.length > 50 ? 50 : canvasSize / arr.length
  let currPos = 0;
  for (let i = 0; i < arr.length; i++) {
      let intensity = arr[i] *25; // Example to map to 0-255 scale
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

    //   function drawLineWithWidth(array, squareWidth) {
    //     const canvas = canvasRef.current;
    //     if (canvas.getContext) {
    //         const ctx = canvas.getContext('2d');
    
    //         array.forEach((value, index) => {
    //             // Calculate the grayscale based on the value
    //             const brightness = Math.floor((value / 5) * 255);
    //             ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    
    //             // Draw a square for each value
    //             ctx.fillRect(index * squareWidth * 10, 0, squareWidth, squareWidth);
    
    //             // Fill the square with smaller squares to represent the "pixel" brightness
    //             for (let i = 0; i < squareWidth; i++) {
    //                 for (let j = 0; j < squareWidth; j++) {
    //                     ctx.fillRect(index * squareWidth * 10 + i * (squareWidth / 10), j * (squareWidth / 10), squareWidth / 10, squareWidth / 10);
    //                 }
    //             }
    //         });
    //     } else {
    //         console.log('Canvas not supported in this browser.');
    //     }
    // }


  return (
    <div className="kernel_panel" id="imageContainer">
      <h2>Display panel</h2>
      <button style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnChangeImageClick}> Change image</button>
      <button style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnShowInputClick}> Show input</button>
      <span style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} }>Epoch: {epoch}</span>
      <input  type="range" min={1} max={7}  step={1}  onChange={(event) => handleEpochChange(event)} style={ {accentColor : "#DDF2FD" ,width : '30%', marginLeft :'10px', visibility: activations?.length > 0 ? "visible" : "collapse"} } ></input>
      <canvas ref={canvasRef} width={canvasSize} style={{ display: load ? 'none' : 'block', overflow: 'scroll'}}></canvas>
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD" style={{ position: 'relative', display: 'flex', justifyContent: 'center', top: '40%' }}/>
    </div>
  );
}