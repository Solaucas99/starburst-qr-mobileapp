import React, {useContext, useEffect} from 'react';
import Context from '../context/Context';

const CantLogged = (Component: React.FC<any>): React.FC<any> => {
  const Wrapper = props => {
    const {state} = useContext(Context);

    useEffect(() => {
      if (state.isLoggedIn) {
        props.navigation.navigate('Home');
      }
    }, [props.navigation, state]);

    return <Component {...props} />;
  };

  return Wrapper;
};

export default CantLogged;
