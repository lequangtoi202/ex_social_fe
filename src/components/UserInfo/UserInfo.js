import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { API_URL } from '~/constants';
import Image from '../Image/Image';
import styles from './UserInfo.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { vi } from 'date-fns/locale';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function UserInfo({ userId, timestamp }) {
  const { handleShowError } = UtilsFunction();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}users/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        handleShowError('Đã có lỗi xảy ra!');
      });
  }, [userId]);

  if (user) {
    return (
      <>
        <Image src={user.avatarLink} className={cx('user-avatar')} alt="aa" />
        <div className={cx('user-display')}>
          <div className={cx('displayName')}>{user.displayName}</div>
          <span>
            <FontAwesomeIcon icon={faGlobeAsia} />
            {formatDistanceToNow(new Date(timestamp), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
        </div>
      </>
    );
  }
}

UserInfo.propTypes = {
  userId: PropTypes.number,
  timestamp: PropTypes.any,
};

export default UserInfo;
