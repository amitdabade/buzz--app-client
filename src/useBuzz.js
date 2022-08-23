import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://buzz--app.herokuapp.com/';
// const SOCKET_SERVER_URL = 'http://localhost:4000';
const NEW_BUZZ_EVENT = 'new_buzz_event';
const NEW_USER_EVENT = 'new_user_event';
const ADD_BUZZ = 'ADD_BUZZ';
const RESET_BUZZ = 'RESET_BUZZ';
const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';

const useBuzz = (roomCode) => {
  const [buzzList, setBuzzList] = useState([]);
  const [userList, setUserList] = useState([]);
  const socketRef = useRef();

  const isUnique = (item, data) => {
    if (data) {
      const index = data.findIndex((d) => d.userName === item.userName);
      if (index === -1) {
        return true;
      }
      return false;
    }
    return true;
  };

  const addToLs = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLs = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };

  const removeFromLs = (key) => {
    localStorage.removeItem(key);
  };

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomCode },
    });

    socketRef.current.on(NEW_BUZZ_EVENT, (buzz) => {
      switch (buzz.action) {
        case ADD_BUZZ:
          const data = getFromLs('buzzList');
          setTimeout(() => {
            if (isUnique(buzz, data)) {
              setBuzzList([...buzzList, buzz]);
              if (Array.isArray(data)) {
                addToLs('buzzList', [...data, buzz]);
              } else {
                addToLs('buzzList', [buzz]);
              }
            }
          }, 0);
          break;

        case RESET_BUZZ:
          setBuzzList([]);
          break;

        default:
          break;
      }
    });

    socketRef.current.on(NEW_USER_EVENT, (user) => {
      const data = getFromLs('userList');
      switch (user.action) {
        case ADD_USER:
          setTimeout(() => {
            if (isUnique(user, data)) {
              // setUserList([...userList, user]);
              if (Array.isArray(data)) {
                setUserList([...data, user]);
                addToLs('userList', [...data, user]);
              } else {
                setUserList([user]);
                addToLs('userList', [user]);
              }
            } else {
              const newUser = data.filter((u) => u.userName != user.userName);
              setUserList([...newUser, user]);
              addToLs('userList', [...newUser, user]);
            }
          }, 0);
          break;

        case REMOVE_USER:
          const newUser = data.filter((u) => u.userName !== user.userName);
          setUserList([...newUser]);
          addToLs('userList', [...newUser]);
          break;

        default:
          break;
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode]);

  const addBuzz = (buzzData) => {
    socketRef.current.emit(NEW_BUZZ_EVENT, {
      ...buzzData,
      action: ADD_BUZZ,
    });
  };

  const resetBuzz = () => {
    socketRef.current.emit(NEW_BUZZ_EVENT, {
      action: RESET_BUZZ,
    });
  };

  const addUser = (userData) => {
    socketRef.current.emit(NEW_USER_EVENT, {
      ...userData,
      action: ADD_USER,
    });
  };

  const removeUser = (userData) => {
    socketRef.current.emit(NEW_USER_EVENT, {
      ...userData,
      action: REMOVE_USER,
    });
  };

  return { userList, buzzList, addBuzz, resetBuzz, addUser, removeUser };
};

export default useBuzz;
