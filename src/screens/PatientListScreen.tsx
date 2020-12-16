import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SearchBar from "../components/SearchBar";

const PatientListScreen = () => {
  return (
    <View>
      <SearchBar />
      <Text>Patient List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientListScreen;
