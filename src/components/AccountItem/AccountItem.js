import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import axios from 'axios';

import Image from '~/components/Image/Image';
import styles from './AccountItem.module.scss';
import Button from '../Button/Button';
import { API_URL } from '~/constants';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function AccountItem({ data, isShowButton = false, groupId }) {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const handleAddMember = (userId, groupId) => {
    axios
      .post(
        API_URL + `groups/${groupId}/users/${userId}/add`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        handleShowSuccess('Thêm thành công');
      })
      .catch((err) => {
        handleShowError('Thêm không thành công.');
      });
  };

  return (
    <>
      <div className={cx('add-account-wrapper')}>
        <Link to={`/@${data.displayName}`} className={cx('wrapper')}>
          <Image className={cx('avatar')} src={data.avatarLink} alt={data.fullName} />
          <div className={cx('info')}>
            <h4 className={cx('name')}>
              <span>{data.fullName}</span>
            </h4>
            <span className={cx('username')}>{data.displayName}</span>
          </div>
        </Link>
        {isShowButton && (
          <Button primary small={true} className={cx('small')} onClick={() => handleAddMember(data.id, groupId)}>
            Thêm
          </Button>
        )}
      </div>
    </>
  );
}

AccountItem.propTypes = {
  data: PropTypes.object.isRequired,
  isShowButton: PropTypes.bool,
  groupId: PropTypes.number,
};

export default AccountItem;
