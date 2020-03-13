import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Alert,
  Linking
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { signIn, clearToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearToken();
  }, []);

  const keyboard = Platform.OS === "ios" ? -100 : -150;

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboard}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../images/loginHeader.png")}
              style={{
                alignItems: "center",
                height: "50%",
                width: "100%",
                resizeMode: "cover"
              }}
            />
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Feather name="user-check" size={20} color="#002f6c" />
                <TextInput
                  style={styles.inputContainer}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setUsername}
                  value={username}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  placeholder="Username"
                  placeholderTextColor="#002f6c"
                  selectionColor="#fff"
                  clearButtonMode="always"
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Feather name="lock" size={20} color="#002f6c" />
                <TextInput
                  style={styles.inputContainer}
                  onChangeText={setPassword}
                  value={password}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="#002f6c"
                  onSubmitEditing={Keyboard.dismiss}
                  clearButtonMode="always"
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => signIn({ username, password })}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.TextCont}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Reset Password",
                    "Harap menghubungi Admin kami melalui WhatsApp",
                    [
                      { text: "CANCEL", style: "cancel" },
                      {
                        text: "HUBUNGI",
                        onPress: () => {
                          Linking.openURL(
                            "https://api.whatsapp.com/send?phone=6281932707598"
                          );
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.Forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

LoginScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  TextCont: {
    flexDirection: "row",
    marginTop: 30
  },
  Forgot: {
    color: "#051431",
    fontSize: 16,
    fontWeight: "500"
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#032263",
    width: 300,
    maxWidth: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#032263",
    paddingTop: 20
  },
  button: {
    width: 250,
    backgroundColor: "#051431",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12,
    marginBottom: 20,
    marginTop: 30
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center"
  }
});

export default LoginScreen;
