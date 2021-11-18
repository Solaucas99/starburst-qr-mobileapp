import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CPFComponent from '../components/CPF';
import styled from 'styled-components/native';

import axios from '../services/axios';
import ToastMessage from '../utils/toast';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootStackParamList} from '../interfaces/INavigation';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Button = styled.Pressable`
  background-color: #eeeeee;
  margin-top: 20px;
  padding: 10px 20px;
  border-width: 1px;
`;

const View = styled.SafeAreaView`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${`${height}px`};
  width: ${`${width}px`};
`;

const Text = styled.Text`
  color: 'rgb(1, 35, 107)';
  font-weight: 600;
  text-align: center;
  font-size: 13px;
`;

const TextDivision = styled.View`
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

const QRCodeRead: React.FC<DrawerScreenProps<RootStackParamList>> = ({
  navigation,
}) => {
  const [isReaded, setIsReaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [date, setDate] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [name, setName] = useState<string>('');

  const filterDate = (date: string): string => {
    const actualDate = new Date(date);
    const year = actualDate.getFullYear();
    const day = actualDate.getDate();
    const month = actualDate.getMonth() + 1;
    const hour = actualDate.getHours();
    const minutes = actualDate.getMinutes();

    return `${day}/${month}/${year} - ${hour <= 9 ? `0${hour}` : hour}:${
      minutes <= 9 ? `0${minutes}` : minutes
    }`;
  };

  const handleRead = async (qrData: string) => {
    setDate('');
    setCpf('');
    setName('');

    try {
      setIsLoading(true);
      const {data, status} = await axios.post('/visits/confirmvisit', {
        data: qrData,
      });

      if (status !== 200) {
        setIsLoading(false);
        ToastMessage('Ops, ocorreu um erro!', data.message, 'error');
        return;
      }

      setDate(data.data.date);
      setCpf(
        data.data.visitor.cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/g,
          '$1.$2.$3-$4',
        ),
      );
      setName(data.data.visitor.nome);
      setIsLoading(false);
      ToastMessage(
        'Visita validada!',
        'O QRCode lido é válido, segue os dados do visitante...',
        'success',
      );
    } catch (err: any) {
      ToastMessage('Ops, ocorreu um erro!', err.response.data.message, 'error');
      setIsLoading(false);
      setIsReaded(false);
      navigation.navigate('Home');
    }
  };

  return isReaded ? (
    <View>
      <Text>
        Data:{' '}
        {date ? (
          filterDate(date)
        ) : (
          <ActivityIndicator size="large" animating={isLoading} />
        )}
      </Text>
      <CPFComponent>
        <TextDivision>
          <Text>Número</Text>
          <Text>
            {cpf ? (
              cpf
            ) : (
              <ActivityIndicator size="large" animating={isLoading} />
            )}
          </Text>
        </TextDivision>

        <TextDivision>
          <Text>Nome</Text>
          <Text>
            {name ? (
              name
            ) : (
              <ActivityIndicator size="large" animating={isLoading} />
            )}
          </Text>
        </TextDivision>
      </CPFComponent>
      <Button
        onPress={() => {
          setIsReaded(false);
          setIsLoading(false);
          navigation.navigate('Home');
        }}>
        <Text>Ok</Text>
      </Button>
    </View>
  ) : (
    <QRCodeScanner
      onRead={e => {
        setIsReaded(true);
        handleRead(e.data);
      }}
      showMarker
      topContent={
        <TouchableOpacity>
          <Text>Centralize o QR Code na tela...</Text>
        </TouchableOpacity>
      }
      cameraType={'back'}
      vibrate
      cameraStyle={{height: height * 0.75}}
    />
  );
};

export default QRCodeRead;
