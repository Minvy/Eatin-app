import React, { useState } from 'react';
import { Toggle, Text, Divider, Button, Spinner, Layout, Icon } from '@ui-kitten/components';
import { StyleSheet, View, FlatList, ImageBackground } from 'react-native'

const BookingsListEntry = ({ item }) => {
  const entry = item.element;

  const isManager = item.isManager
  // Checking  if entry has a booking
  let haveBooking = entry.date ? true : false
  let haveOrder = entry.cart ? true : false


  const checkExtendable = () => {
    if (entry.status === "Ok") {
      const now = new Date().getTime();
      if (entry.date.toDate().getTime() < now) {
        return true;
      }
      if (now + 2 * (3600 * 1000) >= entry.date.toDate().getTime() + (3600 * 1000 * 4)) {
        return false;
      }
    }
    return true;
  }

  const acceptOrder = () => {

  }

  const isCancelled = (entry.status == 'Cancelled') || (entry.orderStatus == 'Cancelled')

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const constructDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  const constructTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const time = `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`
    return time;
  }

  const image = {};

  // if (new Date(item.date).getHours() > 17) {
  image.uri = "https://www.denverpost.com/wp-content/uploads/2016/04/20150209__20150211_C1_FE11FDROMANCEp2.jpg?w=620"
  // } else {
  //   image.uri = "https://images.unsplash.com/photo-1570894322743-aefb6905a4b5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGluaW5nJTIwdGFibGVzfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80"
  // }

  const BookingHeader = () => {
    return (
      <>
        <View style={styles.headerTextContainer}>
          <Text category='h3' style={styles.headerTitle}>{entry.restaurantName}</Text>
          <Text category='p1' style={styles.headerSubTitle}>{constructDate(entry.date.seconds)}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text category='h3' style={styles.headerTitle} >Table number: {entry.tableNumber}</Text>
          <Text category='p1' style={styles.headerSubTitle}>
            Status: {capitalize(entry.status)}
          </Text>
        </View>
      </>
    )
  }

  const BookingContent = () => {
    if (haveBooking) {
      return (
        <>
          <Divider />
          <Text style={styles.typeTitle}>{"Booking"}</Text>
          <Divider />
          <View style={{ flexDirection: 'row', margin: 5 }}>
            <Text category='p1' style={{ flex: 1, textAlign: 'center', fontWeight: "bold" }}>Guests: {entry.guests}</Text>
            <Text category='p1' style={{ flex: 1, textAlign: 'center', fontWeight: "bold" }}>Time: {constructTime(entry.date.seconds)}</Text>
          </View>
        </>
      )
    }
  }

  const OrderHeader = () => {
    return (
      <>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{entry.restaurantName}</Text>
          <Text style={styles.headerSubTitle}>ASAP</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text category='h3' style={styles.headerTitle} >
            {/* Table number: {entry.tableNumber} */}
          </Text>
          <Text style={styles.headerSubTitle}>
            Status:
            {entry.orderStatus ? capitalize(entry.orderStatus) : null}
          </Text>
        </View>
      </>
    )
  }

  const calculateTotal = () => {
    let total = 0
    entry.cart.forEach(item => {
      total = total + (item.item.price * item.quantity)
    });
    return total
  }

  const OrderContent = () => {
    if (haveOrder) {
      return (
        <>
          <Divider />
          <Text style={styles.typeTitle}>{"Order"}</Text>
          <Divider />
          <FlatList
            data={entry.cart}
            // keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignContent: 'space-between', margin: 5 }}>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: "bold" }}>{item.item.name}</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: "bold" }}>£{item.item.price}</Text>
              </View>
            )}
          />
          <View style={{ flexDirection: 'row', alignContent: 'space-between', margin: 5 }}>
            <Text style={{ flex: 1, textAlign: 'center', fontWeight: "bold" }}>Total: £{calculateTotal()}</Text>
          </View>
        </>
      )
    }
  }

  return (
    <View style={styles.listEntryContainer}>
      {/* Header */}
      <ImageBackground source={image} style={styles.headerImg}>
        {/* <View style={styles.headerContainer}> */}
        {haveBooking && BookingHeader() || OrderHeader()}
      </ImageBackground>
      {/*Content */}
      <View style={styles.listContentContainer, (isCancelled ? styles.listEntryCanceled : {})}>
        {BookingContent()}
        {OrderContent()}
      </View>
      {/* Buutons */}
      <View style={styles.buttonContainer}>
        {entry.orderStatus != 'done' && (
          <Button style={styles.button} size='medium' status='basic' disabled={isCancelled} onPress={() => { item.onCancel(entry.id) }}>
            Cancel
          </Button>) || null}
        {haveOrder && entry.orderStatus == 'pending' && isManager && (
          <Button style={styles.button} size='medium' status='basic' onPress={() => { item.acceptOrder(entry.id) }}>
            Accept Order
          </Button>) || null}
        {haveOrder && entry.orderStatus == 'accepted' && isManager && (
          <Button style={styles.button} size='medium' status='basic' onPress={() => { item.doneOrder(entry.id) }}>
            Done
          </Button>) || null}
        {haveBooking && !isManager && (
          <Button style={styles.button} size='medium' status='basic' disabled={checkExtendable()} onPress={() => { item.onExtend(entry) }}>
            Extend Booking
          </Button>) || null}
        {/* {item.isManager && order && (
          <Button style={styles.button} size='medium' status='basic' onPress={() => item.onAccept}>
            Accept
          </Button>
        ) || null} */}
      </View>
    </View>
  );
}

export default BookingsListEntry

const styles = StyleSheet.create({
  typeTitle: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignContent: 'space-between'
  },
  icon: {
    margin: 5,
    width: 20,
    height: 20,
    alignItems: 'center'
  },
  container: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 5,
    alignSelf: "stretch",
  },
  listEntryCanceled: {
    backgroundColor: '#fbc3bc'
  },
  listEntryContainer: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 5
  },
  headerContainer: {
    height: 85,
    width: '100%',
  },
  headerImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  headerTitle: {
    alignSelf: 'flex-start',
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    margin: 5,
  },
  headerSubTitle: {
    alignSelf: 'flex-start',
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    margin: 5,
  },
  listContentContainer: {
    alignSelf: "stretch",
    backgroundColor: '#C4C4C4'
  },
  tableDetails: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: "bold",
  },
  orderPrice: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    padding: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    borderRadius: 0,
    borderLeftWidth: 1,
  }
});
