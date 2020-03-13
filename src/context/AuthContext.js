import { AsyncStorage, Alert } from "react-native";
import createDataContext from "./createDataContext";
import miniBankAPI from "../api/miniBank";
import { navigate } from "../../navigationRef";
import base64 from "base-64";

const authReducer = (state, action) => {
  switch (action.type) {
    case "signIn":
      return { token: action.payload };
    case "signOut":
      return { token: null };
    case "autoLogout":
      return { token: null };
    case "clearToken":
      return { token: null };
    default:
      return state;
  }
};

const clearToken = dispatch => async () => {
  dispatch({ type: "clearToken" });
  AsyncStorage.getItem("userDetails").then(result => {
    let data = JSON.parse(result);
    console.log("logout", data);
    user = data;
    console.log(user.idKlien);
    miniBankAPI.get("/logout", {
      headers: {
        idKlien: `${user.idKlien}`
      }
    });
  });
  await AsyncStorage.removeItem("userDetails");
  await AsyncStorage.removeItem("userSaldo");
  await AsyncStorage.removeItem("userDetails");
  await AsyncStorage.removeItem("DateMutasi");
  await AsyncStorage.removeItem("transferDetail");
  await AsyncStorage.removeItem("buktiTransfer");
};

const signIn = dispatch => async ({ username, password }) => {
  try {
    console.log(username, password);
    const stringToEncode = `${username}:${password}`;
    const encodedData = base64.encode(stringToEncode);

    const res = await miniBankAPI.get("/login", {
      headers: {
        Authorization: `Basic ${encodedData}`
      }
    });
    console.log(res.data);

    let userDetails = {
      ...res.data.user,
      token: res.data.token.token,
      limit: res.data.token.expired
    };

    await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
    let loginDetails = await AsyncStorage.getItem("userDetails");
    let ld = JSON.parse(loginDetails);
    console.log(ld);
    navigate("Home");
  } catch (error) {
    if (username != "") {
      if (password != "") {
        alert("Login Gagal");
      } else {
        alert("Password tidak boleh kosong");
      }
    } else {
      alert("Username tidak boleh kosong");
    }
    dispatch({
      type: "add_error"
    });
  }
};

const signOut = dispatch => async () => {
  dispatch({ type: "signOut" });
  let user = {};
  Alert.alert("Logout", "Yakin ingin keluar?", [
    { text: "CANCEL", style: "cancel" },
    {
      text: "LOGOUT",
      onPress: async () => {
        AsyncStorage.getItem("userDetails").then(result => {
          let data = JSON.parse(result);
          console.log("logout", data);
          user = data;
          console.log(user.idKlien);
          miniBankAPI.get("/logout", {
            headers: {
              idKlien: `${user.idKlien}`
            }
          });
        });
        await AsyncStorage.removeItem("userDetails");
        await AsyncStorage.removeItem("userSaldo");
        await AsyncStorage.removeItem("userDetails");
        await AsyncStorage.removeItem("DateMutasi");
        await AsyncStorage.removeItem("transferDetail");
        await AsyncStorage.removeItem("buktiTransfer");
        navigate("loginFlow");
      }
    }
  ]);
};

const autoLogout = dispatch => async () => {
  dispatch({ type: "autoLogout" });
  let user = {};
  AsyncStorage.getItem("userDetails").then(result => {
    let data = JSON.parse(result);
    console.log("logout", data);
    user = data;
    console.log(user.idKlien);
    miniBankAPI.get("/logout", {
      headers: {
        idKlien: `${user.idKlien}`
      }
    });
  });
  await AsyncStorage.removeItem("userDetails");
  await AsyncStorage.removeItem("userSaldo");
  await AsyncStorage.removeItem("userDetails");
  await AsyncStorage.removeItem("DateMutasi");
  await AsyncStorage.removeItem("transferDetail");
  await AsyncStorage.removeItem("buktiTransfer");
  navigate("loginFlow");
  alert("Sesi Anda telah habis. Silakan login kembali");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signIn, signOut, autoLogout, clearToken },
  { token: null },
  { isSignedIn: false }
);
