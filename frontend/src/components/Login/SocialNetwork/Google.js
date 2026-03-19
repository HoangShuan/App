import accountApi from 'apis/accountApi';
import ggIcon from 'assets/icons/gg-icon.png';
import { UX } from 'constant';
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import useStyle from './style';

function LoginGoogle() {
  const classes = useStyle();
  const dispatch = useDispatch();

  // handle success login
  const onLoginSuccess = async () => {
    try {
      dispatch(
        setMessage({
          type: 'success',
          message: 'Đăng nhập thành công',
          duration: UX.DELAY_TIME,
        }),
      );

      setTimeout(() => {
        location.href = '/';
      }, UX.DELAY_TIME);
    } catch (error) {}
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('[LoginGoogle] google response:', response);
        const { access_token } = response;
        if (!access_token) {
          throw new Error('No access token received from Google');
        }
        const apiResponse = await accountApi.postLoginWithGoogle(access_token);
        if (apiResponse.status === 200) {
          onLoginSuccess(apiResponse.data);
        }
      } catch (error) {
        console.error('[LoginGoogle] error:', error);
        const message = error.response?.data?.message || 'Đăng nhập thất bại, thử lại !';
        dispatch(setMessage({ type: 'error', message }));
      }
    },
    onError: (error) => {
      console.error('[LoginGoogle] error:', error);
      dispatch(setMessage({ 
        type: 'error', 
        message: 'Đăng nhập Google thất bại, thử lại !'
      }));
    }
  });

  return (
    <div
      onClick={() => login()}
      className={classes.socialBtn}>
      <img className={classes.socialImg} src={ggIcon} alt="GG" />
      <span className={classes.socialName}>Google</span>
    </div>
  );
}

export default LoginGoogle;
