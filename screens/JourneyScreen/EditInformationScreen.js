import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { Input } from "react-native-elements";

function Item({ id, value, editItem }) {
  return (
    <Input
      value={value}
      onChangeText={(val) => editItem(id, val)}
      style={[styles.item]}
    />
  );
}

export default function HomeScreen() {
  const [items, setItems] = useState([]);

  const editItem = (i, value) => {
    let newItems = [...items];
    newItems[i] = value;
    console.log(i, value, items, newItems);
    setItems(newItems);
  };

  const selectItem = () => {};

  const newItem = () => {
    setItems([...items, ""]);
    selectItem(items.length - 1);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <Item id={index} value={item} editItem={editItem} />
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
