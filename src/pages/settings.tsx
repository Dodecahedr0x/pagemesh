import { APP_NAME } from "../utils/constants";
import Head from "next/head";
import type { NextPage } from "next";
import React from "react"
import { SettingsView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Settings - {APP_NAME}</title>
        <meta
          name="description"
          content="Profile"
        />
      </Head>
      <SettingsView />
    </div>
  );
};

export default Basics;
