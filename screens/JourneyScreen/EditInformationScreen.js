import React, { useState, useEffect, useRef } from "react";

import { connect } from "react-redux";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { Input } from "react-native-elements";

import { setLoci } from "../../store/actions";
import { getActiveJourney } from "../../utils";

function Item({ id, value, editItem, isFocused, pressEnter, style }) {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (isFocused && ref) {
      ref.focus();
    }
  }, [ref]);

  return (
    <Input
      style={style}
      ref={(ref) => setRef(ref)}
      value={value}
      onChangeText={(val) => editItem(id, val)}
      onSubmitEditing={() => pressEnter(id)}
      style={[styles.item]}
    />
  );
}

function EditInformationScreen({ lociStore, setLociStore }) {
  const [loci, setLoci] = useState(lociStore);

  console.log("Store", lociStore);
  useEffect(() => {
    setLoci(lociStore);
  }, [lociStore]);

  let isEmpty = loci.length === 0;

  const setItems = (loci) => {
    console.log(loci);
    setLoci(loci);
    setLociStore(loci);
  };
  //const [items, setItems] = useState([""]);
  const [focused, setFocused] = useState(0);

  const editItem = (i, value) => {
    let newItems = [...loci];
    newItems[i].name = value;
    setItems(newItems);
  };

  const selectItem = () => {};

  const newItem = () => {
    setItems([...loci, { name: "", id: loci.length, coords: null }]);
    selectItem(loci.length - 1);
    setFocused(loci.length - 1);
  };

  const removeItem = (i) => {
    let newItems = [...loci];
    newItems.splice(i, 1);
    setItems(newItems);
  };

  const pressEnter = (i) => {
    if (loci[i].name === "") {
      removeItem(i);
      setFocused(-1);
    } else if (i < loci.length - 1) {
      setFocused(i + 1);
    } else {
      newItem();
      setFocused(i + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={loci}
        renderItem={({ item, index }) => (
          <Item
            id={index}
            value={item.name}
            editItem={editItem}
            isFocused={index === focused}
            pressEnter={pressEnter}
          />
        )}
        keyExtractor={(item, i) => `key${i}`}
      />
      <View style={{ margin: 20 }}>
        <Button title="New Item" onPress={newItem} />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  lociStore: getActiveJourney(state.journeys, state.selJourney).loci,
});

const mapDispatchToProps = { setLociStore: setLoci };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditInformationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 2,
    borderColor: "#f2f2f2",
  },
  title: {
    fontSize: 18,
  },
});
