import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';

// const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const style = {
  shadow: {
    elevation: 4,
    shadowOffset: {width: 5, height: 5},
    shadowColor: '#121214c3',
    shadowOpacity: 4,
    shadowRadius: 10,
    borderRadius: 0,
    borderColor: '#ecebf0',
    borderWidth: 5,
  },
};

const View = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const ImageBackground = styled.ImageBackground`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const CPFView = styled.View`
  height: 220px;
  width: ${`${width * 0.9}px`};
`;

const CPF: React.FC = ({children}) => {
  return (
    <View>
      <CPFView style={style.shadow}>
        <ImageBackground
          resizeMode="cover"
          source={require('../static/cpf.jpg')}>
          {children}
        </ImageBackground>
      </CPFView>
    </View>
  );
};

export default CPF;
