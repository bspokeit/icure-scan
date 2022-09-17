/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import { getAPI as api } from '../src/api/icure';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  //renderer.create(<App />);
  const test = api().cryptoApi.RSA.generateKeyPair();
  console.log('test: ', test);
});
