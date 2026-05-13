import React from 'react';
import LoginFacebook from '@/components/Login/SocialNetwork/Facebook';
import LoginGoogle from '@/components/Login/SocialNetwork/Google';

function SocialNetworkLogin() {
  return (
    <div className="d-flex" style={{ margin: '0 -0.8rem' }}>
      <LoginFacebook />
      <LoginGoogle />
    </div>
  );
}

export default SocialNetworkLogin;
