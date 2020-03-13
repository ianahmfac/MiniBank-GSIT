import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl
} from "react-native";
import back from "../images/back.jpg";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../../navigationRef";
import miniBank from "../api/miniBank";
import { Context as AuthContext } from "../context/AuthContext";

const TransferScreen = ({ navigation }) => {
  const { autoLogout } = useContext(AuthContext);
  const [rekening, setRekening] = useState("");
  const [nominal, setNominal] = useState("");
  const [berita, setBerita] = useState("");
  const [saldo, setSaldo] = useState("");
  const [user, setUser] = useState({});

  checkTextInput = async () => {
    if (rekening != "") {
      if (nominal != "") {
        if (user.noRekening != rekening) {
          if (parseInt(saldo) >= parseInt(nominal)) {
            if (parseInt(saldo) - parseInt(nominal) > 30000) {
              try {
                const params = {
                  rekening: `${rekening}`,
                  nominal: `${nominal}`,
                  berita: `${berita}`,
                  pengirim: `${user.idTabungan}`
                };
                console.log(params);
                let transfer = await miniBank.post("/cekPenerima", params, {
                  headers: {
                    idKlien: `${user.idKlien}`,
                    token: `${user.token}`,
                    limit: `${user.limit}`
                  }
                });
                console.log("transfer :", transfer.data);
                let transferDetail = {
                  ...transfer.data.penerima
                };
                AsyncStorage.setItem(
                  "transferDetail",
                  JSON.stringify(transferDetail)
                );
                navigate("PinTransfer");
              } catch {
                alert("Nomor rekening tidak terdaftar");
              }
            } else {
              alert("Saldo tidak boleh kurang dari 30.000");
            }
          } else {
            alert("Saldo Anda Tidak Mencukupi");
          }
        } else {
          alert("Tidak dapat transfer ke nomor rekening sendiri");
        }
      } else {
        alert("Input Nominal!");
      }
    } else {
      alert("Input Rekening!");
    }
  };

  const getAccountDetail = () => {
    return new Promise(() => {
      AsyncStorage.getItem("userDetails").then(result => {
        let userData = JSON.parse(result);
        setUser(userData);
        miniBank
          .get("/cekSaldo", {
            headers: {
              token: `${userData.token}`,
              idTabungan: `${userData.idTabungan}`,
              idKlien: `${userData.idKlien}`,
              limit: `${userData.limit}`
            }
          })
          .then(response => {
            console.log("saldo", response.data);
            console.log(response.status);
            setSaldo(response.data.dataTabungan.saldo);
          })
          .catch(() => {
            autoLogout();
          });
      });
    });
  };

  useEffect(() => {
    getAccountDetail();
  }, []);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
    getAccountDetail();
  }, [refreshing]);

  return (
    <>
      <ImageBackground
        style={{ width: "100%", height: "100%", flex: 1 }}
        imageStyle={{ resizeMode: "cover" }}
        source={back}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={30}
            >
              <View style={{ alignItems: "center" }}>
                <ImageBackground
                  source={require("../images/homeTransfer.png")}
                  style={{ width: "100%", height: 200, marginTop: 20 }}
                  resizeMode="stretch"
                >
                  <View style={{ ...styles.card, ...{ marginTop: 150 } }}>
                    <Text>From</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      {user.nama}
                    </Text>
                    <Text>{user.noRekening}</Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.card}>
                <Text style={styles.labelInput}>Rekening Tujuan</Text>
                <TextInput
                  onChangeText={rekening => {
                    setRekening(rekening);
                  }}
                  style={styles.inputContainer}
                  underlineColorAndroid="transparent"
                  placeholder="Masukkan Rekening Tujuan"
                  keyboardType="number-pad"
                  value={rekening}
                  maxLength={8}
                  clearButtonMode="always"
                />
                <Text style={styles.labelInput}>Nominal</Text>
                <TextInput
                  onChangeText={nominal => {
                    setNominal(nominal);
                  }}
                  style={styles.inputContainer}
                  placeholder="Masukkan Nominal"
                  keyboardType="number-pad"
                  value={nominal}
                  maxLength={8}
                  max={8}
                  clearButtonMode="always"
                />
                <Text style={styles.labelInput}>Berita Transfer</Text>
                <TextInput
                  onChangeText={berita => {
                    setBerita(berita);
                  }}
                  style={styles.beritaContainer}
                  placeholder="(Optional)"
                  value={berita}
                  maxLength={35}
                  clearButtonMode="always"
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.buttonContainer}
                    onPress={checkTextInput}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 15,
                          marginRight: 10
                        }}
                      >
                        SEND
                      </Text>
                      <Ionicons name="md-send" size={20} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#032263",
    width: 300,
    maxWidth: "100%",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#032263"
  },
  beritaContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#032263",
    width: 300,
    maxWidth: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "#032263"
  },
  labelInput: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#032263"
  },
  buttonContainer: {
    backgroundColor: "#032263",
    padding: 10,
    width: 100,
    maxWidth: "50%",
    marginTop: 20,
    borderRadius: 100
  },
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 80,
    marginHorizontal: 35,
    position: "relative"
  }
});

export default TransferScreen;
