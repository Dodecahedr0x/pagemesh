import { APP_NAME } from "../utils/constants";
import Head from "next/head";
import type { NextPage } from "next";
import { ProfileView } from "../views";
import React from "react"

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Profile - {APP_NAME}</title>
        <meta
          name="description"
          content="Profile"
        />
      </Head>
      <ProfileView />
    </div>
  );
};

export default Basics;
