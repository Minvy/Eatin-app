
import React from 'react'

import LoginScreen from 'src/scenes/auth/LoginScreen'
import SignUpScreen from 'src/scenes/auth/SignUpScreen'
import ResetPasswordScreen from '@/scenes/auth/ChangePasswordScreen'
import { useSelector } from 'react-redux';
import SettingsNavigator from 'src/navigators/SettingsNavigator';

import { createStackNavigator } from '@react-navigation/stack';


const AuthStackNavigator = createStackNavigator();

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

const AuthSelector = () => {
  const isAuth = useSelector(state => !!state.auth.uid);
  
  return (
    <>
      {isAuth && <SettingsNavigator />}
      {!isAuth && <AuthNavigator />}
    </>
  )
}

const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        // options={authScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Sign Up"
        component={SignUpScreen}
        // options={authScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
        // options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthSelector;