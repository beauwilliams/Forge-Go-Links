import { Link, Stack, Typography } from '@mui/material';
import { TaskStatusMessage } from '../golink/tasks';
import React from 'react';
import { getUpdateTS } from '../store';
import * as moment from 'moment';

export default function Footer() {
  const [ts, setUpdateTS] = React.useState<number | null>();
  // React.useEffect(() => {
  //   function updateTS() {
  //     getUpdateTS().then((ts) => {
  //       setUpdateTS(ts);
  //     });
  //   }

  //   updateTS();

  //   // Add listener for task status
  //   chrome.runtime.onMessage.addListener((request: TaskStatusMessage, sender, sendResponse) => {
  //     if (request.type === 'TASK_STATUS') {
  //       const task = request.payload;
  //       if (task.status === 'DONE' || true) {
  //         updateTS();
  //       }
  //     }
  //   });
  // }, []);

  return (
    <Stack direction="column" justifyContent="space-between">
      <Typography variant="body2" color="gray">
        Last updated: {ts && Number(ts) ? moment(ts).fromNow() : ts}
      </Typography>
    </Stack>
  );
}
