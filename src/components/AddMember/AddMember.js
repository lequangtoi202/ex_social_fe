import classNames from 'classnames/bind';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styles from './AddMember.module.scss';
import Search from '~/layouts/components/Search/Search';

const cx = classNames.bind(styles);
function AddMember({ show, onHide, groupId = null }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thành viên</Modal.Title>
      </Modal.Header>
      <div className={cx('member-search-wrapper')}>
        <div className={cx('wrapper')}>
          <Search isShowButton={true} className={cx('search-width')} groupId={groupId} />
        </div>
      </div>
    </Modal>
  );
}

AddMember.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  groupId: PropTypes.number,
};

export default AddMember;
