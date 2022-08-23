import React, { useState, useEffect, useRef } from 'react';

import './BuzzRoom.css';
import useBuzz from '../useBuzz';

const teamMapping = {
  t1: 'Team 1',
  t2: 'Team 2',
  t3: 'Team 3',
  t4: 'Team 4',
};

const BuzzRoom = (props) => {
  const { token } = props.match.params;
  const parsedToken = JSON.parse(atob(token));
  const roomCode = parsedToken.r;
  const userName = parsedToken.n;
  const teamName = teamMapping[parsedToken.t];
  const buzzBtnRef = useRef(null);
  const { buzzList, removeUser, addBuzz, addUser } = useBuzz(roomCode);
  const [buzzRank, setBuzzRank] = useState(0);

  useEffect(() => {
    addUser({ userName, teamName });
  }, []);

  useEffect(() => {
    if (buzzList.length === 0) {
      buzzBtnRef.current.removeAttribute('disabled');
    }
  }, [buzzList]);

  const handleSendBuzz = () => {
    buzzBtnRef.current.setAttribute('disabled', 'true');
    addBuzz({ userName, teamName, time: new Date().toLocaleTimeString() });
  };

  const handleExitBuzzRoom = () => {
    removeUser({ userName, teamName });
    props.history.push('./');
  };

  return (
    <div className='buzz-room-container'>
      <div className='room-code-container'>
        <h3 className='room-code'>Room: {roomCode}</h3>
        <button onClick={handleExitBuzzRoom} className='exit-buzz-room'>
          Exit
        </button>
      </div>
      <div className='user-name-container'>
        <h3 className='buzz-user-name'>Name: {userName}</h3>
        <h3 className='buzz-team-name'>{teamName}</h3>
      </div>
      <h3 className='buzz-rank'>Rank: {buzzRank}</h3>
      <button
        ref={buzzBtnRef}
        onClick={handleSendBuzz}
        className='send-buzz-button'
      >
        Buzz
      </button>
    </div>
  );
};

export default BuzzRoom;
