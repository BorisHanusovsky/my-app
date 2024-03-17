import React, { useState, useEffect, useRef } from "react";
import LayerOptions from "./layerOptions/layerOptionsDense";
import LayerOptionsConv2D from "./layerOptions/layerOptionsConv2D";
import LayerFactory from "./layers/layerFactory";
import LayerOptionsMaxPool2D from "./layerOptions/layerOptionsMaxPool2D";
import LayerOptionsAvgPool2D from "./layerOptions/layerOptionsAvgPool2D";
import LayerOptionsDropout from "./layerOptions/layerOptionsDropout";
import { add_model_layer, create_model } from "./../model.js";
import { LayerType } from "./layers/layerEnum.js";

const ModelPanel = ({layers, setLayerList, onIndexChange}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
  const [keyIndex, setKeyIndex] = useState(layers.length);
  const [layerOptVis, setLayerOptionsVisibility] = useState(false);
  const newLayerRef = useRef(null);

  // useEffect(() => {
  //   setLayerList(layers);
  // }, [layers, setLayerList]);
  


  const openLayerOptions = () => {
    let modal = document.getElementById("myModal");
    let modalLayers = document.getElementById("modal_layers");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
  
    span.onclick = function () {
      modal.style.display = "none";
      modalLayers.innerHTML = '';
    };
  
    modalLayers.innerHTML = '';
  
  const layerTypesArray = Object.values(LayerType);
    for (let dir of layerTypesArray) {
      let element = document.createElement("button");
      element.classList.add('layer_button');
      element.textContent = dir;
      element.setAttribute("layer_type", dir);
  
      element.removeEventListener('click', () => addLayer(dir));
      element.addEventListener('click', () => addLayer(dir));
      
      modalLayers.appendChild(element);
    }
  };

  console.log("ModelPanel component rendered");
  console.log(selectedLayerIndex, keyIndex);

  const addLayer = (layerType) => {
    setKeyIndex((prevKeyIndex) => {
      let newLayer;
      switch (layerType) {
        case 'Dense':
          newLayer = {
            type: layerType,
            index: prevKeyIndex,
            numOfNeurons: 16, 
            isActive: false,
            activationType: "linear",
            inputShape : null
          };
          break;
        case 'Conv2D':
            newLayer = {
              type: layerType,
              index: prevKeyIndex,
              numOfKernels: 16,
              kernelSize: [3,3],
              strides: [1,1],
              padding: "valid",
              isActive: false,
              activationType: "linear",
              inputShape : null
            };
            break;
        case 'MaxPool2D':
            newLayer = {
              type: layerType,
              index: prevKeyIndex,
              poolSize: [2,2],
              strides: [2,2],
              padding: "valid",
              isActive: false,
              inputShape : null
            };
            break;  
        case 'AvgPool2D':
            newLayer = {
              type: layerType,
              index: prevKeyIndex,
              poolSize: [2,2],
              strides: [2,2],
              padding: "valid",
              isActive: false,
              inputShape : null
            };
            break;  
        case 'Dropout':
            newLayer = {
              type: layerType,
              index: prevKeyIndex,
              isActive: false,
              rate: 0.5,
            };
            break;  
        case 'Flatten':
            newLayer = {
              type: layerType,
              index: prevKeyIndex,
              isActive: false,
            };
            break;  
        default:
          newLayer = {
            type: layerType,
            index: prevKeyIndex,
          };
      }
      setSelectedLayerIndex(newLayer.index);
      onIndexChange()
      newLayerRef.current = newLayer;
      return prevKeyIndex + 1;
    });
  };

  useEffect(() => {
    if (newLayerRef.current !== null && selectedLayerIndex !== null) {
      setLayerList((prevLayers) => {
        const updatedLayers = [...prevLayers, newLayerRef.current];
        newLayerRef.current = null; // Reset the ref after updating the state
        return updatedLayers;
      });
    }
  }, [selectedLayerIndex, setLayerList]);

  const handleLayerClick = (index) => {
    setSelectedLayerIndex(index);
    onIndexChange(index)
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

  const removeSelectedLayer = () => {
    setSelectedLayerIndex(null);
    onIndexChange(null)
    if (layers.length > 0) {
      setKeyIndex((prevKeyIndex) => prevKeyIndex - 1);
      setLayerList((prevLayers) => prevLayers.slice(0, -1));
    }
    else{
      setKeyIndex(0);
    }
  };

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
                                   onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "MaxPool2D")
    layerOptions = <LayerOptionsMaxPool2D key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layers?.[selectedLayerIndex]?.poolSize}
                                      strides={layers?.[selectedLayerIndex]?.strides}
                                      padding={layers?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "AvgPool2D")
    layerOptions = <LayerOptionsAvgPool2D key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layers?.[selectedLayerIndex]?.poolSize}
                                      strides={layers?.[selectedLayerIndex]?.strides}
                                      padding={layers?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else if (layers[selectedLayerIndex].type === "Dropout")
    layerOptions = <LayerOptionsDropout key={layers?.[selectedLayerIndex]?.index}
                                      index = {layers?.[selectedLayerIndex]?.index}
                                      type={layers?.[selectedLayerIndex]?.type || ""}
                                      rate={layers?.[selectedLayerIndex]?.rate}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else{
      layerOptions = null
    }
}
  return (
   
    <div className="model_panel">
      <div className="model_panel_controls">
        <button className = "sticky" onClick={openLayerOptions}>+</button>
        <button className = "sticky" onClick={removeSelectedLayer}>-</button>
        <button className = "sticky" onClick={handleLayerDoubleClick}>Change </button>
      </div>
      <h2>Model panel</h2>
      {layers.map((layer) => (
        <LayerFactory
        key={layer.index}
        layer={layer}
        handleLayerClick={handleLayerClick}
        handleLayerDoubleClick={handleLayerDoubleClick}
        isActive = {layer.index === selectedLayerIndex ? true : false}
      />
      ))}
      {layerOptions}
    </div>
  );
}

export default ModelPanel;
