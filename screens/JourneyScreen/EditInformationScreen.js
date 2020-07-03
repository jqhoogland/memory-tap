import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { Input } from "react-native-elements";

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

export default function HomeScreen() {
  const [items, setItems] = useState([""]);
  const [focused, setFocused] = useState(0);

  const editItem = (i, value) => {
    let newItems = [...items];
    newItems[i] = value;
    setItems(newItems);
  };

  const selectItem = () => {};

  const newItem = () => {
    setItems([...items, ""]);
    selectItem(items.length - 1);
    setFocused(items.length - 1);
  };

  const removeItem = (i) => {
    let newItems = [...items];
    newItems.splice(i, 1);
    console.log(items, newItems);
    setItems(newItems);
  };

  const pressEnter = (i) => {
    if (items[i] === "") {
      removeItem(i);
      setFocused(-1);
    } else if (i < items.length - 1) {
      setFocused(i + 1);
    } else {
      newItem();
      setFocused(i + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <Item
            id={index}
            value={item}
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
