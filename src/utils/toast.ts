import Toast from 'react-native-toast-message';

const ToastMessage = (title: string, message: string, status: string) => {
  Toast.show({
    type: status,
    text1: title,
    text2: message,
  });
};

export default ToastMessage;
