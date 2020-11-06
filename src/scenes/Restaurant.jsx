import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';
import { StyleSheet, Button, Text, View } from "react-native";

navigateBack = () => {
  this.navigation.goBack();
};

BackAction = () => (
  <TopNavigationAction icon={BackIcon} onPress={this.navigateBack} />
);

const Restaurant = ({navigation}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text>Loading...</Text>
        </View>
        <View>
          <Navbar selectedIndex={2} navigation={navigation} />
        </View>
      </SafeAreaView>
  );
}

export default Restaurant;