import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '@/redux/slices/message.slice';
import userInfoReducer from '@/redux/slices/userInfo.slice';
import voiceReducer from '@/redux/slices/voice.slice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    userInfo: userInfoReducer,
    voice: voiceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
