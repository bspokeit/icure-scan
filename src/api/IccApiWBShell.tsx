import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface IccApiWBShellProps {
  props?: any;
}

const content = require('./webview/IccApiWBShellContent');

const IccApiWBShell: React.FC<IccApiWBShellProps> = ({ props }) => {
  const runFirst = `
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  return (
    <View style={styles.hide}>
      <WebView
        originWhitelist={['*']}
        source={content}
        javaScriptEnabled={true}
        injectedJavaScript={runFirst}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hide: {
    display: 'none',
    position: 'absolute',

    width: 0,
    height: 0,

    flexGrow: 0,
    flexShrink: 1,
  },
});

export default IccApiWBShell;
