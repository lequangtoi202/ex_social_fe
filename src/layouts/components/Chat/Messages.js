import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import Message from './Message';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '~/context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '~/config/firebase';

const cx = classNames.bind(styles);
function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);
  return (
    <div className={cx('messages')}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

export default Messages;
