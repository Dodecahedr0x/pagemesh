import React, { FC } from 'react';

import { APP_NAME } from '../utils/constants';
import { AppBar } from '../components/AppBar';
import { AppProps } from 'next/app';
import { ContentContainer } from '../components/ContentContainer';
import { ContextProvider } from '../contexts/ContextProvider';
import { Footer } from '../components/Footer';
import Head from 'next/head';
import Notifications from '../components/Notification'

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
            <Footer />
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
