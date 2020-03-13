import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage,
  FlatList,
  RefreshControl
} from "react-native";
import back from "../images/profileBackground.png";
import { Context as AuthContext } from "../context/AuthContext";
import miniBank from "../api/miniBank";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { autoLogout, signOut } = useContext(AuthContext);
  const [user, setUser] = useState({
    idKlien: "",
    idNasabah: "",
    idTabungan: "",
    nama: "",
    token: "",
    limit: "",
    noRekening: ""
  });
  const [profile, setProfile] = useState({});

  const getProfileDetail = () => {
    return new Promise(() => {
      AsyncStorage.getItem("userDetails").then(result => {
        let userData = JSON.parse(result);
        setUser(userData);
        miniBank
          .get("/profile", {
            headers: {
              token: `${userData.token}`,
              idNasabah: `${userData.idNasabah}`,
              idKlien: `${userData.idKlien}`,
              limit: `${userData.limit}`
            }
          })
          .then(response => {
            setProfile(response.data.dataNasabah);
          })
          .catch(() => {
            autoLogout();
          });
      });
    });
  };

  useEffect(() => {
    getProfileDetail();
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
    getProfileDetail();
  }, [refreshing]);

  const list = [
    {
      id: "a",
      title: `${user.noRekening}`,
      icon: "account-balance"
    },
    {
      id: "b",
      title: `${profile.alamat}`,
      icon: "home"
    },
    {
      id: "c",
      title: `${profile.tempatLahir}, ${profile.tanggalLahir}`,
      icon: "date-range"
    },
    {
      id: "d",
      title: `${profile.noTelepon}`,
      icon: "contact-phone"
    },
    {
      id: "e",
      title: "Logout",
      icon: "exit-to-app"
    }
  ];

  renderItem = itemData => {
    return (
      <View style={{ backgroundColor: "#dadbdb", paddingHorizontal: 10 }}>
        <View
          style={{
            borderBottomColor: "silver",
            borderBottomWidth: 0.5,
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <MaterialIcons name={itemData.item.icon} size={25} />
          {itemData.item.title != "Logout" ? (
            <Text
              style={{
                marginLeft: 20,
                width: "85%",
                textTransform: "capitalize"
              }}
            >
              {itemData.item.title}
            </Text>
          ) : (
            <TouchableOpacity onPress={signOut}>
              <Text
                style={{
                  marginLeft: 20,
                  width: "85%",
                  textTransform: "capitalize"
                }}
              >
                {itemData.item.title}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      style={{ height: "100%", width: "100%" }}
      imageStyle={{ resizeMode: "stretch", marginTop: 20 }}
      source={back}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <ImageBackground
          source={require("../images/card.png")}
          style={{
            height: 220,
            width: "100%",
            marginTop: 70,
            justifyContent: "flex-end"
          }}
          resizeMode="cover"
        >
          <Text
            style={{ ...styles.name, ...{ textAlign: "left", marginLeft: 30 } }}
          >
            {user.nama}
          </Text>
        </ImageBackground>
        <View style={styles.userContainer}>
          <Text style={styles.name}>USER INFORMATION</Text>
          <View style={{ height: "80%" }}>
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
              }
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    padding: 10,
    textAlign: "center"
  },
  userContainer: {
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "#01162c",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 25,
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginTop: 20,
    flex: 1
  }
});

export default ProfileScreen;
