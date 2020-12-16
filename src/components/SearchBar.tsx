import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Text>Search Bar component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 5,
    marginHorizontal: 15,
    backgroundColor: "#F0EEEE",
  },
});

export default SearchBar;
