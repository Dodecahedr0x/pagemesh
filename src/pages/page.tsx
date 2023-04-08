import { APP_NAME } from "../utils/constants";
import Head from "next/head";
import type { NextPage } from "next";
import { PageView } from "../views/page";

const Pages: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_NAME} />
      </Head>
      <PageView />
    </div>
  );
};

export default Pages;
