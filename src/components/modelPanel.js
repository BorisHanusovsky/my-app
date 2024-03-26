import React, { useState, useEffect, useRef } from "react";
import LayerOptions from "./layerOptions/layerOptionsDense";
import LayerOptionsConv2D from "./layerOptions/layerOptionsConv2D";
import LayerFactory from "./layers/layerFactory";
import LayerOptionsMaxPool2D from "./layerOptions/layerOptionsMaxPool2D";
import LayerOptionsAvgPool2D from "./layerOptions/layerOptionsAvgPool2D";
import LayerOptionsDropout from "./layerOptions/layerOptionsDropout";
import { add_model_layer, create_model } from "./../model.js";
import { LayerType } from "./layers/layerEnum.js";
import LayerOptionsflatten from "./layerOptions/layerOptionsFlatten.js";

const ModelPanel = ({layers, setLayerList, onIndexChange, onButtonPlusClick, onButtonMinusClick}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
  const [keyIndex, setKeyIndex] = useState(0);
  const [layerOptVis, setLayerOptionsVisibility] = useState(false);
  let newLayerRef = useRef(null);

  useEffect(() => {
    console.log(layers)}, [layers, setLayerList]);



  const openLayerOptions = () =>{
    setLayerOptionsVisibility(true)
  }

  console.log("ModelPanel component rendered");
  console.log(selectedLayerIndex, keyIndex);



  useEffect(() => {
    if (newLayerRef.current !== null && selectedLayerIndex !== null) {
      setLayerList((prevLayers) => {
        const updatedLayers = [...prevLayers, newLayerRef.current];
        newLayerRef.current = null; // Reset the ref after updating the state
        return updatedLayers;
      });
    }
  }, [setLayerList,newLayerRef,selectedLayerIndex]); // selectedLayerIndex

  // const handleLayerClick = (index) => {
  //   setSelectedLayerIndex(index);
  //   onIndexChange(index)
  // };

  const handleLayerClick = (index) => {
    setSelectedLayerIndex(index);
    onIndexChange(index); // Assuming onIndexChange is a prop function for notifying parent components
  };

  const handleLayerDoubleClick = (index) => {
    if (!layerOptVis && selectedLayerIndex!=undefined){
      setLayerOptionsVisibility(true)
    }
  };

  const HandleLayerOptionClose = (layer) => {
    if (layerOptVis) setLayerOptionsVisibility(false);
    if (layer !== undefined) {
      let temp = [...layers];
      temp[selectedLayerIndex] = layer;
      setLayerList(temp);
    }
  };

  // const removeSelectedLayer = () => {
  //   setSelectedLayerIndex(null);
  //   onIndexChange(null)
  //   if (layers.length > 0) {
  //     setKeyIndex((prevKeyIndex) => prevKeyIndex - 1);
  //     setLayerList((prevLayers) => prevLayers.slice(0, -1));
  //   }
  //   else{
  //     setKeyIndex(0);
  //   }
  // };

  useEffect(() => {
   setKeyIndex(layers.length);
  }, [layers]);

  let layerOptions;

  if (layers[selectedLayerIndex] && layers[selectedLayerIndex].type !== undefined) {
    if (layers[selectedLayerIndex].type === "Conv2D")
      layerOptions = <LayerOptionsConv2D key={layers?.[selectedLayerIndex]?.index}
                                         index = {layers?.[selectedLayerIndex]?.index}
                                         type={layers?.[selectedLayerIndex]?.type || ""}
                                         numOfKernels={layers?.[selectedLayerIndex]?.numOfKernels}
                                         kernelSize={layers?.[selectedLayerIndex]?.kernelSize}
                                         strides={layers?.[selectedLayerIndex]?.strides}
                                         padding={layers?.[selectedLayerIndex]?.padding}
                                         activationType = {layers?.[selectedLayerIndex]?.activationType}
                                         vis={layerOptVis} 
                                         inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                         onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "Dense")
      layerOptions = <LayerOptions key={layers?.[selectedLayerIndex]?.index}
                                   index = {layers?.[selectedLayerIndex]?.index}
                                   type={layers?.[selectedLayerIndex]?.type || ""} 
                                   numOfNeurons={layers?.[selectedLayerIndex]?.numOfNeurons} 
                                   activationType = {layers?.[selectedLayerIndex]?.activationType}
                                   vis={layerOptVis} 
                                   inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                   onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "MaxPool2D")
    layerOptions = <LayerOptionsMaxPool2D key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layers?.[selectedLayerIndex]?.poolSize}
                                      strides={layers?.[selectedLayerIndex]?.strides}
                                      padding={layers?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                      onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "AvgPool2D")
    layerOptions = <LayerOptionsAvgPool2D key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layers?.[selectedLayerIndex]?.poolSize}
                                      strides={layers?.[selectedLayerIndex]?.strides}
                                      padding={layers?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                      onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "Dropout")
    layerOptions = <LayerOptionsDropout key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      rate={layers?.[selectedLayerIndex]?.rate}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "Flatten")
    layerOptions = <LayerOptionsflatten key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      vis={layerOptVis} 
                                      inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                      onClose={HandleLayerOptionClose} />;
    else{
      layerOptions = null
    }
}
  return (
   
    <div className="model_panel">
      <h2>Model panel</h2>
      <div className="model_panel_controls">
        <button className = "sticky" onClick={onButtonPlusClick}>+</button>
        <button className = "sticky" onClick={onButtonMinusClick}>-</button>
        <button className = "sticky" onClick={handleLayerDoubleClick}>Change </button>
      </div>
      
      {/* {layers.filter(layer => layer != null).map((layer) => (
  <LayerFactory
    key={layer.index}
    layer={layer}
    handleLayerClick={handleLayerClick}
    handleLayerDoubleClick={handleLayerDoubleClick}
    isActive={layer?.index === selectedLayerIndex}
  />
))} */}

{ 
layers.filter(layer => layer != null).map((layer, index) => (
  <LayerFactory
    key={index}
    layer={layer}
    handleLayerClick={handleLayerClick}
    handleLayerDoubleClick={handleLayerDoubleClick}
    isActive={index === selectedLayerIndex}
  />
))}
      {layerOptions}
    </div>
  );
}

export default ModelPanel;
