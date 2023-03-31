import React, { FC } from 'react';

import { GumDecodedUser } from '@gumhq/sdk/lib/user';
import useGumStore from '../../stores/useGumStore';

interface Props {
  user: GumDecodedUser
}
export const UserItem: FC<Props> = ({ user }) => {
  const { user: selectedUser, setDefaultUser, reset } = useGumStore()

  return (
    <div className={`flex flex-row gap-2 w-full justify-between p-1 min-w-48 ${selectedUser.cl_pubkey === user.cl_pubkey ? "bg-success" : ""}`} onClick={() => {
      reset()
      setDefaultUser(user)
    }}>
      {/* <div className='my-auto w-16'>
        <img src={user.cl_pubkey}/>
      </div> */}
      <div className='flex flex-col justify-start text-start w-full'>
        <div>{user.cl_pubkey}</div>
      </div>
      {/* <div>{selectedProfile?.name || "???"}</div> */}
    </div>
  );
};
