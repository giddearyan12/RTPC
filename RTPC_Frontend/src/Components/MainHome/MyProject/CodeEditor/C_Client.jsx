import React from 'react';
import Avatar from 'react-avatar';
import './C_Style.css'

function C_Client({ username }) {
  return (
    <div className="client-container">
      <Avatar
        name={username.toString()}
        size={50}
        round="14px"
        className="client-avatar"
        alt={`Avatar for ${username}`}
      />
      <span className="client-username">{username || 'Anonymous'}</span>
    </div>
  );
}

export default C_Client;
