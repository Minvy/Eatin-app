import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  View,
  StatusBar,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Button,
  Text,
  Avatar,
} from "@ui-kitten/components";

import firebase, { db, FieldValue } from "src/utils/firebase";

const RewardScreen = (props) => {
  //State holds points returned from firebase
  const [awardedPoints, setAwardedPoints] = useState(0);
  //Contains the user input code
  const [code, setCode] = useState("");
  //Contains the document name used to track and change field for the code
  const [document, setDocument] = useState("");

  const [pointsFromUser, setPointsFromUser] = useState(0);

  const [currentPoints, setCurrentPoints] = useState(0);

  //removes spaces from code, just in case it's copy & pasted
  const onTextChange = (code) => {
    var formatCode = code.replace(/\s/g, "");
    setCode(formatCode);
  };
  //Redux to get user
  const auth = useSelector((state) => state.auth);
  //Current users uid from user collection
  const uid = auth.uid;
  const name = auth.name;

  //The connection to the DB
  const rewards = db.collection("rewards");
  const user = db.collection("users");

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchPoints();
  }, [isFocused]);
  //Function loads user points on load
  function fetchPoints() {
    user
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          userPoints = doc.data().points ? doc.data().points : 0;
          setPointsFromUser(userPoints);
        });
      });
  }

  //Needs to search DB for Code. If the code is usd return invalid code message
  function redeemCode() {
    //Check if the code is in firebase
    rewards
      .where("code", "==", code)
      .where("codeUsed", "==", false)
      .get()
      .then((querySnapshot) => {
        const rewardsDocs = querySnapshot.docs;
        if (rewardsDocs.length > 0) {
          rewardsDocs.forEach((doc, index) => {
            //(If a record is returned) the index start at 0
            if (index == 0) {
              rewards
                .doc(doc.id)
                .update({
                  codeUsed: true,
                  customerId: uid,
                })
                .then(() => {
                  console.log("We got this far");
                  db.collection("users")
                    .doc(uid)
                    .update({
                      points: FieldValue.increment(doc.data().points),
                    });

                  fetchPoints();
                })
                .catch((error) => {
                  console.log("Error getting documents: ", error);
                });
            } else {
              console.log("Code not found");
            }
          });
        }
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          style={styles.userImage}
          source={{
            uri:
              "https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg",
          }}
        />
        <View>
          <Text style={styles.font}>{name}</Text>
        </View>
        <View style={styles.lineThrough} />
        <View>
          <Text style={styles.font}>Your Points:</Text>
          <Text style={styles.font}>{pointsFromUser}</Text>
          <Text style={styles.font}>Last input code:{code}</Text>
        </View>
      </View>

      <View>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: "80%",
            alignSelf: "center",
            alignContent: "center",
          }}
          value={code}
          //keyboardType="numeric"
          placeholder="Redeem code here"
          onChangeText={(code) => onTextChange(code)}
          maxLength={6}
        />
        <View>
          <Button
            style={styles.button}
            appearance="filled"
            onPress={redeemCode}
          >
            Redeem Points
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  userImage: {
    width: "40%",
    height: "60%",
    alignSelf: "center",
  },

  lineThrough: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingTop:'12%'
  },

  header: {
    alignContent: "center",
    backgroundColor: "green",
    // paddingTop:30,
  },

  font: {
    alignSelf: "center",
    fontSize: 18,
  },

  button: {
    margin: 2,
    width: "80%",
    alignSelf: "center",
  },

  inputButton: {
    margin: 2,
    borderRadius: 50,
    width: "80%",
    alignSelf: "center",
    height: "50%",
  },
});

export default RewardScreen;
