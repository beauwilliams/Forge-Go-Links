import * as React from 'react';
import { Button, Collapse, Divider, Stack } from '@mui/material';
import Header from './components/header';
import Config from './components/config';
import Footer from './components/footer';
import SyncActions from './components/sync-actions';
import { getShowConfig, saveShowConfig } from './store';

export default function App() {
  const [showConfig, setShowConfig] = React.useState<boolean | null>(null);

  const handleShowSetupClick = () => {
    setShowConfig(!showConfig || false);
    saveShowConfig(!showConfig);
  };

  React.useEffect(() => {
    getShowConfig().then((show) => {
      setShowConfig(show);
    });
  }, []);

  return (
    <Stack spacing={2}>
      <Header />
      <SyncActions />
      {showConfig !== null && (
        <Collapse in={showConfig} unmountOnExit>
          <Config />
        </Collapse>
      )}
      <Button variant="text" onClick={handleShowSetupClick}>
        {showConfig ? 'Hide config' : 'Show config'}
      </Button>
      <Divider />
      <Footer></Footer>
    </Stack>
  );
}
