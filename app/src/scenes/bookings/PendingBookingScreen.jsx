import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Card, Modal, Toggle, Text, TopNavigation, TopNavigationAction, Divider, Icon } from '@ui-kitten/components';
import ConfirmBookingsList from '@/scenes/bookings/components/ConfirmBookingList';
import { fetchAllBookings } from '@/store/actions/bookings'
import { useSelector, useDispatch } from 'react-redux';

export default PendingBookingScreen = (props) => {
    const [checked, setChecked] = React.useState(false);

    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
    };
    
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    dispatch(fetchAllBookings(auth.uid));

    //Screen render code
    return (
        <View style={{ flex: 1 }}>
            <Divider />
            <View style={styles.toggleContainer}>
                <Toggle style={styles.toggleElement} checked={checked} onChange={onCheckedChange}>
                    Display expired?
                </Toggle>
            </View>
            <ConfirmBookingsList restId={props.route.params.restaurantId}/>
        </View>
    );
};


//Get dimensions of screen
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        maxHeight: "100%",
    },
    listEntry: {
    },
    headerContainer: {
        flexDirection: "row",
        backgroundColor: "#0095C5",
        padding: 5,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        color: "white",
        textAlignVertical: "center",
    },
    contentContainer: {
        padding: 10,
        borderBottomColor: '#0095C5',
        borderBottomWidth: 1.5,
    },
    date: {
        textAlign: 'right',
        alignSelf: 'stretch',
    },
    icon: {
        width: 32,
        height: 32,
        paddingRight: 5,
    },
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
    },
    toggleElement: {
        paddingLeft: 5,
        flex: 1,
        textAlign: "center",
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: width - 45,
        height: height - 45,
    },
    modalBackDrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});