import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import SplashScreen from "./src/SplashScreen";
import LoginScreen from "./src/screen/LoginScreen";
import HomeScreen from "./src/screen/HomeScreen";
import InfoScreen from "./src/screen/InfoScreen";
import ProfileScreen from "./src/screen/ProfileScreen";
import TransferScreen from "./src/screen/TransferScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator, navigate } from "./navigationRef";
import PinTransfer from "./src/screen/PinTransfer";
import BuktiTransfer from "./src/screen/BuktiTransfer";
import MutasiScreen from "./src/screen/MutasiScreen";
import MutasiCek from "./src/screen/MutasiCek";

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Login: LoginScreen
  }),
  Home: HomeScreen,
  PinTransfer: PinTransfer,
  BuktiTransfer: BuktiTransfer,
  MutasiScreen: {
    screen: MutasiScreen,
    navigationOptions: {
      title: "Mutasi"
    }
  },
  MutasiCek: MutasiCek,
  mainFlow: createBottomTabNavigator(
    {
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          tabBarVisible: false
        }
      },
      "Info Rekening": InfoScreen,
      Transfer: TransferScreen,
      Profile: ProfileScreen
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          if (routeName === "Home") {
            return (
              <Image
                source={require("./src/images/home.png")}
                style={{ width: 40, height: 40 }}
              />
            );
          } else if (routeName === "Info Rekening") {
            return (
              <Image
                source={require("./src/images/info.png")}
                style={{ width: 40, height: 40 }}
              />
            );
          } else if (routeName === "Transfer") {
            return (
              <Image
                source={require("./src/images/transfer.png")}
                style={{ width: 40, height: 40 }}
              />
            );
          } else {
            return (
              <Image
                source={require("./src/images/user.png")}
                style={{ width: 40, height: 40 }}
              />
            );
          }
        }
      }),
      tabBarOptions: {
        activeTintColor: "#0059b3",
        inactiveTintColor: "#263238",
        style: { height: 60 },
        labelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginTop: -10,
          marginBottom: 5
        }
      }
    }
  )
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <SplashScreen />
      <App
        ref={navigator => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};
