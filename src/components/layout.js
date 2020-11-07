import React from 'react';
import { createUseStyles } from 'react-jss';

import { rhythm } from '../utils/typography';

const useStyles = createUseStyles({
  layout: {
    marginLeft: `auto`,
    marginRight: `auto`,
    maxWidth: rhythm(24),
    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
  }
});

const Layout = (props) => {
  const { children } = props;
  const { layout: layoutStyles } = useStyles();

  return (
    <div className={layoutStyles}>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
