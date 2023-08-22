import Sidebar from '~/layouts/components/Chat/Sidebar';
import styles from './HomeChat.module.scss';
import classNames from 'classnames/bind';
import Chat from '~/layouts/components/Chat/Chat';

const cx = classNames.bind(styles);

function HomeChat() {
  return (
    <div className={cx('home')}>
      <div className={cx('container')}>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default HomeChat;
