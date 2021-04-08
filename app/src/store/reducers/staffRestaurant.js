// import { MEALS } from ../

import {
  SET_RESTAURANT,
  UPDATE_RESTAURANT,
  RESET,
  ACCEPT_ORDER,
  DONE_ORDER,
  FETCH_BOOKINGS_BY_RESTAURANT_FILTERED,
  FETCH_BOOKINGS_BY_RESTAURANT,
  FETCH_ORDER_BY_RESTAURANT_FILTERED,
} from '@/store/actions/staffRestaurant';

const initialState = {
  restaurant: null,
  restaurantOrders: [],
  restaurantBookings: []
};

const findOrder = (orders, orderId) => {
  let index = -1
  orders.forEach((order, i) => {
    if (order.id == orderId) {
      index = i
      return i
    }
  });
  return index
}

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    //Filters restaurant by name
    case SET_RESTAURANT:
      return {
        ...state,
        restaurant: action.restaurant,
        restaurantOrders: action.restaurantOrders,
      };
    case UPDATE_RESTAURANT:
      return {
        ...state,
        restaurant: { ...state.restaurant, ...action.newRestaurantValues },
      };
    case ACCEPT_ORDER:
      //Get cart without the item about to be added.
      let newOrders = [...state.restaurantOrders]

      let index = findOrder(newOrders, action.orderId)

      newOrders[index]['orderStatus'] = 'accepted'
      console.log(newOrders[index])
      return { ...state, restaurantOrders: newOrders };
    case DONE_ORDER:
      //Get cart without the item about to be added.

      let newOrderss = [...state.restaurantOrders]

      let indexx = findOrder(newOrderss, action.orderId)
     
      newOrderss[indexx]['orderStatus'] = 'done'
      console.log(newOrderss[indexx])
      return { ...state, restaurantOrders: newOrderss };
    case RESET:
      return initialState;
    case FETCH_BOOKINGS_BY_RESTAURANT: {
      const now = new Date();
      action.payload.forEach((element) => {
        if (!element.cart && element.date && now.getTime() > element.date.toDate().getTime() && element.status === 'Ok') {
          //dispatch(postBookingExpiration(element.id));
          element.status = 'Expired';
        }
      });
      return {
        ...state,
        restaurantBookings: action.payload,
      }
    }
    case FETCH_BOOKINGS_BY_RESTAURANT_FILTERED: {
      return {
        ...state,
        restaurantBookings: action.payload,
      }
    }
    case FETCH_ORDER_BY_RESTAURANT_FILTERED: {
      return {
        ...state,
        restaurantOrders: action.payload.restaurantOrders,
      }
    }
    default:
      return state;
  }
};


export default restaurantReducer;
