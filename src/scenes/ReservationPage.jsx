import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Toggle, List, Text, TopNavigation, TopNavigationAction, Divider, Icon } from '@ui-kitten/components';
import Navbar from '@/components/Navbar';

const data = new Array(20).fill({
    title: 'Title for Item',
    description: 'Description for Item',
});

export default ReservationPage = ({ navigation }) => {

    const [checked, setChecked] = React.useState(false);

    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
    };

    const renderTitle = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={{ flex: 4 }}>
                    <Text style={styles.headerText}>McDonalds</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={styles.headerText}>Map  </Text>
                    <TouchableOpacity>
                        <Icon
                            style={styles.icon}
                            fill='white'
                            name='map-outline'
                        ></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderDescription = () => {
        return (
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <Text>People: 5</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {/*empty*/}
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Pending</Text>
                    </View>
                    <View style={styles.date}>
                        <Text>9/12/2020, 18:00</Text>
                    </View>
                </View>
            </View>
        );
    }

    const renderItem = ({ item, index }) => (
        <ListItem
            title={renderTitle}
            style={styles.listEntry}
            description={renderDescription}
        />
    );


    //Top Back navigation Code
    navigateBack = () => {
        navigation.goBack();
    };

    const BackIcon = (props) => (
        <Icon {...props} name='arrow-back' />
    );

    BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );
    //Top Back navigation Code

    //Screen render code
    return (
        <View style={{ flex: 1 }}>
            <TopNavigation title='Reservation list' alignment='center' accessoryLeft={BackAction} />
            <Divider />
            <View style={styles.toggleContainer}>
                <Toggle style={styles.toggleElement} checked={checked} onChange={onCheckedChange}>
                    Display expired?
                </Toggle>
            </View>

            <View style={{ flex: 1 }}>
                <List
                    style={styles.container}
                    data={data}
                    renderItem={renderItem}
                />
            </View>
            <View style={{ flex: 0 }}>
                <Navbar selectedIndex={2} navigation={navigation} />
            </View>
        </View>
    );
};

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
    }
});