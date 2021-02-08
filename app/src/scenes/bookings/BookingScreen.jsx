import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput } from "react-native";
import { Divider, Icon, Button, Layout, Datepicker } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { fetchReservations, fetchAvailableTables, postRReservation } from '@/store/actions/bookings';
import firebase from 'src/utils/firebase';

const BookingScreen = (props) => {
  const store = useSelector(state => state.bookings.reservations);
  const dispatch = useDispatch()

  const [guests, setGuests] = React.useState();
  const [date, setDate] = React.useState();
  const [dateString, setDateString] = React.useState();
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(0);

  const user = firebase.auth().currentUser.uid;

  const restaurants = useSelector(state => state.restaurants.restaurants);
  const restId = props.route.params.restaurantId;
  const restaurant = restaurants.find(restaurant => restaurant.id === restId);

  const getDay = (date) => {
    return date.getDate();
  }

  const getMonth = (date) => {
    return date.getMonth() + 1;
  }

  const getYear = (date) => {
    return date.getFullYear();
  }

  const UnavailableTimes = () => {
    const newStore = store;
    const compArray = [];
    let count = 1;
    newStore.forEach((object) => {
      delete object.id;
    });

    const timePairs = Object.values(newStore);
    for (let j = 0; j < timePairs.length; j++) {
      compArray.push(<Text>{`*Table ${count++}`}</Text>)
      const keys = Object.keys(timePairs[j]);
      const values = Object.values(timePairs[j]);

      for (let i = 0; i < keys.length; i++) {
        compArray.push(<Text>{`${keys[i]} - ${values[i]}`}</Text>);
      }
    }

    return <>{compArray}</>
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Divider />
      <View style={{ flex: 1 }}>
        <View style={{ padding: '2%', alignItems: "center" }}>
          <Text> Restaurant Name: {restaurant.name}</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <DatePicker
            style={{ width: 200 }}
            date={dateString}
            mode="date"
            placeholder="Select a date"
            format="DD-MM-YYYY"
            minDate={new Date()}
            maxDate="2021-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(event, date) => {
              setDate(date);
              setDateString(`${getDay(date)}-${getMonth(date)}-${getYear(date)}`);
            }}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>Number of guests</Text>
          <TextInput
            style={styles.table}
            keyboardType='number-pad'
            textAlign="center"
            onChangeText={(value) => {
              setGuests(value);
            }}
            maxLength={2}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>Start (Military time)</Text>
          <TextInput
            style={styles.table}
            keyboardType='number-pad'
            textAlign="center"
            onChangeText={(value) => {
              setStart(value);
            }}
            maxLength={4}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>End (Military time)</Text>
          <TextInput
            style={styles.table}
            keyboardType='number-pad'
            textAlign="center"
            onChangeText={(value) => {
              setEnd(value);
            }}
            maxLength={4}
          />
        </View>

        <Divider />
        
        <View style={styles.times}>
          <Text style={{ justifyContent: 'center' }}>Hours reserved:</Text>
          {store.length !== 0 ?
            <UnavailableTimes />
            : undefined}
        </View>

        <View style={styles.submitButton}>
          <Button style={styles.button} onPress={() => {
            dispatch(fetchAvailableTables(guests, restId, getDay(date), getMonth(date), getYear(date), start, end));
          }}>Search</Button>
          <Button style={styles.button} onPress={() => {
            console.log('VIP')
          }}>Reserve</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginTop: 15
  },
  listRow: {
    flexDirection: 'row',
    marginTop: 15
  },
  button: {
    margin: 2.5
  },
  dateTime: {
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16
  },
  table: {
    height: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    width: '40%',
    fontSize: 16
  },
  sizeFont: {
    fontSize: 16
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2%',
  },
  times: {
    margin: '2.5%',
    padding: '2.5%',
    flex: 6,
    width: '95%',
    backgroundColor: '#C4C4C4',
    borderRadius:5
  }
});


export default BookingScreen;
