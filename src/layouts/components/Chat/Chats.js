import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '~/auth/AuthContext';
import { ChatContext } from '~/context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '~/config/firebase';

const cx = classNames.bind(styles);
function Chats() {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(UserContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };
  console.log(chats);
  return (
    <div className={cx('chats')}>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div className={cx('userChat')} key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className={cx('userChatInfo')}>
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Chats;
