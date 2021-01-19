import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PatientScans = ({ images }) => {
  return (
    <View>
      <Text>Number of patient scans: {images.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PatientScans;
