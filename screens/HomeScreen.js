import * as React from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const journeys = [{name: "home", id: 0, loci: []}, {name: "work", id: 1, loci: []}];

function Item({ id, title, onPress }) {
    return (
            <TouchableOpacity
        onPress={() => onPress(id)}
        style={[
            styles.item,
            
        ]}
            >
            <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
    );
}

export default function HomeScreen() {
    return (
            <View style={styles.container}>
            <FlatList
        data={journeys}
        renderItem={({ item }) => (
                <Item
            id={item.id}
            title={item.name}
            onPress={() => {}}
                />

        )}
        keyExtractor={item => item.id}
            />

            </View>
    );
}

const Constants = { statusBarHeight: 50};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Constants.statusBarHeight,
    },
    item: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 2,
        borderColor: '#f2f2f2'
    },
    title: {
        fontSize: 18,
    },
});
