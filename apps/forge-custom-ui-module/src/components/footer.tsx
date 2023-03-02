import { Link, Stack, Typography } from '@mui/material';
import { TaskStatusMessage } from '../golink/tasks';
import React from 'react';
import { getUpdateTS } from '../store';
import * as moment from 'moment';

export default function Footer() {
  const [ts, setUpdateTS] = React.useState<number | null>();

  return (
    <Stack direction="column" justifyContent="space-between">
      <Typography variant="body2" color="gray">
        Last updated: {ts && Number(ts) ? moment(ts).fromNow() : ts}
      </Typography>
    </Stack>
  );
}
