import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage
} from "react-native";
import DatePicker from "react-native-datepicker";
import background from "../images/mutasiBackground.png";
import { navigate } from "../../navigationRef";
import miniBank from "../api/miniBank";
import { Context as AuthContext } from "../context/AuthContext";

const MutasiScreen = ({ navigation }) => {
  const {autoLogout} = useContext(AuthContext)
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("userDetails").then(result => {
      let userDetail = JSON.parse(result);
      console.log("data user:", userDetail);
      setUser(userDetail);
    });
  }, []);

  goToMutasicek = async () => {
    if (dateStart != "") {
      if (dateEnd != "") {
        let batas = (new Date(dateEnd) - new Date(dateStart)) / 3600000;
        if (batas <= 168) {
          if (batas >= 0) {
            try {
              let DateMutasi = {
                dateStart,
                dateEnd
              };
              const params = {
                tglAwal: `${dateStart}`,
                tglAkhir: `${dateEnd}`,
                idTabungan: `${user.idTabungan}`
              };
              console.log("parameter Mutasi", params);
              let mutasi = await miniBank.post("/mutasi", params, {
                headers: {
                  idKlien: `${user.idKlien}`,
                  token: `${user.token}`,
                  limit: `${user.limit}`
                }
              });
              console.log("Mutasi Respons", mutasi.data.mutasi);
              AsyncStorage.setItem("dateMutasi", JSON.stringify(DateMutasi));
              AsyncStorage.setItem(
                "mutasiDetail",
                JSON.stringify(mutasi.data.mutasi)
              );
              navigate("MutasiCek");
            } catch{
              autoLogout();
            }
          } else {
            alert("Tanggal tidak valid");
          }
        } else {
          alert("Input Tanggal Maksimal 7 Hari");
        }
      } else {
        alert("Input Tanggal Akhir");
      }
    } else {
      alert("Input Tanggal Awal");
    }
  };

  return (
    <>
      <ImageBackground
        style={styles.background}
        resizeMode="stretch"
        source={background}
      >
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            <View style={styles.body}>
              <View style={styles.card1}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#01274c" }}
                >
                  MUTASI REKENING
                </Text>
              </View>
              <View style={{ ...styles.card, ...{ marginBottom: 20 } }}>
                <View
                  style={{ borderBottomWidth: 2, borderBottomColor: "black" }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 5,
                      textAlign: "left",
                      color: "#01274c",
                      fontWeight: "bold"
                    }}
                  >
                    Nomor Rekening
                  </Text>
                  <Text style={{ textAlign: "left", color: "#01274c" }}>
                    {user.noRekening}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 10,
                    color: "#01274c",
                    fontWeight: "bold"
                  }}
                >
                  Dari Tanggal{"\n"}
                </Text>
                <DatePicker
                  style={{ width: "100%" }}
                  date={dateStart}
                  label="Start Date"
                  placeholder="pilih tanggal"
                  format="DD MMM YYYY"
                  mode="date"
                  selectsStart
                  startDate={dateStart}
                  endDate={dateEnd}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={true}
                  value={dateStart}
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={dateStart => {
                    setDateStart(dateStart);
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 20,
                    color: "#01274c",
                    fontWeight: "bold"
                  }}
                >
                  Sampai Tanggal{"\n"}
                </Text>
                <DatePicker
                  style={{ width: "100%" }}
                  date={dateEnd}
                  label="End Date"
                  placeholder="pilih tanggal"
                  format="DD MMM YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  selectsStart
                  startDate={dateStart}
                  endDate={dateEnd}
                  value={dateEnd}
                  showIcon={true}
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={dateEnd => {
                    setDateEnd(dateEnd);
                  }}
                />
                <Text
                  style={{ marginTop: 5, color: "red", fontWeight: "bold" }}
                >
                  Catatan:
                </Text>
                <Text style={{ color: "red", fontSize: 12 }}>
                  *HANYA DAPAT MELIHAT MUTASI MAKSIMAL SELAMA 7 HARI
                </Text>
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => navigation.navigate("Info Rekening")}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: "center",
                        color: "white"
                      }}
                    >
                      BACK
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={goToMutasicek}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: "center",
                        color: "white"
                      }}
                    >
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%"
  },
  body: {
    backgroundColor: "grey",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    alignItems: "center",
    padding: 15,
    marginTop: "30%",
    height: 485,
    width: "85%"
  },
  submit: {
    padding: 10,
    backgroundColor: "#032263",
    width: 100,
    borderRadius: 30
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    height: 370,
    borderColor: "black",
    borderWidth: 1
  },
  card1: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 35,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1
  }
});

export default MutasiScreen;
