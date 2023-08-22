import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { API_URL } from '~/constants';
import styles from '~/pages/Groups/Groups.module.scss';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function MemberInGroup({ groupId }) {
  const { handleShowError } = UtilsFunction();
  const [numOfMembers, setNumOfMembers] = useState(0);

  useEffect(() => {
    axios
      .get(API_URL + `groups/${groupId}/users/count`)
      .then((res) => setNumOfMembers(res.data))
      .catch((err) => handleShowError('Không lấy được data!'));
  }, [groupId]);

  return <div className={cx('group-members')}>{numOfMembers} members</div>;
}

MemberInGroup.propTypes = {
  groupId: PropTypes.number.isRequired,
};

export default MemberInGroup;
