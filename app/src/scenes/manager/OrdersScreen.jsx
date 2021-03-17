import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Input, Text, Button, Layout } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/actions/auth'
import LoginRequired from '@/components/LoginRequired'

const OrderScreen = (props) => {
  const restaurant = useSelector(state => state.staffRestaurant.restaurant);
  const restaurantOrders = useSelector(state => state.staffRestaurant.restaurantOrders);

  const LoadingScreen = () => {
    if (showLoadingSpinner) {
      return (
        <View style={styles.datePicker}>
          <Spinner />
        </View>
      );
    } else {
      return (<></>)
    }
  }

  if (!!restaurant) {
    return (
      <LoginRequired />
    )
  } else if (showLoadingSpinner) {
    return (
      <LoadingScreen />
    )
  } else {
    return (
      <Layout style={styles.container}>
        <ToggleFilter />
        <List />
      </Layout>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
    marginLeft: '3%',
    marginRight: '3%',
    marginBottom: '3%',
    marginTop: '8%',
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
  },
  datePicker: {
    marginTop: '1%',
    marginBottom: '1%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginBottom: '1%',
    marginTop: '1%',
  },
  toggleElement: {
    paddingLeft: 5,
    flex: 1,
    textAlign: "center",
  },
  icon: {
    width: 24,
    height: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});


export default OrderScreen;
