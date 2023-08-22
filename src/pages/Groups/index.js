import classNames from 'classnames/bind';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './Groups.module.scss';
import Image from '~/components/Image/Image';
import images from '~/assets/images';
import Button from '~/components/Button/Button';
import { API_URL } from '~/constants';
import MemberInGroup from '~/layouts/components/MembersInGroups';
import { UtilsFunction } from '~/utils';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const cx = classNames.bind(styles);
function Groups() {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const dispatch = useDispatch();
  const { handleShowError } = UtilsFunction();
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + `groups/users/me`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => handleShowError('Đã có lỗi xảy ra!'));
  }, []);

  return (
    <>
      {error && (
        <div className={cx('error')}>
          <AiOutlineCloseCircle />
          {error}
        </div>
      )}
      {success && (
        <div className={cx('success')}>
          <AiOutlineCheckCircle />
          {success}
        </div>
      )}
      <div className={cx('wrapper')}>
        {groups.length !== 0 && (
          <div className={cx('groups-outer')}>
            {groups.map((g) => (
              <div key={g.id} className={cx('groups')}>
                <Image src={images.noImage} className={cx('group-img')} />
                <div className={cx('group-outer')}>
                  <div className={cx('group-title')}>{g.groupName}</div>
                  <MemberInGroup groupId={g.id} />
                </div>
                <div className={cx('group-action')}>
                  <div className={cx('view-group')}>
                    <Button
                      to={`/groups/${g.id}`}
                      variant="primary"
                      small={true}
                      style={{ backgroundColor: 'rgb(29, 155, 240)', color: 'white' }}
                    >
                      Xem nhóm
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {groups.length === 0 && <div> Bạn chưa tham gia vào group nào</div>}
      </div>
    </>
  );
}

export default Groups;
