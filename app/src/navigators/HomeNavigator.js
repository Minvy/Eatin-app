
import React from 'react'

import RewardScreen from 'src/scenes/rewards/RewardScreen'
import HomeScreen from 'src/scenes/HomeScreen'
import RestaurantAddScreen from 'src/scenes/restaurants/RestaurantAddScreen';
import ManagerRewardScreen from 'src/scenes/rewards/ManagerRewardScreen';

import AddTableScreen from 'src/scenes/bookings/AddTableScreen';

import { createStackNavigator } from '@react-navigation/stack';

const HomeStackNavigator = createStackNavigator();

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? 'black' : ''
  },
  // headerTitleStyle: {
  //   fontFamily: 'open-sans-bold'
  // },
  // headerBackTitleStyle: {
  //   fontFamily: 'open-sans'
  // },
  headerTintColor: Platform.OS === 'android' ? 'white' : 'black'
};

const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator
    //change to rewards for editing
      initialRouteName="Home"
   //   initialRouteName="AddTableScreen"
      screenOptions={defaultNavOptions}>
      <HomeStackNavigator.Screen
        name="AddTableScreen"
        component={AddTableScreen}
        // options={authScreenOptions}
      />
      <HomeStackNavigator.Screen
        name="Rewards"
        component={RewardScreen}
        // options={authScreenOptions}
      />
      <HomeStackNavigator.Screen
        name="ManagerRewards"
        component={ManagerRewardScreen}
      />
      
    </HomeStackNavigator.Navigator>
  );
};

export default HomeNavigator;
