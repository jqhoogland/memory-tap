import * as React from "react";

import { connect } from "react-redux";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { selectJourney, newJourney } from "../store/actions";

function Item({ id, title, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={[styles.item]}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const HomeScreen = ({ journeys, selectJourney, newJourney, navigation }) => {
  const createJourney = () => {
    newJourney();
    navigation.navigate("Journey", {
      screen: "Overview",
    });
  };

  const goToJourney = (id) => {
    selectJourney(id);

    navigation.navigate("Journey", {
      screen: "Overview",
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={journeys}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            title={item.name}
            onPress={() => goToJourney(item.id)}
          />
        )}
        keyExtractor={(item) => `key${item.id}`}
      />
      <View style={{ margin: 20 }}>
        <Button title="New Journey" onPress={createJourney} />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  journeys: state.journeys,
});

const mapDispatchToProps = {
  selectJourney,
  newJourney,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const Constants = { statusBarHeight: 50 };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight,
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
