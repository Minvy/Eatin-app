import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

// import 
import RestaurantScreen from 'src/scenes/RestaurantScreen'
import OrdersScreen from 'src/scenes/manager/OrdersScreen'
import ReservationsScreen from 'src/scenes/manager/ReservationsScreen';
import AuthNavigator from 'src/navigators/AuthNavigator';

const Tab = createBottomTabNavigator();

const ManagerTabNavigator = (props) => {
  //Hide tab navigation is outside products page
  const getTabBarVisible = (route, routeName) => {
    if (getFocusedRouteNameFromRoute(route) === routeName) {
      return true;
    }
    return false;
  }

  return (
    <Tab.Navigator tabBar={props => <Navbar {...props} />}>
      <Tab.Screen name='Restaurant' component={RestaurantScreen}/>
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name='Reservations' component={ReservationsScreen}/>
      <Tab.Screen name="User" component={AuthNavigator} />
    </Tab.Navigator>
  );
}


const Navbar = ({ navigation, state }) => {
  return (
    <View>
      <React.Fragment>
        <BottomNavigation 
            selectedIndex={state.index}
            onSelect={index => navigation.navigate(state.routeNames[index])}>
          <BottomNavigationTab 
            icon={(e) => (<Icon {...e} name='home-outline' />)} 
            title="Restaurant" />
          <BottomNavigationTab 
            icon={(e) => (<Icon {...e} name='shopping-cart-outline' />)} 
            title="Orders" />
          <BottomNavigationTab 
            icon={(e) => (<Icon {...e} name='clipboard-outline' />)} 
            title="Reservations" />
          <BottomNavigationTab 
            icon={(e) => (<Icon {...e} name='person-outline' />)}
            title="User" />
        </BottomNavigation>
      </React.Fragment>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'relative',
    bottom: 0,
    left: 0
  },
});


export default ManagerTabNavigator