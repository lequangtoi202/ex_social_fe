import { useState, forwardRef } from 'react';
import images from '~/assets/images';
import styles from './Image.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Image = forwardRef(({ src, alt, className, fallBack: customFallback = images.noImage, ...props }, ref) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  const [fallBack, setFallback] = useState('');
  const handleError = () => {
    setFallback(customFallback);
  };

  return (
    <img
      ref={ref}
      className={classNames(styles.wrapper, className)}
      src={fallBack || src}
      alt={alt}
      {...props}
      onError={handleError}
    ></img>
  );
});

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  fallBack: PropTypes.string,
};

export default Image;
