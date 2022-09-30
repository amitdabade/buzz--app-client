import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

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

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Host = () => {
  let query = useQuery();
  const [roomCode, setRoomCode] = useState(
    parseInt(query.get("room")) || getFromLs('roomCode')
  );
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
      // addToLs('roomCode', code);
    }
    handleResetBuzz();
    // removeFromLs('userList');
  }, []);

    useEffect(() => {
    if (roomCode) {
      addToLs('roomCode', roomCode);
    }
  }, [roomCode]);

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

  const getBuzzTime = (t) => {
    const time =
      (new Date(t).getTime() - new Date(buzzListState[0].time).getTime()) /
      1000;
    if (time === 0) {
      return new Date(t).toLocaleTimeString();
    } else {
      return '+' + Math.abs(time) + ' sec';
    }
  };

  const getUserListClass = (team) => {
    if (team === 'Team 1' || team === 'Team 3') {
      return 'user-list-item user-list-item-odd';
    }
    return 'user-list-item';
  };

  const handleReloadAll = () => {
    removeFromLs('buzzList');
    removeFromLs('userList');
    removeFromLs('roomCode');
    window.location.reload();
  };

  return (
    <div className='host-room-container'>
      <div className='host-room-header'>
        <h1 className='room-name'>Room: {roomCode}</h1>
        <span className='reload-all' onClick={handleReloadAll} title='Reset buzz room'>
          &#8635;
        </span>
      </div>
      <div className='content-wrapper'>
        <div className='user-list-wrapper'>
          <p className='toggle-user-list-btn' onClick={handleToggleUserList}>
            Users ({userListSorted?.length})
          </p>
          {showUserList && (
            <div className='user-list-wrapper'>
              <ol className='user-list'>
                {userListSorted?.map((user, i) => (
                  <li
                    className={getUserListClass(user.teamName)}
                    key={user.userName}
                  >
                    <span className='user-name'>{user.userName}</span>
                    <span className='user-team'>{user.teamName}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
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
      </div>
      <div className='reset-button-wrapper'>
        <button onClick={handleResetBuzz} className='reset-buzz-button'>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Host;
