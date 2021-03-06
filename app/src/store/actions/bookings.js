import firebase from 'src/utils/firebase';
import { useSelector, useDispatch } from 'react-redux';

const FETCH_TABLES = 'FETCH_TABLES';
const FETCH_TABLES_BY_SIZE = 'FETCH_TABLES_BY_SIZE';
const FETCH_BOOKINGS_BY_SIZE = 'FETCH_BOOKINGS_BY_SIZE';
const ADD_TABLE = 'ADD_TABLE';
const ADD_TIME = 'ADD_TIME';
const PERFORM_SCHEDULE = 'PERFORM_SCHEDULE';
const POST_TABLE = 'POST_TABLE';
const CLEAR_TIME = 'CLEAR_TIME';
const POST_RESERVATION_CANCELATION = 'POST_RESERVATION_CANCELATION';
const EXTEND_BOOKING = 'EXTEND_BOOKING';

const POST_BOOKING_EXPIRATION = 'POST_BOOKING_EXPIRATION';
const CLEAR_TABLES = 'CLEAR_TABLES';
const REMOVE_TABLE = 'REMOVE_TABLE';
const REMOVE_TABLE_FROM_DATABASE = 'REMOVE_TABLE_FROM_DATABASE';
const UNAVAILABLE_TABLES = 'UNAVAILABLE_TABLES';
const POST_BOOKING = 'POST_BOOKING';

//Internal actions (not involving the firestore databse)
//
//


export const clearTime = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: CLEAR_TIME, payload: true });
    } catch (error) {
      console.error(error);
    }
  };
};

export const clearTables = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: CLEAR_TABLES, payload: true });
    } catch (error) {
      console.error(error);
    }
  };
};

export const addTable = (table) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_TABLE, payload: table });
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeTable = (table) => {
  return async (dispatch) => {
    try {
      dispatch({ type: REMOVE_TABLE, payload: table });
    } catch (error) {
      console.error(error);
    }
  };
};

export const addTime = (start, end) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_TIME, payload: { start, end } });
    } catch (error) {
      console.error(error);
    }
  };
};

export const performSchedule = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: PERFORM_SCHEDULE, payload: true });
    } catch (error) {
      console.error(error);
    }
  };
};

//External fetching actions (involving the firestore database but not affecting it)
//
//

export const extendBooking = (booking) => {

  const tableReference = booking.details.tableref;
  const bookingDate = booking.details.date;
  const id = booking.details.id;
  const bookingDatePlusHours = new Date(bookingDate.toDate().getTime() + 3600 * 1000 * 6);


  return async (dispatch) => {
    try {
      firebase.firestore().collection('bookingOrders').where('tableref', '==', tableReference).where('date', '>', bookingDate).where('date', '<', bookingDatePlusHours).get().then((querySnapshot) => {
        const response = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        //If i find a booking that clashes with extra time, I dont extend
        if (response.length > 0) {
          dispatch({ type: EXTEND_BOOKING, payload: true });
        } else {
          dispatch({ type: EXTEND_BOOKING, payload: false });
        }
      });

    } catch (error) {
      console.error(error);
    }
  };
};

export const checkTableAvailability = (size, restaurantId, date) => {
  return (dispatch) => {

    const unconfirmedBookingTimestampStart = date.getTime();
    const unconfirmedBookingTimestampEnd = date.getTime() + 4 * (1000 * 3600);

    console.log(new Date(unconfirmedBookingTimestampStart))
    console.log(new Date(unconfirmedBookingTimestampEnd))

    //Gets all tables of eligble size
    firebase.firestore().collection('reservations').where('restaurantId', '==', restaurantId).where('size', '>=', parseInt(size)).where('active', '==', true).get().then((querySnapshot) => {
      const tableResponse = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      let promiseArr = tableResponse.map(table => {
        //TODO: Add fetch booking on picked date
        return firebase.firestore().collection('bookingOrders').where('tableref', '==', table.id).where('status', '==', 'Ok').get().then((querySnapshot) => {
          const bookingResponse = querySnapshot.docs.map((doc) => {
            return { date: doc.data().date, tableref: table.id };
          });

          //returns an array of unavailable tables 
          let bookedArray = bookingResponse.map((booking) => {
            const dateConv = booking.date.toDate();
            if (dateConv.getFullYear() === date.getFullYear() && dateConv.getMonth() === date.getMonth() && dateConv.getDate() === date.getDate()
            ) {

              const bookingTimestampStart = dateConv.getTime();
              const bookingTimestampEnd = dateConv.getTime() + 4 * (1000 * 3600);

              //(StartA <= EndB) and (EndA >= StartB)
              if (bookingTimestampStart <= unconfirmedBookingTimestampEnd && bookingTimestampEnd > unconfirmedBookingTimestampStart) {
                return booking.tableref;
              } else {
                return false;
              }
            } else {
              return false
            }
          });
          return bookedArray
        }).catch(console.log);
      });
      //Resolves and Checks if there was any problem with executiong returns results.
      return Promise.all(promiseArr)
    })
      .then(tablesBookedArray => {
        let tablesBooked = tablesBookedArray.flat().filter(table => table != false)
        console.log(tablesBooked)
        // console.log(resultsArray)
        dispatch({ type: UNAVAILABLE_TABLES, payload: tablesBooked });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};



export const fetchTables = (restaurantId) => {
  return async (dispatch) => {
    firebase
      .firestore()
      .collection('reservations')
      .where('restaurantId', '==', restaurantId)
      .get()
      .then((querySnapshot) => {
        const response = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        dispatch({ type: FETCH_TABLES, payload: response });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export const fetchTablesBySize = (size, restaurantId) => {
  return async (dispatch) => {
    firebase
      .firestore()
      .collection('reservations')
      .where('restaurantId', '==', restaurantId)
      .where('size', '>=', parseInt(size))
      .where('active', '==', true)
      .get()
      .then((querySnapshot) => {
        const response = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        dispatch({ type: FETCH_TABLES_BY_SIZE, payload: response });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export const fetchBookingsBySize = (size, restaurantId) => {
  const now = new Date();
  return async (dispatch) => {
    firebase
      .firestore()
      .collection('bookingOrders')
      .where('guests', '==', size)
      .where('restaurantId', '==', restaurantId)
      .where('date', '>', now)
      .get()
      .then((querySnapshot) => {
        const response = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        dispatch({ type: FETCH_BOOKINGS_BY_SIZE, payload: response });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};



//External posting actions (involving the firestore database and changing it)
//
//
export const postTable = (restaurantId, table) => {
  return async (dispatch) => {
    table.restaurantId = restaurantId;
    table.active = false;
    try {
      const res = await firebase.firestore().collection('reservations').add({
        size: table.size,
        number: table.number,
        attributeIndexes: table.attributeIndexes,
        restaurantId: restaurantId,
        active: false,
      }).then((docRef) => {
        table.id = docRef.id
      });
      dispatch(addTable(table));
      dispatch({ type: POST_TABLE, payload: undefined });
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeTableFromDatabase = (tableid) => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .firestore()
        .collection('reservations')
        .doc(tableid)
        .delete();
      dispatch({ type: REMOVE_TABLE_FROM_DATABASE, payload: undefined });
    } catch (error) {
      console.error(error);
    }
  };
};

export const extendReservation = (id) => {
  return async (dispatch) => {
    try {
      const res = await firebase.firestore().collection('bookingOrders').doc(id).update({
        status: 'Extended',
      });
      dispatch({ type: POST_BOOKING, payload: undefined });
    } catch (error) {
      console.error(error);
    }
  };
};

export const postReservation = (tableid, restaurantId, userId, guests, date, restaurantName, tableNum) => {
  return async (dispatch) => {
    try {
      const res = await firebase.firestore().collection('bookingOrders').add({
        booking: true,
        userId: userId,
        date: date,
        status: 'Ok',
        tableref: tableid,
        guests: guests,
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        tableNumber: tableNum,
        createdAt: new Date()
      });
      dispatch({ type: POST_BOOKING, payload: res.id });
    } catch (error) {
      console.error(error);
    }
  };
};

export const postReservationCancelation = (bookingId) => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .firestore()
        .collection('bookingOrders')
        .doc(bookingId)
        .update({
          status: 'Cancelled',
        });
      dispatch({ type: POST_RESERVATION_CANCELATION, payload: undefined });
    } catch (error) {
      console.error(error);
    }
  };
};

export const postBookingExpiration = (bookingId) => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .firestore()
        .collection('bookingOrders')
        .doc(bookingId)
        .update({
          status: 'expired',
        });
      dispatch({ type: POST_BOOKING_EXPIRATION, payload: undefined });
    } catch (error) {
      console.error(error);
    }
  };
}

export const postActivatedTables = (restId, tables) => {
  return async (dispatch) => {
    try {
      const response = await firebase
        .firestore()
        .collection('reservations')
        .where('restaurantId', '==', restId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async function (doc) {
            const query = await firebase
              .firestore()
              .collection('reservations')
              .doc(doc.id)
              .update({
                active: false,
              });
          });
        });

      tables.forEach(async function (element) {
        const res = await firebase
          .firestore()
          .collection('reservations')
          .doc(element.id)
          .update({
            active: true,
          });
      });
    } catch (error) {
      console.error(error);
    }

    dispatch({ type: POST_BOOKING_EXPIRATION, payload: undefined });
  };
};