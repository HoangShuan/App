import { ThemeProvider } from '@material-ui/core/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navigation from 'components/Navigation';
import SpeedDials from 'components/SpeedDial';
import GlobalLoading from 'components/UI/GlobalLoading';
import Message from 'components/UI/Message';
import routerConfig from 'configs/routerConfig';
import theme from 'configs/theme';
import useTheme from 'hooks/useTheme';
import useVoice from 'hooks/useVoice';
import NotFoundPage from 'pages/NotFound';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Element } from 'react-scroll';
import { getUserInfo } from 'redux/slices/userInfo.slice';

// Facebook SDK initialization
const initFacebookSDK = () => {
  if (window.FB) return;
  
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });
    window.FB.AppEvents.logPageView();
  };

  // Load SDK
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};

const { routes, renderRoutes } = routerConfig;

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userInfo);

  // get and set theme
  useTheme();

  // get window voice and set custom voice
  useVoice();

  // Initialize Facebook SDK and get user info
  useEffect(() => {
    initFacebookSDK();
    dispatch(getUserInfo());
    setLoading(false);
    return () => {};
  }, []);

  return (
    <>
      {loading ? (
        <GlobalLoading />
      ) : (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <ThemeProvider theme={theme}>
            <Router>
              <div className="dynonary-app">
                <Element name="scrollTop" />
                <Navigation />

                {/* routes */}
                <Suspense fallback={<GlobalLoading />}>
                  <Switch>
                    {renderRoutes(routes, isAuth)}
                    <Route>
                      <NotFoundPage />
                    </Route>
                  </Switch>
                </Suspense>

                {/* common components */}
                <div id="_overlay"></div>
                <Message />
                <SpeedDials />
              </div>
            </Router>
          </ThemeProvider>
        </GoogleOAuthProvider>
      )}
    </>
  );
}

export default App;
