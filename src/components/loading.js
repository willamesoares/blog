import React from 'react';
import { createUseStyles } from 'react-jss';

const styleVars = {
  size: '75px',
  animationDuration: '1000ms'
};

const useStyles = createUseStyles({
  '@global': {
    '@keyframes spinner': {
      '50%': {
        transform: 'scaleY(0.25)'
      }
    }
  },
  spinner: {
    width: styleVars.size,
    height: styleVars.size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  spinnerItem: {
    width: `calc(${styleVars.size} / 12)`,
    height: '80%',
    background: '#191919',
    animation: `spinner ${styleVars.animationDuration} ease-in-out infinite`,
    '&:nth-child(1)': {
      animationDelay: `calc(${styleVars.animationDuration} / 10 * -3)`
    },
    '&:nth-child(2)': {
      animationDelay: `calc(${styleVars.animationDuration} / 10 * -1)`
    },
    '&:nth-child(3)': {
      animationDelay: `calc(${styleVars.animationDuration} / 10 * -2)`
    },
    '&:nth-child(4)': {
      animationDelay: `calc(${styleVars.animationDuration} / 10 * -1)`
    },
    '&:nth-child(5)': {
      animationDelay: `calc(${styleVars.animationDuration} / 10 * -3)`
    }
  }
});

const Spinner = () => {
  const styles = useStyles();

  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerItem}></div>
      <div className={styles.spinnerItem}></div>
      <div className={styles.spinnerItem}></div>
      <div className={styles.spinnerItem}></div>
      <div className={styles.spinnerItem}></div>
    </div>
  )
};

export default Spinner;