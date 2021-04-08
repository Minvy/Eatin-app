import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TextInput } from 'react-native';
import { Text, Button, Layout, ListItem, List, Divider, Tooltip, Modal, Card } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { addTable, fetchTables, postTable, removeTable, removeTableFromDatabase, postActivatedTables } from '../../store/actions/bookings';

const AddTableScreen = (props) => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.bookings.tables);

  let selectedTables;

  const resid = useSelector(state => state.staffRestaurant.restaurant.id);
  const [newTables, setNewTables] = React.useState([]);
  const [visibleAddTooltip, setVisibleAddTooltip] = React.useState(false);
  const [visibleActivateTooltip, setVisibleActivateTooltip] = React.useState(false);
  const [visibleGuestTooltip, setVisibleGuestTooltip] = React.useState(false);
  const [visibleAttributeTooltip, setVisibleAttributeTooltip] = React.useState(false);
  const [visibleAttributeModal, setVisibleAttributeModal] = React.useState(false);
  const [visibleGuestModal, setVisibleGuestModal] = React.useState(false);
  const [guestNumber, setGuestNumber] = React.useState(undefined);
  const [selectedAttributes, setSelectedAttributes] = React.useState([]);
  const [attributeButtonText, setAttributeButtonText] = React.useState("Select attributes");

  const receiveSelectedTables = (tables) => {
    selectedTables = tables;
  }

  if (store.length === 0) {
    dispatch(fetchTables(resid));
  }

  const GuestModal = () => {
    const data = new Array(20).fill({
      text: 'Guests',
    });

    const renderItem = ({ item, index }) => (
      <ListItem title={`${index + 1} ${item.text} `} onPress={() => {
        setGuestNumber(index + 1);
        setVisibleGuestModal(false);
      }} />
    );

    return (
      <Modal visible={visibleGuestModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisibleGuestModal(false)}
        style={{ maxHeight: '50%', padding: 10 }}
      >
        <Card disabled={true}>
          <Text>Select how many guests can be seated</Text>
          <Divider style={{ marginBottom: 10 }} />
          <List
            style={styles.modalList}
            data={data}
            renderItem={renderItem}
          />
        </Card>
      </Modal>
    );
  }

  const AttributeModal = () => {
    const data = ['Outside', 'Inside', 'Quiet area', 'Next to a window', 'Next to the door', 'No smoking', 'Smoking allowed'];

    const renderItem = ({ item, index }) => (
      <ListItem title={`${index + 1} ${item} `}
        style={selectedAttributes.includes(index) ? { backgroundColor: '#a2d2ff' } : undefined}
        onPress={() => {
          if (selectedAttributes.includes(index)) {
            const indexOfAttribute = selectedAttributes.indexOf(index);
            if (indexOfAttribute !== -1) {
              const newAttributeArray = selectedAttributes;
              newAttributeArray.splice(indexOfAttribute, 1);
              setSelectedAttributes([...newAttributeArray]);
            }
          } else {
            if(selectedAttributes.length < 3){
              setSelectedAttributes([...selectedAttributes, index]);
            }
          }
        }} />
    );

    return (
      <Modal visible={visibleAttributeModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setVisibleAttributeModal(false)
          if (selectedAttributes.length > 0) {
            setAttributeButtonText("Selected");
          } else {
            setAttributeButtonText("Select attributes");
          }
        }
        }
      >
        <Card disabled={true}>
          <Text>Select up to 3 features best describe the table</Text>
          <Divider style={{ marginBottom: 10 }} />
          <List
            style={styles.modalList}
            data={data}
            renderItem={renderItem}
            extraData={selectedTables}
          />
        </Card>
      </Modal>
    );
  }

  const SelectGuestsButton = () => {
    let text = guestNumber + " Guests";
    if (guestNumber === undefined) {
      text = 'Select guest number'
    }
    return (
      <Button style={styles.inputButtons} onPress={() => {
        setVisibleGuestModal(true);
      }}
        onLongPress={() => {
          setVisibleGuestTooltip(true);
        }}
        delayLongPress={1000}>
        {text}
      </Button>
    );
  }

  const SelectAttributeButton = () => {
    return (
      <Button style={styles.inputButtons} onPress={() => {
        setVisibleAttributeModal(true);
      }}
        onLongPress={() => {
          setVisibleAttributeTooltip(true);
        }}
        delayLongPress={1000}
      >{attributeButtonText}</Button>
    );
  }

  const ActivateButton = () => {
    
    return (
      <Button style={styles.button} onPress={() => {
        const tableArray = [];
        selectedTables.forEach((tableIndex) => {
          tableArray.push(store[tableIndex]);
        });
        console.log(tableArray);
        dispatch(postActivatedTables(resid, tableArray));
      }}
        onLongPress={() => {
          setVisibleActivateTooltip(true);
        }}
        delayLongPress={1000}
      >Activate</Button>
    );
  }

  const AddButton = () => {
    return (
      <Button style={styles.button} onPress={() => {
        if (selectedAttributes.length > 0 && guestNumber !== undefined) {
          let table_num = 0
          if (store.length > 0) {
            table_num = store.length;
          }
          const newTable = { number:table_num ,size: guestNumber, attributeIndexes: [...selectedAttributes] };
          dispatch(postTable(resid, newTable));
          setNewTables([...newTables, newTable]);
        }
      }
      }
        onLongPress={() => {
          setVisibleAddTooltip(true);
        }}
        delayLongPress={1000}
      >Add</Button>
    );
  }

  const GuestTooltipButton = () => {
    return (
      <Tooltip
        anchor={SelectGuestsButton}
        visible={visibleGuestTooltip}
        onBackdropPress={() => setVisibleGuestTooltip(false)}>
        Press to choose table guest capacity
      </Tooltip>
    );
  }

  const AttributeTooltipButton = () => {
    return (
      <Tooltip
        anchor={SelectAttributeButton}
        visible={visibleAttributeTooltip}
        onBackdropPress={() => setVisibleAttributeTooltip(false)}>
        Press to describe your table
      </Tooltip>
    );
  }

  const ActivateTooltipButton = () => {
    return (
      <Tooltip
        anchor={ActivateButton}
        visible={visibleActivateTooltip}
        onBackdropPress={() => setVisibleActivateTooltip(false)}>
        Make selected tables available for booking
      </Tooltip>
    );
  }

  const AddTooltipButton = () => {
    return (
      <Tooltip
        anchor={AddButton}
        visible={visibleAddTooltip}
        onBackdropPress={() => setVisibleAddTooltip(false)}>
        Save a table with details specified above
      </Tooltip>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Divider />
        <View style={styles.listContainer}>
          {store.length !== 0 ? <ListComponent props={store} callback={receiveSelectedTables} /> : null}
        </View>
        <View style={styles.inputcontainer}>
          <Text style={{ textAlign: 'center', marginBottom: 5 }}>Press and hold the buttons to receive tooltips!</Text>
          <GuestModal />
          <GuestTooltipButton />
          <AttributeModal />
          <AttributeTooltipButton />
          <View style={{ flexDirection: 'row' }}>
            <AddTooltipButton />
            <ActivateTooltipButton />
          </View>
        </View>
      </Layout>
      <Divider />
    </SafeAreaView>
  );
};

const ListComponent = (data) => {
  const [selectedTables, setSelectedTables] = React.useState([]);
  const [loadSelectedTables, setLoadSelectedTables] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const dispatch = useDispatch();

  if (loadSelectedTables) {
    let loadedTables = [];
    data.props.forEach((object, index) => {
      if (object.active) {
        loadedTables.push(index);
      }
    });
    setSelectedTables(loadedTables);
    setLoadSelectedTables(false);
  }

  const handleRefresh = () => {
    dispatch(fetchTables(resid));
    setRefreshing(true);
  }

  React.useEffect(() => {
    data.callback(selectedTables);
  }, [selectedTables])

  const renderItemAccessory = (props) => (
    <Button size='tiny' onPress={() => {
      const indexOfTable = selectedTables.indexOf(props.index);
      if (indexOfTable !== -1) {
        const newTableArray = selectedTables;
        newTableArray.splice(indexOfTable, 1);
        setSelectedTables([...newTableArray]);
      }
      dispatch(removeTable(props.index));
      dispatch(removeTableFromDatabase(props.item.id))
    }}>Remove</Button>
  );

  const ListEntry = (entry) => {
    return (
      <ListItem
        style={selectedTables.includes(entry.index) ? { backgroundColor: '#a2d2ff' } : undefined}
        title={'Table number: ' + entry.item.number}
        description={'Table size : ' + entry.item.size}
        accessoryRight={() => renderItemAccessory(entry)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onPress={() => {
          if (selectedTables.includes(entry.index)) {
            const indexOfTable = selectedTables.indexOf(entry.index);
            if (indexOfTable !== -1) {
              const newTableArray = selectedTables;
              newTableArray.splice(indexOfTable, 1);
              setSelectedTables([...newTableArray]);
            }
          } else {
            setSelectedTables([...selectedTables, entry.index]);
          }
        }}
      />
    )
  }

  return (
    <List
      style={styles.list}
      data={data.props}
      renderItem={ListEntry}
      extraData={selectedTables}
    />
  )
}

const styles = StyleSheet.create({
  modalList: {
    maxHeight: '90%',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    width: '100%',
    height: '100%',
    flex: 5
  },
  list: {
    width: '100%',
    height: '100%',
    alignSelf: "stretch",
  },
  button: {
    marginTop: 10,
    marginLeft: 15,
    width: '50%'
  },
  inputcontainer: {
    flex: 3,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '5%'
  },
  inputButtons: {
    maxHeight: '70%',
    maxWidth: 200,
    marginTop: 10
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})

export default AddTableScreen;
