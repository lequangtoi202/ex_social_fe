import Header from '~/layouts/components/Header';
import styles from './HeaderOnly.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>
        <div className={cx('content')}>{children}</div>
      </div>
    </div>
  );
}
HeaderOnly.propTypes = {
  children: PropTypes.node.isRequired,
};
export default HeaderOnly;
