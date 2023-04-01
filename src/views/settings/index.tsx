import React, { FC } from "react";

import { DrivesList } from "../../components/drive/DrivesList";
import { ProfilesList } from "../../components/profile/ProfilesList";
import { UsersList } from "../../components/user/UsersList";

export const SettingsView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold mt-10 mb-8">Settings</h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center flex flex-col gap-5">
          <UsersList />
          <ProfilesList />
          <DrivesList />
        </div>
      </div>
    </div>
  );
};
