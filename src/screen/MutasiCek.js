import "intl";
import "intl/locale-data/jsonp/en";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  FlatList
} from "react-native";
import gsit from "../images/gsit.png";
import logo from "../images/mbankMutasi.png";

const MutasiCek = ({ navigation }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rekening, setRekening] = useState("");
  const [mutasiDetail, setMutasiDetail] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("dateMutasi").then(result => {
      let data = JSON.parse(result);
      setStart(data.dateStart);
      setEnd(data.dateEnd);
    });
    AsyncStorage.getItem("userDetails").then(result => {
      let data = JSON.parse(result);
      setRekening(data.noRekening);
    });
    AsyncStorage.getItem("mutasiDetail").then(result => {
      let data = JSON.parse(result);
      setMutasiDetail(data);
      console.log("Mutasi Det:", data);
    });
  }, []);

  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds

  const data = mutasiDetail;
  console.log("Data Mutasi", data);

  renderItem = itemData => {
    let chosen = "";
    itemData.item.idTabungan % 2 == 0
      ? (chosen = styles.genap)
      : (chosen = styles.ganjil);
    return (
      <View style={chosen}>
        <Text
          style={{
            flex: 1,
            textAlign: "left",
            textTransform: "capitalize",
            fontSize: 12
          }}
        >
          {itemData.item.tanggalTransaksi}
        </Text>
        <View style={{ flex: 3, marginLeft: 15 }}>
          {itemData.item.keterangan == "Transfer" &&
          itemData.item.saldoMasuk == 0 ? (
            <View>
              <Text style={{ textAlign: "left", fontSize: 12 }}>
                {itemData.item.penerima}
              </Text>
              <Text
                style={{
                  textAlign: "left",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 12
                }}
              >
                {new Intl.NumberFormat("us-IN", {
                  style: "currency",
                  currency: "IDR"
                }).format(itemData.item.saldoKeluar)}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={{ textAlign: "left", fontSize: 12 }}>
                {itemData.item.pengirim}
              </Text>
              <Text
                style={{
                  textAlign: "left",
                  color: "green",
                  fontWeight: "bold",
                  fontSize: 12
                }}
              >
                {new Intl.NumberFormat("us-IN", {
                  style: "currency",
                  currency: "IDR"
                }).format(itemData.item.saldoMasuk)}
              </Text>
            </View>
          )}
          {itemData.item.beritaTransfer == null ? (
            <Text style={{ textAlign: "left", fontSize: 12 }}>Berita: -</Text>
          ) : (
            <Text style={{ textAlign: "left", fontSize: 12 }}>
              Berita: {itemData.item.beritaTransfer}
            </Text>
          )}
        </View>
        <Text style={{ flex: 1, textAlign: "left", fontSize: 12 }}>
          {itemData.item.keterangan}
        </Text>
        <Text style={{ flex: 2, textAlign: "right", fontSize: 12 }}>
          {new Intl.NumberFormat("us-IN", {
            style: "currency",
            currency: "IDR"
          }).format(itemData.item.totalSaldo)}
        </Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ flex: 8 }}>
          <View style={styles.headergambar}>
            <Image source={gsit} style={{ width: 120, height: 50 }}></Image>
            <Image
              source={logo}
              style={{ width: 140, height: 60 }}
              resizeMode="stretch"
            ></Image>
          </View>
          <View style={styles.header}>
            <View>
              <Text style={{ marginBottom: 5, color: "white", fontSize: 13 }}>
                No Rekening :{" "}
              </Text>
              <Text style={{ marginBottom: 5, color: "white", fontSize: 13 }}>
                Periode Mutasi :{" "}
              </Text>
              <Text style={{ color: "white", fontSize: 13 }}>Tanggal : </Text>
            </View>

            <View>
              <Text
                mode="date"
                style={{
                  textAlign: "right",
                  marginBottom: 5,
                  color: "white",
                  fontSize: 13
                }}
              >
                {rekening}
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  marginBottom: 5,
                  color: "white",
                  fontSize: 13
                }}
              >
                {start} - {end}
              </Text>
              <Text
                style={{ textAlign: "right", color: "white", fontSize: 13 }}
              >
                {date}/{month}/{year}, {hours}:{min}:{sec}
              </Text>
            </View>
          </View>

          <View style={styles.judul}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                flex: 1,
                textAlign: "left"
              }}
            >
              Tgl
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 15,
                flex: 3,
                textAlign: "left"
              }}
            >
              Transaksi
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                flex: 1,
                textAlign: "left"
              }}
            >
              Status
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                flex: 2,
                textAlign: "right"
              }}
            >
              Saldo Akhir
            </Text>
          </View>

          <View style={{ backgroundColor: "white", flex: 1 }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.idTabungan}
            />
          </View>
        </View>

        <View
          style={{
            borderTopColor: "black",
            borderTopWidth: 2,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginHorizontal: 20,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("MutasiScreen")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>BACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>HOME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headergambar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  header: {
    borderBottomWidth: 2,
    padding: 10,
    backgroundColor: "#051431",
    flexDirection: "row",
    justifyContent: "space-between"
  },

  judul: {
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#dedcd9",
    height: 50,
    alignItems: "center",
    borderBottomWidth: 1
  },

  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#051431",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    marginHorizontal: 30
  },
  genap: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    flex: 1,
    backgroundColor: "#dedcd9",
    paddingHorizontal: 10
  },
  ganjil: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
    paddingHorizontal: 10
  }
});

export default MutasiCek;
