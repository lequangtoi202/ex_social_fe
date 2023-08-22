import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import { signOut } from 'firebase/auth';
import { auth } from '~/config/firebase';
import { useContext } from 'react';
import { UserContext } from '~/auth/AuthContext';

const cx = classNames.bind(styles);

function Navbar() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className={cx('navbar')}>
      <span className={cx('logo')}>Alma Chat</span>
      <div className={cx('user')}>
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
