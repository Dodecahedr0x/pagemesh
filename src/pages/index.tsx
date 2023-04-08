import { APP_NAME } from "../utils/constants";
import Head from "next/head";
import { HomeView } from "../views";
import type { NextPage } from "next";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_NAME} />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
