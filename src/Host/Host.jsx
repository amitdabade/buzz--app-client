import React, { useState, useEffect } from 'react';

import './Host.css';
import useBuzz from '../useBuzz';

const addToLs = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLs = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const removeFromLs = (key) => {
  localStorage.removeItem(key);
};

const getSortedData = (data) => {
  if (Array.isArray(data)) {
    return data.sort((a, b) => {
      if (a.teamName < b.teamName) {
        return -1;
      }
      if (a.teamName > b.teamName) {
        return 1;
      }
      return 0;
    });
  } else {
    return [];
  }
};

const Host = () => {
  const [roomCode, setRoomCode] = useState(getFromLs('roomCode'));
  const [showUserList, setShowUserList] = useState(false);
  const [userListSorted, setUserListSorted] = useState(
    getSortedData(getFromLs('userList'))
  );
  const [buzzListState, setBuzzListState] = useState([]);
  const { buzzList, userList, resetBuzz, removeUser } = useBuzz(roomCode);

  const handleResetBuzz = () => {
    resetBuzz();
    removeFromLs('buzzList');
  };

  useEffect(() => {
    if (!roomCode) {
      const code = Math.floor(1000 + Math.random() * 9000);
      setRoomCode(code);
      addToLs('roomCode', code);
    }
    handleResetBuzz();
    // removeFromLs('userList');
  }, []);

  useEffect(() => {
    if (Array.isArray(userList)) {
      setUserListSorted(getSortedData(getFromLs('userList')));
    }
  }, [userList]);

  useEffect(() => {
    if (buzzList) {
      setBuzzListState(getFromLs('buzzList'));
    }
  }, [buzzList]);

  const handleRemoveUser = (userName) => {
    removeUser({ userList, userName });
  };

  const handleToggleUserList = () => {
    setShowUserList(!showUserList);
  };

  return (
    <div className='host-room-container'>
      <h1 className='room-name'>Room: {roomCode}</h1>
      <p className='toggle-user-list-btn' onClick={handleToggleUserList}>
        Users ({userListSorted?.length})
      </p>
      {showUserList && (
        <div className='user-list-wrapper'>
          <ol className='user-list'>
            {userListSorted?.map((user, i) => (
              <li className='user-list-item' key={user.userName}>
                <span className='user-no'>{i + 1}</span>
                <span className='user-name'>{user.userName}</span>
                <span className='user-team'>{user.teamName}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className='buzz-list-wrapper'>
        <ol className='buzz-list'>
          {buzzListState?.map((user, i) => (
            <li className='buzz-list-item' key={user.userName}>
              <span className='buzz-no'>{i + 1}</span>
              <span className='buzz-name'>{user.userName}</span>
              <span className='buzz-team'>{user.teamName}</span>
            </li>
          ))}
        </ol>
      </div>

      <button onClick={handleResetBuzz} className='reset-buzz-button'>
        Reset
      </button>
    </div>
  );
};

export default Host;
