import Firebase, { db } from 'src/utils/firebase'
import axios from 'axios'

export const RESET = 'RESET';

export const SET_RESTAURANT = 'SET_RESTAURANT';

export const fetchUserRestaurant = (userId) => {
  return async dispatch => {
    db.collection('restaurants').where("staffIds", "array-contains", userId).get()
      .then((querySnapshot) => {
        const restaurants = querySnapshot.docs
        if (restaurants.length > 0) {
          return { id: restaurants[0].id, ...restaurants[0].data() }
        }
      }).then(data => {
        //get Google Data
        return getGoogleData(data.google_id).then(googleData => {
          return { restaurant: {...data, ...googleData }}
        })
      }).then(data => {
        //Get Orders
        return getOrders(data.restaurant.id).then(orders => {
          return { ...data, ...orders}
        })
      }).then(data => {
        dispatch({
          type: SET_RESTAURANT, ...data})
      })
      .catch(e => {
        console.log('Restaurant not Found - User is not a manager')
      })
  }
};

const getGoogleData = (googleId) => {
  //Get Data From Google For Each Restaurant
  params = {
    place_id: googleId,
    fields: "name,rating,formatted_phone_number,opening_hours,vicinity",
    key: 'null',
  }
  return axios.get('https://maps.googleapis.com/maps/api/place/details/json', { params }).then(response => {
    return { googlePlacesData: response.data.result }
  }).catch(e => {
    console.log('No google data found')
    return { }
  })
}

const getOrders = (restaurantId) => {
  return db.collection('bookingOrders')
  .where('restaurantId', '==', restaurantId)
  .where('order', '==', true).get()
  .then((querySnapshot) => {
    const ordersArray = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    return { restaurantOrders: ordersArray }
  }).catch(e => {
    console.log('No Orders found')
    return {}
  })
}

export const UPDATE_RESTAURANT = "UPDATE_RESTAURANT"

export const updateRestaurant = (restaurantId, saveRestaurant) => {
  return dispatch => {
    const newRestaurantValues = {
      id: saveRestaurant.id,
      name: saveRestaurant.name,
      type: saveRestaurant.type,
      description: saveRestaurant.description,
      imageUrl: saveRestaurant.imageUrl,
      google_id: saveRestaurant.google_id
    }
    db.collection('restaurants').doc(restaurantId).update(newRestaurantValues).then(() => {
      dispatch({ type: UPDATE_RESTAURANT, newRestaurantValues: newRestaurantValues })
      console.log('Restaurant Updated!');
    }).catch(e => {
      console.log('Restaurant Failed to Update!');
      console.log(e)
    })
  }
}


export const ACCEPT_ORDER = "ACCEPT_ORDER"

export const acceptOrder = (orderId) => {
  return async (dispatch) => {
    console.log(orderId)
    return db.doc(`bookingOrders/${orderId}`).update({orderStatus: 'accepted'}).then(() => {
      dispatch({ type: ACCEPT_ORDER, orderId: orderId })
    }).catch(e => {
      console.log(e)
      console.log('Error updating Order')
    })
  }
};

export const DONE_ORDER = "DONE_ORDER"

export const doneOrder = (orderId) => {
  return async (dispatch) => {
    return db.doc(`bookingOrders/${orderId}`).update({orderStatus: 'done'}).then(() => {
      // Rewards Funstion
      dispatch({ type: DONE_ORDER, orderId: orderId })
    }).catch(e => {
      console.log(e)
      console.log('Error updating Order')
    })
  }
};


export const FETCH_ORDER_BY_RESTAURANT_FILTERED =
  'FETCH_ORDER_BY_RESTAURANT_FILTERED';


export const fetchOrderByRestaurant = (restaurantId) => {
  return async (dispatch) => {
    getOrders(restaurantId).then(data => {
      dispatch({ type: FETCH_ORDER_BY_RESTAURANT_FILTERED, payload: data });
    }).catch(console.log)
  }
}


export const FETCH_BOOKINGS_BY_RESTAURANT_FILTERED =
  'FETCH_BOOKINGS_BY_RESTAURANT_FILTERED';

export const FETCH_BOOKINGS_BY_RESTAURANT = 'FETCH_BOOKINGS_BY_RESTAURANT';

export const fetchBookingsByRestaurant = (restaurantId) => {
  return async (dispatch) => {
    db.collection('bookingOrders')
      .where('restaurantId', '==', restaurantId)
      .where('booking', '==', true)
      .get()
      .then((querySnapshot) => {
        const response = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        dispatch({ type: FETCH_BOOKINGS_BY_RESTAURANT, payload: response });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
