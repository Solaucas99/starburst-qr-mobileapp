import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ContextType {
  name: string;
  username: string;
  emailConfirmed: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface PropsContext {
  state: ContextType;
  setState: React.Dispatch<React.SetStateAction<ContextType>>;
}

const DEFAULT_VALUE = {
  state: {
    name: '',
    username: '',
    emailConfirmed: false,
    isLoggedIn: false,
    isLoading: false,
    darkTheme: true,
    tokens: {
      idToken: '',
      accessToken: '',
      refreshToken: '',
    },
  },

  setState: () => {},
};

const Context = createContext<PropsContext>(DEFAULT_VALUE);

const ContextProvider: React.FC = ({children}) => {
  const [state, setState] = useState<ContextType>(DEFAULT_VALUE.state);

  useEffect(() => {
    const getData = async (): Promise<ContextType | void> => {
      try {
        const value = await AsyncStorage.getItem('@starburstQrState');
        const user: ContextType = value
          ? JSON.parse(value)
          : DEFAULT_VALUE.state;

        const {idToken, accessToken, refreshToken} = user.tokens;

        if ((!idToken || !accessToken) && !refreshToken) {
          setState(DEFAULT_VALUE.state);
          return;
        }

        if (value !== JSON.stringify(DEFAULT_VALUE.state)) {
          setState(user);
        }
      } catch (err) {
        return DEFAULT_VALUE.state;
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const setData = async () => {
      try {
        await AsyncStorage.setItem('@starburstQrState', JSON.stringify(state));
      } catch (err) {
        setState(DEFAULT_VALUE.state);
      }
    };

    setData();
  }, [state]);

  return (
    <Context.Provider value={{state, setState}}>{children}</Context.Provider>
  );
};

export {ContextProvider};
export default Context;
