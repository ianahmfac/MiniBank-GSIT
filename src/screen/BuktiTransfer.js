import "intl";
import "intl/locale-data/jsonp/en";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage
} from "react-native";
import back from "../images/back.jpg";
import { AntDesign, Feather } from "@expo/vector-icons";

const BuktiTransfer = ({ navigation }) => {
  const [buktiTransfer, setBuktiTransfer] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("buktiTransfer").then(result => {
      let data = JSON.parse(result);
      setBuktiTransfer(data);
      console.log("bukti", data);
    });
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          source={back}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <AntDesign
                  name="checkcircleo"
                  size={50}
                  color="green"
                ></AntDesign>
              </View>
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>Transfer Sukses</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.info}>Tanggal: </Text>
                <Text style={styles.info}> {buktiTransfer.tanggal} </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.info}>Waktu: </Text>
                <Text style={styles.info}> {buktiTransfer.waktu} </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.info}>Rek.Tujuan :</Text>
                <Text style={styles.info}> {buktiTransfer.rekening} </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.info}>Nominal:</Text>
                <Text style={styles.info}>
                  {" "}
                  {new Intl.NumberFormat("us-IN", {
                    style: "currency",
                    currency: "IDR"
                  }).format(buktiTransfer.nominal)}{" "}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.info}>Berita:</Text>
                {buktiTransfer.berita == "" ? (
                  <Text style={styles.info}>-</Text>
                ) : (
                  <Text style={styles.info}> {buktiTransfer.berita} </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("Home")}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Feather name="home" size={20} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                    marginLeft: 10
                  }}
                >
                  BACK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#1565c0",
    padding: 20,
    width: 200,
    maxWidth: "70%",
    marginTop: 20,
    borderRadius: 100
  },
  inputContainer: {
    width: 290,
    height: 310,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0,
    elevation: 8,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 40,
    marginTop: 150
  },
  info: {
    fontSize: 16,
    marginTop: 10
  }
});

export default BuktiTransfer;
