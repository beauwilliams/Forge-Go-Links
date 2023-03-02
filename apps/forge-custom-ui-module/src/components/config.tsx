import {
  Stack,
  Typography,
  TextField,
  FormLabel,
  FormControlLabel,
  Switch,
  FormControl,
  RadioGroup,
  Radio,
} from '@mui/material';
import React from 'react';
import {
  getEmail,
  getRefreshToken,
  saveEmail,
  saveRefreshToken,
} from '../store';

export default function config() {
  const [refreshToken, setRefreshToken] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [frequency, setFrequency] = React.useState<'daily' | 'weekly'>('daily');
  const [autoUpdate, setAutoUpdate] = React.useState(false);

  const frequencyDisabled = !autoUpdate;
  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRefreshToken(event.target.value);
    saveRefreshToken(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    saveEmail(event.target.value);
  };

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFrequency(
      (event.target as HTMLInputElement).value as 'daily' | 'weekly',
    );
  };

  React.useEffect(() => {
    getRefreshToken().then((token) => {
      setRefreshToken(token);
    });
    getEmail().then((email) => {
      setEmail(email);
    });
  }, []);

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <TextField
        id="outlined-basic"
        label="Atlassian Email"
        value={email}
        onChange={handleEmailChange}
        size="small"
      />
      <TextField
        id="outlined-basic"
        label="API v4 Refresh Token"
        value={refreshToken}
        type="password"
        onChange={handleTokenChange}
        size="small"
      />
      <Stack direction="row" justifyContent="space-between">
        <FormControl>
          <RadioGroup row value={frequency} onChange={handleFrequencyChange}>
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label="Daily"
              disabled={frequencyDisabled}
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label="Weekly"
              disabled={frequencyDisabled}
            />
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          control={<Switch />}
          label="Auto Update"
          value={autoUpdate}
          disabled={true}
          onChange={() => setAutoUpdate(!autoUpdate)}
        ></FormControlLabel>
      </Stack>
    </Stack>
  );
}
