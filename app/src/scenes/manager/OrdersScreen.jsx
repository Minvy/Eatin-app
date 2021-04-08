import React, {useState, useEffect} from 'react';
import { Input, Text, Button, Layout } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { acceptOrder, doneOrder } from '@/store/actions/staffRestaurant'
import LoginRequired from '@/components/LoginRequired'
import { StyleSheet, View, FlatList, ImageBackground } from 'react-native'
import BookingOrderEntry from '@/components/BookingOrderEntry'
import { fetchOrderByRestaurant } from '@/store/actions/staffRestaurant'
import Loading from '@/components/Loading'
import { useIsFocused } from '@react-navigation/native'


const OrderScreen = (props) => {
  const restaurantss = useSelector(state => state.staffRestaurant);

  const restaurant = useSelector(state => state.staffRestaurant.restaurant);
  const restaurantOrders = useSelector(state => state.staffRestaurant.restaurantOrders);
  const isFocused = useIsFocused()

  const dispatch = useDispatch();
  const [showLoadingSpinner, setshowLoadingSpinner] = useState(true);

  const onAcceptOrder = (orderId) => {
    dispatch(acceptOrder(orderId))
  }

  const onDoneOrder = (orderId) => {
    dispatch(doneOrder(orderId))
  }

  useEffect(() => {
    setshowLoadingSpinner(true);
    dispatch(fetchOrderByRestaurant(restaurant.id));
    setTimeout(() => {
      setshowLoadingSpinner(false);
    }, 2000);
  }, [isFocused]);

  const mappedData = restaurantOrders.map((order) => {
    return ({ element: order, 
      isManager: !!restaurant, 
      acceptOrder: onAcceptOrder,
      doneOrder: onDoneOrder
    })
  })
    
  const List = () => {
      return (
        <FlatList
        data={mappedData}
        renderItem={BookingOrderEntry}
        keyExtractor={(item) => item.element.id}
      />  
      )
  }

  if (!restaurant) {
    return (
      <LoginRequired />
    )
  } else if (showLoadingSpinner) {
    return (
      <Loading visible={showLoadingSpinner}/>
    )
  } else {
    return (
      <Layout style={styles.container}>
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
