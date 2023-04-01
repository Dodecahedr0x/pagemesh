import Head from "next/head";
import type { NextPage } from "next";
import { PageView } from "../views/page";

const Pages: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Bookmark Page</title>
        <meta name="description" content="Bookmark page" />
      </Head>
      <PageView />
    </div>
  );
};

export default Pages;
