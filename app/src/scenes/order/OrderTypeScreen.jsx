import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Input, Text, Button, Layout } from '@ui-kitten/components';
import Firebase from '@/utils/firebase'
import { useDispatch } from 'react-redux'
import { login } from '@/store/actions/auth'


const OrderTypeScreen = (props) => {

  const dispatch = useDispatch()

  const handleInRestaurant = () => {
    props.navigation.navigate('MenuScreen')
  }
  const handleTakeAway = () => {
    props.navigation.navigate('MenuScreen')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>CheckOut</Text>

        <Button onPress={handleInRestaurant}>
          Add Item to Cart
        </Button>
        <Button onPress={handleTakeAway}>
          Add Item to Cart
        </Button>
      </Layout>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})

export default OrderTypeScreen;
