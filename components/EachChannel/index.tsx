import { IChannel } from '@typings/db';
import React, { VFC } from 'react';
import { NavLink, useParams } from 'react-router-dom';

interface Props {
  channel: IChannel;
}

const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{ workspace?: string }>();

  return (
    <NavLink key={channel.name} activeClassName="selected" to={`/workspace/${workspace}/channel/${channel.name}`}>
      <span>{channel.name}</span>
    </NavLink>
  );
};

export default EachChannel;
