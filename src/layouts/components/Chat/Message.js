import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '~/context/ChatContext';
import { UserContext } from '~/auth/AuthContext';

const cx = classNames.bind(styles);
function Message({ message }) {
  const { currentUser } = useContext(UserContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);
  const messageClasses = cx('message', {
    owner: message.senderId === currentUser.uid,
  });
  return (
    <div className={messageClasses} ref={ref}>
      <div className={cx('messageInfo')}>
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>Just now</span>
      </div>
      <div className={cx('messageContent')}>
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
}

export default Message;
