import React from 'react';
import { View, StyleSheet } from 'react-native';
import Crossword from './Crossword';

const App = () => {
  return (
    <View style={styles.container}>
      <Crossword />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Altere a cor de fundo conforme necessário
  },
});

export default App;
