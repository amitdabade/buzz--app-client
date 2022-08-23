import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('t1');

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const generateToken = () =>
    btoa(
      JSON.stringify({
        r: roomCode,
        n: userName,
        t: teamName,
      })
    );

  return (
    <div className='home-container'>
      <input
        type='text'
        placeholder='Room code'
        value={roomCode}
        onChange={handleRoomCodeChange}
        className='text-input-field'
      />
      <input
        type='text'
        placeholder='Your name'
        value={userName}
        onChange={handleUserNameChange}
        className='text-input-field'
      />
      <select
        className='text-input-field'
        value={teamName}
        onChange={handleTeamNameChange}
      >
        <option value='t1'>Team 1</option>
        <option value='t2'>Team 2</option>
        <option value='t3'>Team 3</option>
        <option value='t4'>Team 4</option>
      </select>

      <Link
        to={`/${generateToken()}`}
        className={`join-room-button ${
          roomCode && userName ? '' : 'disable-join-button'
        }`}
      >
        JOIN ROOM
      </Link>
    </div>
  );
};

export default Home;
