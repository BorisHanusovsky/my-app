import React, { useState, useEffect, useRef } from "react";
import LayerOptions from "./layerOptions/layerOptionsDense";
import LayerOptionsConv2D from "./layerOptions/layerOptionsConv2D";
import LayerFactory from "./layers/layerFactory";
import LayerOptionsMaxPool2D from "./layerOptions/layerOptionsMaxPool2D";
import LayerOptionsAvgPool2D from "./layerOptions/layerOptionsAvgPool2D";
import LayerOptionsDropout from "./layerOptions/layerOptionsDropout";
import LayerOptionsflatten from "./layerOptions/layerOptionsFlatten.js";

const ModelPanel = ({layers, setLayerList, onIndexChange, onButtonPlusClick, onButtonMinusClick}) => { // komponent zodpovedný za sprostredkovanie dát pre nastavenia vrstiev
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null); // index vybranej vrstvy
  const [keyIndex, setKeyIndex] = useState(0); // index
  const [layerOptVis, setLayerOptionsVisibility] = useState(false); // viditeľnosť nastavenia 
  let newLayerRef = useRef(null);

  useEffect(() => {
    console.log(layers)}, [layers, setLayerList]);

  console.log("ModelPanel component rendered");
  console.log(selectedLayerIndex, keyIndex);

  useEffect(() => {
    if (newLayerRef.current !== null && selectedLayerIndex !== null) {
      setLayerList((prevLayers) => {
        const updatedLayers = [...prevLayers, newLayerRef.current];
        newLayerRef.current = null;
        return updatedLayers;
      });
    }
  }, [setLayerList,newLayerRef,selectedLayerIndex]);

  const handleLayerClick = (index) => { // zmena vybranej vrstvy
    setSelectedLayerIndex(index);
    onIndexChange(index);
  };

  const handleLayerDoubleClick = (index) => { // zobrazenie nasrtaven=i vrstvy po dvojitom kliku
    if (!layerOptVis && selectedLayerIndex!=undefined){
      setLayerOptionsVisibility(true)
    }
  };

  const HandleLayerOptionClose = (layer) => { // uloženie nastavení vrstvy do siete 
    if (layerOptVis) setLayerOptionsVisibility(false);
    if (layer !== undefined) {
      let temp = [...layers];
      temp[selectedLayerIndex] = layer;
      setLayerList(temp);
    }
  };

  useEffect(() => {
   setKeyIndex(layers.length);
  }, [layers]);

  let layerOptions;

  // VÝBER NASTAVENÍ VRSTVY PODĽA TYPU VRSTVY
  //-----------------------------------------------------------------------------------

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
                                         batchSize = {layers?.[selectedLayerIndex]?.batchSize}
                                         inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                         onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "Dense")
      layerOptions = <LayerOptions key={layers?.[selectedLayerIndex]?.index}
                                   index = {layers?.[selectedLayerIndex]?.index}
                                   type={layers?.[selectedLayerIndex]?.type || ""} 
                                   numOfNeurons={layers?.[selectedLayerIndex]?.numOfNeurons} 
                                   activationType = {layers?.[selectedLayerIndex]?.activationType}
                                   vis={layerOptVis} 
                                   batchSize = {layers?.[selectedLayerIndex]?.batchSize}
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
                                      batchSize = {layers?.[selectedLayerIndex]?.batchSize}
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
                                      batchSize = {layers?.[selectedLayerIndex]?.batchSize}
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
                                      batchSize = {layers?.[selectedLayerIndex]?.batchSize}
                                      inputShape={layers?.[selectedLayerIndex]?.inputShape}
                                      onClose={HandleLayerOptionClose} />;
    else{
      layerOptions = null
    }
}
//-----------------------------------------------------------------------------------

  return (
   
    <div className="model_panel">
      <div style={{position : 'sticky'}}>
      <h2>Model panel</h2>
      <div className="model_panel_controls">
        <button  onClick={onButtonPlusClick}>+</button>
        <button  onClick={onButtonMinusClick}>-</button>
        <button  onClick={handleLayerDoubleClick}>Change </button>
      </div>
      </div>
{/* vutvorenie všetkých vrstiev siete */}
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
