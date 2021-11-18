// import {parseCookies, destroyCookie} from 'nookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from './axios';
import ToastMessage from '../utils/toast';
import {ContextType} from '../providers/context/Context';

export async function refreshTokenService(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem('@starburstQrState');
    const user: ContextType = value && JSON.parse(value);

    const {refreshToken} = user.tokens;

    if (!refreshToken) {
      await AsyncStorage.setItem('@starburstQrState', '');
      return false;
    }
    const {data, status} = await axios.post('/auth/keys/refresh', {
      refresh_token: refreshToken,
    });

    if (status !== 200) {
      await AsyncStorage.setItem('@starburstQrState', '');
      return false;
    }

    user.tokens.accessToken = data.AuthenticationResult.AccessToken;
    user.tokens.idToken = data.AuthenticationResult.IdToken;

    await AsyncStorage.setItem('@starburstQrState', JSON.stringify(user));

    return true;
  } catch (err: any) {
    // If RefreshToken expired
    // if (err.response && err.response.data.message === 'jwt expired') {
    //   destroyCookie(null, 'idToken');
    //   destroyCookie(null, 'refreshToken');
    //   destroyCookie(null, 'accessToken');
    // }
    await AsyncStorage.setItem('@starburstQrState', '');
    ToastMessage(
      'Ops, ocorreu um erro!',
      'A sessão do usuário expirou, você precisa fazer login novamente!',
      'error',
    );
    return false;
  }
}
