
import React from 'react'

import ProfileScreen from 'src/scenes/ProfileScreen'
import RestaurantAddScreen from 'src/scenes/restaurants/RestaurantAddScreen';

import { createStackNavigator } from '@react-navigation/stack';

const ProfileStackNavigator = createStackNavigator();

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

const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        // options={authScreenOptions}
      />
      <ProfileStackNavigator.Screen
        name='Add Restaurant'
        component={RestaurantAddScreen}
        // options={authScreenOptions}
      />
    </ProfileStackNavigator.Navigator>
  );
};

export default ProfileNavigator;
