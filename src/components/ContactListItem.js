import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import moment from 'moment';
import { getDocumentServices } from '../utils/contactHelper';

const ContactListItem = ({ contact }) => {
  useEffect(() => {
    // console.log('contact: ', contact);
  }, []);

  return (
    <View>
      <Card>
        <Card.Title>
          Contact du {moment(contact.created).format('DD/MM/YYYY hh:MM')}
        </Card.Title>
        <Card.Divider />
        {getDocumentServices(contact).map((s, i) => {
          return (
            <View key={i}>
              {/* <Image
                style={styles.image}
                resizeMode="cover"
                source={{ uri: u.avatar }}
              /> */}
              <Text>{s.id}</Text>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: 'white',
  },
  imageContainerStyle: {
    flex: 1,
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
});

export default ContactListItem;
