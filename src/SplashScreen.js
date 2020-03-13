import React, { Component } from "react";
import img from "./images/splash.jpg";
import { ImageBackground } from "react-native";

export default class AuthRoutes extends Component {
  constructor() {
    super();
    this.state = {
      isVisible: true
    };
  }

  Hide_Splash_Screen = () => {
    this.setState({
      isVisible: false
    });
  };

  componentDidMount() {
    var that = this;
    setTimeout(function() {
      that.Hide_Splash_Screen();
    }, 3000);
  }
  render() {
    let Splash_Screen = (
      <ImageBackground
        source={img}
        style={{ width: "100%", height: "100%" }}
      ></ImageBackground>
    );
    return <>{this.state.isVisible === true ? Splash_Screen : null}</>;
  }
}

const styles = {
  barButtonIconStyle: {
    tintColor: "white"
  }
};
