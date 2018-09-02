import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';  
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';   
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';  
import './App.css';
import Particles from 'react-particles-js';
import 'tachyons';


const app = new Clarifai.App({
       apiKey: 'ad3b94ee136b4c6f8dec7418511014b0'
      });


const particlesOptions ={
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 250
      }
  }

}
}

class App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow : height - (clarifaiFace.bottom_row * height)
  }
}

displayFacebox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
   this.setState({imageUrl: this.state.input});
    
      // predict the contents of an image by passing in a url
      app.models.
      predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFacebox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
      
      
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
   const { isSignedIn, imageUrl, route, box } = this.state;
     return (
       <div className="App">
          <Particles className='particles'
           params={particlesOptions} 
           /> 
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
    }
{ this.state.route === 'home' 
        ? <div>
        <Logo />
           <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} 
        />
       <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>    
        : (
            this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>  
        
         : <Register onRouteChange={this.onRouteChange} />
        )
          
      }
      </div>
    );
  }
}

export default App;
