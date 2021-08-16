import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { VFC } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  member: IUser;
  isOnline?: boolean;
}

const EachDM: VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const location = useLocation();
  console.log('uselocation 결과', location);
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);

  return (
    <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span className={'bold'}>{member.nickname}</span>
    </NavLink>
  );
};

export default EachDM;
