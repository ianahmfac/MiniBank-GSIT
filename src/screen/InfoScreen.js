import "intl";
import "intl/locale-data/jsonp/en";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage,
  RefreshControl,
  Alert
} from "react-native";
import back from "../images/back.jpg";
import miniBank from "../api/miniBank";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Context as AuthContext } from "../context/AuthContext";

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const InfoScreen = ({ navigation }) => {
  const { autoLogout } = useContext(AuthContext);
  const [user, setUser] = useState({
    idKlien: "",
    idNasabah: "",
    idTabungan: "",
    nama: "",
    token: "",
    limit: "",
    noRekening: ""
  });
  const [balance, setBalance] = useState("");
  const [recap, setRecap] = useState({});

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
            setBalance(response.data.dataTabungan.saldo);
            setRecap(response.data.dataAkumulasi);
          })
          .catch(() => {
            autoLogout();
          });
      });
    });
  };

  const rekapHarian = () => {
    Alert.alert(
      "Rekap Transaksi Harian",
      `Akumulasi Keluar: ${recap.akumulasiKeluar}\nAkumulasi Masuk: ${
        recap.akumulasiMasuk
      }\nJumlah Keluar: ${new Intl.NumberFormat("us-IN", {
        style: "currency",
        currency: "IDR"
      }).format(
        recap.jumlahKeluar
      )}\nJumlah Masuk: ${new Intl.NumberFormat("us-IN", {
        style: "currency",
        currency: "IDR"
      }).format(recap.jumlahMasuk)}`,
      [{ text: "OK", style: "cancel" }]
    );
  };

  useEffect(() => {
    getAccountDetail();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
    getAccountDetail();
  }, [refreshing]);

  if (user) {
    return (
      <>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          source={back}
        >
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <ImageBackground
                  source={require("../images/baninforek.png")}
                  style={{ width: "100%", height: 200, marginTop: 20 }}
                  resizeMode="stretch"
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ ...styles.card, ...{ marginTop: 130 } }}>
                      <Text style={{ marginTop: 10, marginLeft: 10 }}>
                        Halo,
                      </Text>
                      <Text style={styles.name}>{user.nama}</Text>
                      <Text style={styles.infoRek}>{user.noRekening}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.inputContainer}>
                  <ImageBackground
                    source={require("../images/cardinfo.png")}
                    style={{
                      alignItems: "center",
                      width: 360,
                      height: 270
                    }}
                    resizeMode="contain"
                  >
                    <Text style={styles.infoSaldo}>
                      {new Intl.NumberFormat("us-IN", {
                        style: "currency",
                        currency: "IDR"
                      }).format(balance)}
                    </Text>
                  </ImageBackground>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-around"
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.buttonContainer}
                      onPress={() => navigation.navigate("MutasiScreen")}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons name="md-paper" size={18} color="white" />
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 13,
                            marginLeft: 5
                          }}
                        >
                          MUTASI
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.buttonContainer}
                      onPress={rekapHarian}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons name="md-paper" size={18} color="white" />
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 13,
                            marginLeft: 5
                          }}
                        >
                          REKAP
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </>
    );
  } else {
    return (
      <>
        <View>
          <Text>No user</Text>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#032263",
    padding: 15,
    width: 200,
    maxWidth: "35%",
    marginHorizontal: 10,
    borderRadius: 20
  },
  name: {
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
    marginLeft: 10
  },
  inputContainer: {
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 10,
    height: 340,
    width: 340,
    marginTop: 35
  },
  infoSaldo: {
    fontSize: 20,
    marginTop: 120,
    fontWeight: "bold",
    color: "white"
  },
  infoRek: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10
  },
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 10,
    height: 90,
    width: 340
  }
});

export default InfoScreen;
