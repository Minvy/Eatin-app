import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Image, View, ImageBackground, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { Divider, Icon, Layout, Text, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
// import Navbar from '../../components/Navbar';
import Menu from '../components/Menu/Menu';
import StarRating from 'react-native-star-rating';
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from 'react-redux';
import { newOrder } from '@/store/actions/order'
import { fetchAllMenu } from '@/store/actions/menu';



const Restaurant = (props) => {
  const restaurantManager = useSelector(state => state.staffRestaurant.restaurant);
  let restaurant
  if (!!restaurantManager) {
    restaurant = restaurantManager
    //
  } else {
    //Handle selection from Restaurant List
    const restaurants = useSelector(state => state.restaurants.restaurants);
    const itemId = props.route.params.itemID;
    restaurant = restaurants.find(restaurant => restaurant.id === itemId);
  }


  // console.log(menu);
  // const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  const dispatch = useDispatch()


  const onBooking = () => props.navigation.navigate('Booking', {
    restaurantId: restaurant.id
  });

  const onPending = () => props.navigation.navigate('Bookings Pending', {
    restaurantId: restaurant.id
  });

  const onOrder = () => {
    dispatch(newOrder(restaurant.id));
    props.navigation.navigate('Order Type', {
      restaurantId: restaurant.id
    })
  };

  const auth = useSelector(state => state.auth);

  const onEditRestaurant = () => props.navigation.navigate('Edit Restaurant', {
    restaurantId: restaurant.id
  });

  const onMenuList = () => props.navigation.navigate('MenuList', {
    restaurantId: restaurant.id
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Divider />

      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1 }}>
          <View>
            <View style={styles.listRow}>
              <Image
                source={{ uri: restaurant?.imageUrl }}
                style={styles.bgImage}
              />
              <View style={styles.buttonSpacing}>
              <Text style={styles.titleText}>{restaurant.name}</Text>
              {restaurant.googleData?.rating && (
              <View style={styles.starrating}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={restaurant.googleData?.rating}
                  fullStarColor={'#c7c708'}
                  starSize={15}
                />
              </View> ) || null}
              <View style={styles.description}>
                <Text>{restaurant.description}</Text>
                <View style={styles.addressDetails}>
                <Text>{restaurant.googleData?.formatted_phone_number}</Text>
                <Text>{restaurant.googleData?.vicinity}</Text>
                </View>
              </View>
              <View style={styles.openHours}>
                <Text style={styles.font}>Opening hours:</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[0]}</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[1]}</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[2]}</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[3]}</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[4]}</Text>
              </View>
              <View>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[5]}</Text>
              </View>
              <View style={styles.openSpacing}>
                <Text>{restaurant.googleData?.opening_hours.weekday_text[6]}</Text>
              </View>
              {  !restaurantManager && (
                <>
                  <View style={styles.buttonSpacing}>
                  <Button onPress={onBooking}>Make A Booking</Button>
                  </View>
                  <View style={styles.buttonSpacing}>
                  <Button onPress={onOrder}>Order</Button>
                  </View>
                </>) || null}
              <View style={styles.menu}>
                <Menu navigation={props.navigation}
                  restaurantId={restaurant.id} />
              </View>
            </View>
            </View>
          </View>
          {/* <Divider />
          <Button onPress={onMenuList}>Menu List</Button> */}
          <Divider />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalList: {
    maxHeight: '90%',
    marginBottom: 20,
  },
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },

  font: {
    fontWeight: 'bold',
    marginTop: 10
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 1
  },
  button: {
    marginTop: 10,
    marginBottom: 15
  },

  header: {
    marginTop: 25,
    flex: 1
  },
  bgImage: {
    width: '100%',
    height: 180,
    paddingTop: 10
  },
  listRow: {
    flexDirection: 'column'
  },
  starrating: {
    paddingTop: 10,
    position: 'absolute',
    alignSelf: 'flex-end'
  },
  menu: {
    paddingTop: 15,
    paddingBottom: 20
  },
  openHours: {
    marginTop: 10
  },
  description: {
    flexDirection: 'column',
    marginTop: 5
  },
  addressDetails: {
    marginTop: 5
  },
  buttonSpacing: {
    marginTop: 15,
    width: '95%',
    alignSelf: 'center'
  },
  openSpacing: {
    marginBottom: 20
  }

});

Restaurant.defaultProps = {
  name: 'Default Name'
};

export default Restaurant;
