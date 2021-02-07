import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { COLOUR_ACCENT } from '../../Styles/Colours';
import SignOut from '../auth/SignOut';

const Layout: React.FC = ({ children }) => {
  const history = useHistory();
  return (
    <div>
      <div style={{ background: COLOUR_ACCENT, padding: '0.5rem' }}>
        <Button onClick={() => history.push('/')}>Dashboard</Button>
        <Button onClick={() => history.push('/encyclopedia')}>
          Encyclopedia
        </Button>
        <SignOut />
      </div>
      <div style={{ margin: '1rem' }}>{children}</div>
      <div style={{ background: COLOUR_ACCENT, padding: '0.5rem' }}>Footer</div>
    </div>
  );
};

export default Layout;
