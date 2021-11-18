import React, {useState, useContext} from 'react';
import {ScrollView, useColorScheme, Dimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {Input, Button, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from '../../services/axios';
import ToastMessage from '../../utils/toast';
import Validate from '../../services/validator/Validate';
import Context from '../../providers/context/Context';
import {CognitoLoginResponse} from '../../interfaces/ICognito';
import CantLogged from '../../providers/hoc/CantLogged';

type RootStackParamList = {
  Home: undefined;
  QRCodeRead: undefined;
  Sobre: undefined;
  Login: undefined;
};

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const View = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${`${height}px`};
  width: ${`${width}px`};
`;

const LoginContainer = styled.View`
  background: white;
  width: 95%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
`;

const InputPackageView = styled.View`
  margin: 10px 0px;
`;

const LabelLogin = styled.Text``;

const shadow = {
  elevation: 4,
  shadowOffset: {width: 5, height: 5},
  shadowColor: '#121214c3',
  shadowOpacity: 2,
  shadowRadius: 10,
};

const Login: React.FC<NativeStackScreenProps<RootStackParamList>> = () => {
  const {state, setState} = useContext(Context);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setLoggedState = async (): Promise<void> => {
    try {
      const {data} = await axios.get('/user');
      const {Value: email_confirmed} = data.data.UserAttributes.filter(
        attribute => attribute.Name === 'email_verified',
      )[0];
      const {Value: nome} = data.data.UserAttributes.filter(
        attribute => attribute.Name === 'name',
      )[0];

      setState(oldState => ({
        ...oldState,
        emailConfirmed: email_confirmed === 'true',
        name: nome,
        username: data.data.Username,
        isLoggedIn: true,
        isLoading: false,
      }));
      ToastMessage('Uhul!', 'Usuário logado com sucesso!', 'success');
    } catch (err: any) {
      setState(oldState => ({...oldState, isLoading: false}));
      ToastMessage('Ops, ocorreu um erro!', err.response.data.message, 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      setState(oldState => ({...oldState, isLoading: true}));
      const validate = Validate.AmplifySignIn({username, password});

      if (!validate.valid && typeof validate.message === 'string') {
        setState(oldState => ({...oldState, isLoading: false}));
        ToastMessage(
          'Ops, ocorreu um erro!',
          validate.message,
          validate.status,
        );
        return;
      }

      const {data, status} = await axios.post<CognitoLoginResponse>('/login', {
        username,
        password,
      });

      if (
        data.ChallengeName &&
        data.ChallengeName === 'NEW_PASSWORD_REQUIRED'
      ) {
        setState(oldState => ({...oldState, isLoading: false}));
        ToastMessage(
          'Ops, ocorreu um erro!',
          'Parece que você precisa completar seu cadastro, mas precisará fazer isso pelo web app... Acesse o site e conclua o cadastro!',
          'error',
        );
        return;
      }

      if (status === 200) {
        setState(oldState => ({
          ...oldState,
          tokens: {
            accessToken: data.AuthenticationResult?.AccessToken || '',
            idToken: data.AuthenticationResult?.IdToken || '',
            refreshToken: data.AuthenticationResult?.RefreshToken || '',
          },
        }));
        await setLoggedState();
        return;
      }
    } catch (err: any) {
      setState(oldState => ({...oldState, isLoading: false}));
      ToastMessage('Ops, ocorreu um erro!', err.response.data.message, 'error');
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <View>
        <LoginContainer style={shadow}>
          <Image
            source={
              isDarkMode
                ? require('../../static/logo-dark.png')
                : require('../../static/logo-light.png')
            }
            style={{width: '100%', height: height * 0.1}}
          />
          <InputPackageView>
            <LabelLogin>Usuário</LabelLogin>

            <Input
              leftIcon={<Icon name="user-alt" size={24} />}
              placeholder="Insira seu usuário"
              onChangeText={(text: string) => setUsername(text)}
              value={username}
            />
          </InputPackageView>

          <InputPackageView>
            <LabelLogin>Senha</LabelLogin>
            <Input
              leftIcon={<Icon name="key" size={24} />}
              secureTextEntry={true}
              placeholder="Insira sua senha"
              onChangeText={(text: string) => setPassword(text)}
              value={password}
            />
          </InputPackageView>

          <Button
            icon={<Icon name="arrow-right" size={15} color="white" />}
            title=" Entrar"
            onPress={handleSubmit}
            loading={state.isLoading}
          />
        </LoginContainer>
      </View>
    </ScrollView>
  );
};

export default CantLogged(Login);
