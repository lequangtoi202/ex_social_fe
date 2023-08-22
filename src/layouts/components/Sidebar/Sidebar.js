import classNames from 'classnames/bind';
import { useState } from 'react';
import { HomeIcon, HomeActiveIcon, UserGroupActiveIcon, UserGroupIcon, GroupActiveIcon } from '~/components/Icons';

import Menu, { MenuItem } from './Menu';
import config from '~/config';
import Button from '~/components/Button/Button';
import styles from './Sidebar.module.scss';
import PostModal from '~/components/PostModal/PostModal';

const cx = classNames.bind(styles);

function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <aside className={cx('wrapper')}>
      <Menu>
        <MenuItem
          title="Trang chủ"
          to={config.routes.home}
          icon={<HomeIcon />}
          activeIcon={<HomeActiveIcon />}
        ></MenuItem>
        <MenuItem
          title="Theo dõi"
          to={config.routes.following}
          icon={<UserGroupIcon />}
          activeIcon={<UserGroupActiveIcon />}
        ></MenuItem>
        <MenuItem
          title="Nhóm"
          to={config.routes.groups}
          icon={<GroupActiveIcon />}
          activeIcon={<GroupActiveIcon />}
        ></MenuItem>
      </Menu>

      <Button primary large onClick={handleShow}>
        Đăng
      </Button>

      <PostModal show={show} onHide={handleClose} />
    </aside>
  );
}

export default Sidebar;
