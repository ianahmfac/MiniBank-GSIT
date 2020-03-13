import "intl";
import "intl/locale-data/jsonp/en";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";
import back from "../images/back.jpg";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../../navigationRef";
import miniBank from "../api/miniBank";
import crypto from "crypto-js";

const PinTransfer = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [detail, setDetail] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("transferDetail").then(result => {
      let data = JSON.parse(result);
      console.log("data tf:", data);
      setDetail(data);
    });
    AsyncStorage.getItem("userDetails").then(result => {
      let userDetail = JSON.parse(result);
      console.log("data user:", userDetail);
      setUser(userDetail);
    });
  }, []);
  let number = detail.nominal;

  checkCode = async () => {
    if (code != "") {
      if (code.length < 6) {
        alert("PIN kurang dari 6 digit");
      } else {
        try {
          const hash = crypto
            .HmacSHA256(`${code}`, `${user.idKlien}`)
            .toString();
          console.log("hash", hash);
          const params = {
            hex: `${hash}`,
            rekening: `${detail.rekening}`,
            nominal: `${detail.nominal}`,
            berita: `${detail.berita}`,
            pengirim: `${user.idTabungan}` //idTabungan
          };
          console.log(params);
          let transfer = await miniBank.post("/transfer", params, {
            headers: {
              idKlien: `${user.idKlien}`,
              token: `${user.token}`,
              limit: `${user.limit}`
            }
          });
          console.log("transfer :", transfer.data.msg);
          let buktiTransfer = {
            ...transfer.data.msg
          };
          AsyncStorage.setItem("buktiTransfer", JSON.stringify(buktiTransfer));
          navigate("BuktiTransfer");
        } catch {
          alert("PIN salah");
        }
      }
    } else {
      alert("Masukkan PIN Transfer");
    }
  };

  return (
    <>
      <ImageBackground
        imageStyle={{ resizeMode: "cover" }}
        source={back}
        style={{ width: "100%", height: "100%", flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
            <ImageBackground
              source={require("../images/homeTransfer.png")}
              style={{ width: "100%", height: 200, marginTop: 20 }}
              resizeMode="stretch"
            />
            <View
              style={{
                marginTop: "10%",
                alignItems: "center",
                width: "100%"
              }}
            >
              <View style={styles.infocard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.infoText}>Nomor Rekening: </Text>
                  <Text style={styles.infoTextRes}>{detail.rekening} </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.infoText}>Nama Penerima: </Text>
                  <Text style={styles.infoTextRes}>{detail.nama}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.infoText}>Nominal Transfer: </Text>
                  <Text style={styles.infoTextRes}>
                    {new Intl.NumberFormat("us-IN", {
                      style: "currency",
                      currency: "IDR"
                    }).format(number)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.infoText}>Berita Transfer: </Text>
                  {detail.berita == "" ? (
                    <Text style={styles.infoTextRes}>-</Text>
                  ) : (
                    <Text style={styles.infoTextRes}>{detail.berita}</Text>
                  )}
                </View>
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <TextInput
                    placeholder="PIN Transaksi"
                    onChangeText={code => {
                      setCode(code);
                    }}
                    style={styles.inputContainer}
                    underlineColorAndroid="transparent"
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    value={code}
                    maxLength={6}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.buttonContainer}
                      onPress={() => navigation.navigate("Transfer")}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons
                          name="md-arrow-round-back"
                          size={20}
                          color="white"
                        />
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

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.buttonContainer}
                      onPress={checkCode}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons name="md-send" size={20} color="white" />
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 15,
                            marginLeft: 10
                          }}
                        >
                          SEND
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#032263",
    width: 300,
    maxWidth: "80%",
    padding: 10,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    color: "black",
    textAlign: "center"
  },
  infocard: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%"
  },
  infoText: {
    color: "#032263",
    marginVertical: 10
  },
  infoTextRes: {
    color: "#032263",
    marginVertical: 10,
    fontWeight: "bold"
  },
  buttonContainer: {
    backgroundColor: "#032263",
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 200,
    maxWidth: "30%",
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10
  }
});

export default PinTransfer;
