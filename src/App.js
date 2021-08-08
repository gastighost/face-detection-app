import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Particles from 'react-particles-js';
import './App.css';
import 'tachyons';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '768129e91317482ca0d1298440978ce5'
})

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'SignIn'
    }
  };

  calculateFaceLocation = (data) => {
    let regionList = data.outputs[0].data.regions;
        for (let i = 0; i < regionList.length; i++) {
          let boxArea = regionList[i].region_info.bounding_box;
          const image = document.getElementById('inputimage');
          const width = Number(image.width);
          const height = Number(image.height);
          return {
            leftCol: boxArea.left_col * width,
            topRow: boxArea.top_row * height,
            rightCol: width - (boxArea.right_col * width),
            bottomRow: height - (boxArea.bottom_row * height)
          }
      }
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  };

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(error => console.log(error));
  }

  render() {
  return (
    <div className="App">
      <Particles className='particles'
      params={particlesOptions}/>
      <Navigation />
      <SignIn/>
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;