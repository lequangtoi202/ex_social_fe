import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import Header from './Header';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({ children, hideOnClick = false, items = [], onChange = defaultFn }) {
  const [history, setHistory] = useState([{ data: items }]);
  const current = history[history.length - 1];

  const renderItems = () => {
    return current.data.map((item, index) => {
      const isParent = !!item.children;

      return (
        <MenuItem
          key={index}
          data={item}
          onClick={() => {
            if (isParent) {
              setHistory((prev) => [...prev, item.children]);
            } else {
              onChange(item);
            }
          }}
        />
      );
    });
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleResetMenu = () => {
    setHistory((prev) => history.slice(0, 1));
  };

  return (
    <Tippy
      delay={[0, 700]}
      interactive
      placement="bottom-end"
      hideOnClick={hideOnClick}
      render={(attrs) => (
        <div className={cx('menu-items')} tabIndex="-1" {...attrs}>
          <PopperWrapper className={cx('menu-popper')}>
            {history.length > 1 && <Header title={current.title} onBack={handleBack} />}
            <div className={cx('menu-body')}>{renderItems()}</div>
          </PopperWrapper>
        </div>
      )}
      onHide={handleResetMenu}
    >
      {children}
    </Tippy>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  hideOnClick: PropTypes.func,
  items: PropTypes.array,
  onChange: PropTypes.func,
};

export default Menu;
