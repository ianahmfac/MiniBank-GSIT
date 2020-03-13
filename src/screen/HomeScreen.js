import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  AsyncStorage,
  BackHandler
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import background from "../images/back.jpg";
import info from "../images/info.png";
import transfer from "../images/transfer.png";
import user from "../images/user.png";
import logo from "../images/gsit2.png";
import { AntDesign } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";

const HomeScreen = ({ navigation }) => {
  const { signOut, autoLogout } = useContext(AuthContext);
  const [name, setname] = useState("");
  const [image] = useState([
    require("../images/banHome.jpeg"),
    require("../images/banInfo.jpeg"),
    require("../images/banTransfer.jpeg"),
    require("../images/banProfile.jpeg")
  ]);

  const userDetails = () => {
    AsyncStorage.getItem("userDetails")
      .then(result => {
        let data = JSON.parse(result);
        setname(data.nama);
      })
  };

  useEffect(() => {
    userDetails();
    const handler = BackHandler.addEventListener("hardwareBackPress", signOut);
    return () => handler.remove();
  }, []);
  
  return (
    <>
      <ImageBackground style={styles.screen} source={background}>
        <View
          style={{
            backgroundColor: "#032263",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            paddingHorizontal: 15,
            alignItems: "center"
          }}
        >
          <Image source={logo} style={{ width: 100, height: 40 }} />
          <TouchableOpacity onPress={signOut}>
            <AntDesign name="logout" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Selamat Datang,
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>
            {" "}
            {name}{" "}
          </Text>
        </View>
        <View style={{ alignItems: "center", backgroundColor: "white" }}>
          <Image
            source={require("../images/minibank.png")}
            style={{ width: 130, height: 30 }}
          />
        </View>
        <View style={{ flex: 2 }}>
          <SliderBox
            images={image}
            sliderBoxHeight={200}
            resizeMode="stretch"
            dotColor="steelblue"
            autoplay={true}
            circleLoop={true}
          />
        </View>
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Info Rekening")}
              style={styles.card}
            >
              <Image source={info} style={{ height: 80, width: 80 }} />
              <Text style={{ fontSize: 12, textAlign: "center" }}>
                INFO REKENING
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Transfer")}
              style={styles.card}
            >
              <Image source={transfer} style={{ height: 80, width: 80 }} />
              <Text style={{ fontSize: 12, textAlign: "center" }}>
                TRANSFER
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.card}
            >
              <Image source={user} style={{ height: 80, width: 80 }} />
              <Text style={{ fontSize: 12, textAlign: "center" }}>PROFIL</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent: "flex-end", flex: 1 }}>
          <Image
            source={require("../images/marginBawah.jpg")}
            style={{ width: "100%", height: 40 }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20
  },
  card: {
    flex: 1,
    maxWidth: "80%",
    height: 150,
    margin: 10,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10
  }
});

export default HomeScreen;
