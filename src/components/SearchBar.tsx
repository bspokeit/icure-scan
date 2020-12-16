import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Feather style={styles.icon} name="search" />
      <TextInput style={styles.input} placeholder="Search" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0EEEE",
    height: 50,
    borderRadius: 5,
    marginTop: 12,
    marginHorizontal: 12,
    flexDirection: "row",
  },
  icon: {
    fontSize: 30,
    alignSelf: "center",
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default SearchBar;
