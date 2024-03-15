import React, { useRef } from 'react';
const tf = require('@tensorflow/tfjs');

const IMAGE_H = 28;
const IMAGE_W = 28;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;
const NUM_TRAIN_ELEMENTS = 55000;

const MNIST_IMAGES_SPRITE_PATH =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

  class MnistData {
    constructor() {}
  
    async load() {
      const img = new Image();
      const imgRequest = new Promise((resolve) => {
        img.crossOrigin = '';
        img.onload = () => {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
  
          const datasetBytesBuffer = new ArrayBuffer(
            NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4
          );
  
          const chunkSize = 5000;
  
          for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
            const datasetBytesView = new Float32Array(
              datasetBytesBuffer,
              i * IMAGE_SIZE * chunkSize * 4,
              IMAGE_SIZE * chunkSize
            );
  
            // Directly manipulate image data without using canvas
            const startIndex = i * chunkSize * img.width * 4;
            const endIndex = startIndex + chunkSize * img.width * 4;
            const imageData = new Uint8Array(
              new Uint8Array(img.src.slice(startIndex, endIndex))
            );
  
            for (let j = 0; j < chunkSize; j++) {
              const pixelIndex = j * 4; // Each pixel has 4 values (R, G, B, A)
              const grayscaleValue =
                (imageData[pixelIndex] + imageData[pixelIndex + 1] + imageData[pixelIndex + 2]) / (3 * 255);
              datasetBytesView[j] = grayscaleValue;
            }
          }
  
          this.datasetImages = new Float32Array(datasetBytesBuffer);
  
          resolve();
        };
        img.src = MNIST_IMAGES_SPRITE_PATH;
      });
  
      const labelsRequest = fetch(MNIST_LABELS_PATH);
      const [imgResponse, labelsResponse] = await Promise.all([
        imgRequest,
        labelsRequest,
      ]);
  
      this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());
  
      this.trainImages = this.datasetImages.slice(
        0,
        IMAGE_SIZE * NUM_TRAIN_ELEMENTS
      );
      this.testImages = this.datasetImages.slice(
        IMAGE_SIZE * NUM_TRAIN_ELEMENTS
      );
      this.trainLabels = this.datasetLabels.slice(
        0,
        NUM_CLASSES * NUM_TRAIN_ELEMENTS
      );
      this.testLabels = this.datasetLabels.slice(
        NUM_CLASSES * NUM_TRAIN_ELEMENTS
      );
    }

  getTrainData() {
    const xs = tf.tensor4d(
      this.trainImages,
      [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]
    );
    const labels = tf.tensor2d(
      this.trainLabels,
      [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]
    );
    return { xs, labels };
  }
}

export default function Navbar({
  onFilesSelected,
  onSaveButtonPressed,
  onDatasetImportStart,
  onImportButtonPressed,
  onTrainButtonPressed,
}) {
  const fileInputRef = useRef(null);
  const modelInputRef = useRef(null);

  async function handleLoadDataClicked() {
    onDatasetImportStart();
    let mnistData = new MnistData();
    await mnistData.load();
    const { xs, labels } = mnistData.getTrainData();
    const arr = xs.arraySync();
    console.log(arr)
    console.log(labels)
    onFilesSelected([arr, labels]);
    mnistData = null;
  }

  function handleLoadModelClicked() {
    modelInputRef.current.click();
  }

  function handleInputChanged(event) {
    console.log('Selected files:', event.target.files);
    onFilesSelected(event.target.files);
  }

  function handleModelChanged(event) {
    console.log('Selected files:', event.target.files);
    onImportButtonPressed(event.target.files);
  }

  function handleSaveModel() {
    onSaveButtonPressed();
  }

  function handleImportModel() {
    //modelInputRef.current.click();
    onImportButtonPressed();
  }

  function handleTrainButtonPressed() {
    onTrainButtonPressed();
  }

  return (
    <nav>
      <span className="nav_left">
        <button onClick={handleImportModel}>Import model</button>
        <button onClick={handleSaveModel}>Save model</button>
      </span>
      <span className="nav_right">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(event) => handleInputChanged(event)}
          id="dataInput"
          name="dataInput"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        <input
          directory=""
          ref={modelInputRef}
          onChange={(event) => handleModelChanged(event)}
          webkitdirectory=""
          type="file"
          style={{ display: 'none' }}
        />
        <button id="loadDataButton" onClick={handleLoadDataClicked}>
          Load data
        </button>
        <button onClick={handleTrainButtonPressed}>Train</button>
        <button>Test</button>
      </span>
    </nav>
  );
}
