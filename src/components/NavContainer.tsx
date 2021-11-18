import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';

import Home from '../../src/pages/Home';
import Login from '../../src/pages/login/Login';
import QRCodeRead from '../../src/pages/QRCodeRead';
import Context from '../providers/context/Context';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const NavContainer = () => {
  const {state, setState} = useContext(Context);

  const signOut = () => {
    setState(oldState => ({
      ...oldState,
      name: '',
      username: '',
      emailConfirmed: false,
      isLoggedIn: false,
      isLoading: false,
      tokens: {
        idToken: '',
        accessToken: '',
        refreshToken: '',
      },
    }));
  };

  const CustomDrawerContent = props => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          labelStyle={{color: '#3D6DCC'}}
          label={`Olá, ${state.username}`}
          onPress={() => {}}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          labelStyle={{color: 'red'}}
          label="Sair"
          onPress={() => signOut()}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <NavigationContainer>
      {state.isLoggedIn ? (
        <Drawer.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Home"
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Ler QR Code" component={QRCodeRead} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Login">
          <Stack.Screen name="Home" component={Login} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default NavContainer;
