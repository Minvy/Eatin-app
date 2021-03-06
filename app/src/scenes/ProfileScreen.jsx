import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";
import { logout } from "@/store/actions/auth";
import { Avatar } from "react-native-elements";

const ProfileScreen = (props) => {
  const dispatch = useDispatch();

  const restaurant = useSelector((state) => state.staffRestaurant.restaurant);
  const auth = useSelector((state) => state.auth);

  const [list, setList] = useState([]);

  const handleResetPassword = () => {};

  const handleChangeUserSettings = () => {
    props.navigation.navigate("Change User Settings");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navAddTableScreen = () => {
    props.navigation.navigate("Add Table");
  };

  const isManager = !!restaurant;

  if (isManager) {
    const onEditRestaurant = () =>
      props.navigation.navigate("Edit Restaurant", {
        restaurantId: restaurant.id,
      });

    const onMenuList = () =>
      props.navigation.navigate("Edit Menu", {
        restaurantId: restaurant.id,
      });

    const managerList = [
      {
        icon: "award",
        name: "Create Rewards",
        onPress: () => props.navigation.navigate("Create Rewards"),
      },
      { icon: "cog", name: "Edit Restaurant", onPress: onEditRestaurant },
      { icon: "cog", name: "Edit Menu", onPress: onMenuList },
      {
        icon: "cog",
        name: "Change User Settings",
        onPress: handleChangeUserSettings,
      },
      { icon: "cog", name: "Manage tables", onPress: navAddTableScreen },
      { icon: "sign-out-alt", name: "Sign Out", onPress: handleLogout },
    ];
    useEffect(() => {
      setList(managerList);
    }, []);
  } else {
    const userList = [
      {
        icon: "award",
        name: "Rewards",
        onPress: () => props.navigation.navigate("Rewards"),
      },
      {
        icon: "award",
        name: "Redeem Rewards",
        onPress: () => props.navigation.navigate("Redeem Rewards"),
      },
      {
        icon: "cog",
        name: "Change User Settings",
        onPress: handleChangeUserSettings,
      },
      { icon: "sign-out-alt", name: "Sign Out", onPress: handleLogout },
    ];
    useEffect(() => {
      setList(userList);
    }, []);
  }

  const test = () => {
    db.collection("restaurants")
      .where("staffIds", "array-contains", auth.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      });

    // console.log(auth.uid)
    // .get().then(e => {
    //   console.log(e)
    // }).catch(console.warn)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userCard}>
        <Avatar
          size="large"
          rounded
          source={{
            uri:
              "https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg",
          }}
        />
        <View style={styles.nameBox}>
          <Text style={styles.userNameText}>{auth.name}</Text>

          {/* <Text style={styles.tenantText}>{auth.uid}</Text> */}
        </View>
      </View>
      <FlatList
        style={styles.list}
        data={list}
        renderItem={(entry) => (
          <TouchableOpacity
            style={styles.listEntry}
            onPress={entry.item.onPress}
          >
            <Icon
              style={styles.icon}
              name={entry.item.icon}
              size={30}
              color="#000000"
            />
            <Text style={styles.nameText}>{entry.item.name}</Text>
            <Text style={styles.descriptionText}>
              {" "}
              {entry.item.description}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#C4C4C4",
    padding: 20,
    paddingLeft: 30,
    height: 120,
    alignItems: "center",
  },
  nameBox: {
    paddingLeft: 20,
  },
  userNameText: {
    fontSize: 18,
    flexShrink: 1,
  },
  tenantText: {
    fontWeight: "bold",

    fontSize: 18,
  },

  //Settings Entry
  list: {
    backgroundColor: "white",
    flex: 1,
  },
  listEntry: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    flex: 1,
    borderBottomColor: "#C4C4C4",
    borderBottomWidth: 2,
  },
  icon: {
    paddingLeft: 15,
  },
  nameText: {
    fontWeight: "bold",
    paddingLeft: 15,
    fontSize: 18,
  },
  descriptionText: {
    paddingLeft: 18,
  },
});

export default ProfileScreen;
