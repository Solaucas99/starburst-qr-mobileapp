import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ContextType} from '../providers/context/Context';
import {refreshTokenService} from './refreshToken';

const instance = axios.create({
  baseURL: 'https://api.starburst-qr.online',
  timeout: 20000,
  withCredentials: false,
});

instance.interceptors.request.use(
  async config => {
    const axiosConfig = {...config};

    try {
      const value = await AsyncStorage.getItem('@starburstQrState');
      const user: ContextType = value && JSON.parse(value);

      const {idToken, accessToken, refreshToken} = user.tokens;

      if ((!idToken || !accessToken) && !refreshToken) {
        return config;
      }

      axiosConfig.headers = {
        Authorization: `Bearer ${idToken}, Basic ${accessToken}`,
      };

      return Promise.resolve(axiosConfig);
    } catch (err) {
      console.log(err);
      Promise.reject(err);
    }

    return Promise.resolve();
  },
  async err => {
    return Promise.reject(err);
  },
);

instance.interceptors.response.use(
  response => response,
  async err => {
    // If IdToken Expired
    if (
      err.response.status === 401 &&
      err.response.data.message === 'jwt expired'
    ) {
      await refreshTokenService();
      return instance(err.config);
    }
    return Promise.reject(err);
  },
);

export default instance;
