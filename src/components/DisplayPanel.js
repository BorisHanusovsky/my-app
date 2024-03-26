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
    if (canvas && activations && images?.length > 0) {
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
  }, [images, selectedImageIndex, displayImages]);

  return (
    <div className="kernel_panel" id="imageContainer">
      <h2>Display panel</h2>
      <button style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnChangeImageClick}> Change image</button>
      <button style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} } onClick={handleOnShowInputClick}> Show input</button>
      <span style={ activations?.length>0 ? { visibility:'visible'} : {visibility : 'collapse'} }>Epoch: {epoch}</span>
      <input  type="range" min={1} max={7}  step={1}  onChange={(event) => handleEpochChange(event)} style={ {accentColor : "#DDF2FD" ,width : '30%', marginLeft :'10px', visibility: activations?.length > 0 ? "visible" : "collapse"} } ></input>
      <canvas ref={canvasRef} style={{ display: load ? 'none' : 'block' }}></canvas>
      <ClimbingBoxLoader loading={load} size={30} color="#DDF2FD" style={{ position: 'relative', display: 'flex', justifyContent: 'center', top: '40%' }}/>
    </div>
  );
}