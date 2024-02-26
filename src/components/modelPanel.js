import React, { useState, useEffect } from "react";
import LayerOptions from "./layerOptions/layerOptionsDense";
import LayerOptionsConv2D from "./layerOptions/layerOptionsConv2D";
import LayerFactory from "./layers/layerFactory";
import LayerOptionsMaxPool2D from "./layerOptions/layerOptionsMaxPool2D";
import LayerOptionsAvgPool2D from "./layerOptions/layerOptionsAvgPool2D";
import LayerOptionsDropout from "./layerOptions/layerOptionsDropout";
import { add_model_layer, create_model } from "./../model.js";
import { LayerType } from "./layers/layerEnum.js";

const ModelPanel = ({layers, onLayerListUpdate}) => {
  const [layerList, setLayerList] = useState(layers);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
  const [keyIndex, setKeyIndex] = useState(0);
  const [layerOptVis, setLayerOptionsVisibility] = useState(false);

  // const addInpuLayer = () =>{
  //   addLayer('Input');
  // }

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

  const addLayer = (layerType) => {
    setKeyIndex((prevKeyIndex) => {
      let newLayer;
      switch (layerType) {
        // case 'Input':
        //   newLayer = {
        //     type: layerType,
        //     index: prevKeyIndex,
        //     isActive: true,
        //     inputShape1: 32,
        //     inputShape2: 32
        //   };
        //   break;
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
              stride: [1,1],
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
              stride: [1,2],
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
              stride: [1,1],
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
      setLayerList((prevlist) => [...prevlist, newLayer]);
      setSelectedLayerIndex(newLayer.index);
      onLayerListUpdate(layerList)

  
      return prevKeyIndex + 1;
    });
  };

  //addInpuLayer();
  
  useEffect(() => {onLayerListUpdate(layerList)},[layerList])

  const handleLayerClick = (index) => {
    setSelectedLayerIndex(index);
  };

  const handleLayerDoubleClick = (index) => {
    if (!layerOptVis && selectedLayerIndex!=undefined){
      setLayerOptionsVisibility(true)
    }
  };

  const HandleLayerOptionClose = (layer) => {
    if(layerOptVis)
      setLayerOptionsVisibility(false)
    if(layer != undefined){
      let temp = [...layerList]
      temp[selectedLayerIndex] = layer;
      setLayerList(temp)
    }
  };

  const removeSelectedLayer = () => {
    if (layerList.length > 0) {
      const updatedLayerList = layerList.slice(0, -1);
      setLayerList(updatedLayerList);
      setSelectedLayerIndex(null)
      setKeyIndex((prevKeyIndex) =>(prevKeyIndex - 1))
    }
  };

  useEffect(() => {
    // Your existing code for handling selected layers
  }, [selectedLayerIndex]);

  let layerOptions;
  if (layerList[selectedLayerIndex] && layerList[selectedLayerIndex].type !== undefined) {
    if (layerList[selectedLayerIndex].type === "Conv2D")
      layerOptions = <LayerOptionsConv2D key={layerList?.[selectedLayerIndex]?.index}
                                         index = {layerList?.[selectedLayerIndex]?.index}
                                         type={layerList?.[selectedLayerIndex]?.type || ""}
                                         numOfKernels={layerList?.[selectedLayerIndex]?.numOfKernels}
                                         kernelSize={layerList?.[selectedLayerIndex]?.kernelSize}
                                         stride={layerList?.[selectedLayerIndex]?.stride}
                                         padding={layerList?.[selectedLayerIndex]?.padding}
                                         activationType = {layerList?.[selectedLayerIndex]?.activationType}
                                         vis={layerOptVis} 
                                         onClose={HandleLayerOptionClose} />;
    else if (layerList[selectedLayerIndex].type === "Dense")
      layerOptions = <LayerOptions key={layerList?.[selectedLayerIndex]?.index}
                                   index = {layerList?.[selectedLayerIndex]?.index}
                                   type={layerList?.[selectedLayerIndex]?.type || ""} 
                                   numOfNeurons={layerList?.[selectedLayerIndex]?.numOfNeurons} 
                                   activationType = {layerList?.[selectedLayerIndex]?.activationType}
                                   vis={layerOptVis} 
                                   onClose={HandleLayerOptionClose} />;
    else if (layerList[selectedLayerIndex].type === "MaxPool2D")
    layerOptions = <LayerOptionsMaxPool2D key={layerList?.[selectedLayerIndex]?.index}
                                      index = {layerList?.[selectedLayerIndex]?.index}
                                      type={layerList?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layerList?.[selectedLayerIndex]?.poolSize}
                                      stride={layerList?.[selectedLayerIndex]?.stride}
                                      padding={layerList?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else if (layerList[selectedLayerIndex].type === "AvgPool2D")
    layerOptions = <LayerOptionsAvgPool2D key={layerList?.[selectedLayerIndex]?.index}
                                      index = {layerList?.[selectedLayerIndex]?.index}
                                      type={layerList?.[selectedLayerIndex]?.type || ""}
                                      poolSize={layerList?.[selectedLayerIndex]?.poolSize}
                                      stride={layerList?.[selectedLayerIndex]?.stride}
                                      padding={layerList?.[selectedLayerIndex]?.padding}
                                      vis={layerOptVis} 
                                      onClose={HandleLayerOptionClose} />;
    else if (layerList[selectedLayerIndex].type === "Dropout")
    layerOptions = <LayerOptionsDropout key={layerList?.[selectedLayerIndex]?.index}
                                      index = {layerList?.[selectedLayerIndex]?.index}
                                      type={layerList?.[selectedLayerIndex]?.type || ""}
                                      rate={layerList?.[selectedLayerIndex]?.rate}
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
      {layerList.map((layer) => (
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
