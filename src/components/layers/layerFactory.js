import React from 'react';
import LayerDense from './layerDense';
import LayerConv2D from './layerConv2D';
import LayerEmpty from './layerEmpty';
import LayerMaxPool2D from './layerMaxPool2D';
import LayerAvgPool2D from './layerAvgPool2D';
import LayerDropout from './layerDropout';
import LayerFlatten from './layerFlatten';
import LayerInput from './layerInput';

// dynamické vutvorenie vrstvy podľa jej typu

const LayerFactory = ({ layer, handleLayerClick, handleLayerDoubleClick, isActive, inputShape1, inputShape2}) => {
  switch (layer.type) {
    case 'Input':
      return<LayerInput layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive = {isActive}/>;
    case 'Dense':
      return<LayerDense  layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive = {isActive} />;
    case 'Conv2D':
      return <LayerConv2D layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive ={isActive} />;
    case 'MaxPool2D':
      return <LayerMaxPool2D layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive ={isActive} />;
    case 'AvgPool2D':
      return <LayerAvgPool2D layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive ={isActive} />;
    case 'Dropout':
      return <LayerDropout layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive ={isActive}/>;
    case 'Flatten':
      return <LayerFlatten layer={layer} handleLayerClick={handleLayerClick} handleLayerDoubleClick={handleLayerDoubleClick} isActive ={isActive}/>;
    default:
      return<LayerEmpty layer={layer} isActive = {isActive}/>;
  }
};

export default LayerFactory;