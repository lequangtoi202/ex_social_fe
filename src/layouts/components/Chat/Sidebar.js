import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';

const cx = classNames.bind(styles);

function Sidebar() {
  return (
    <div className={cx('sidebar')}>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
}

export default Sidebar;
