import React from 'react';
import Toast from 'react-native-toast-message';
import NavContainer from './src/components/NavContainer';
import ErrorBoundary from './src/providers/boundary/Error';

import {ContextProvider} from './src/providers/context/Context';

const App = () => {
  return (
    <ContextProvider>
      <ErrorBoundary>
        <NavContainer />
        <Toast />
      </ErrorBoundary>
    </ContextProvider>
  );
};

export default App;
