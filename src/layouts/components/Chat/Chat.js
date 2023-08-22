import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '~/context/ChatContext';
import Add from '~/assets/images/add.png';
import More from '~/assets/images/more.png';
import Cam from '~/assets/images/cam.png';

const cx = classNames.bind(styles);
function Chat() {
  const { data } = useContext(ChatContext);
  return (
    <div className={cx('chat')}>
      <div className={cx('chatInfo')}>
        <span>{data.user?.displayName}</span>
        <div className={cx('chatIcons')}>
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;
