import React from 'react';
import {Dimensions, ScrollView, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import {RootStackParamList} from '../interfaces/INavigation';
import {DrawerActions} from '@react-navigation/native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ContainerView = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${`${height}px`};
  width: ${`${width}px`};
`;

const Home: React.FC<DrawerScreenProps<RootStackParamList>> = ({
  navigation,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header
        statusBarProps={{barStyle: 'light-content'}}
        barStyle="light-content"
        centerComponent={{
          text: 'Starburst-QR',
          style: {color: '#fff', fontSize: 23},
        }}
        leftComponent={
          <Button
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            icon={<Icon name="menu" size={23} color="white" />}
          />
        }
        containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
        }}
      />
      <ContainerView
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <Button
          title="Ler QR Code"
          onPress={() => navigation.navigate('Ler QR Code')}
        />
      </ContainerView>
    </ScrollView>
  );
};

export default Home;
