import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Warning from '@mui/icons-material/Warning';
import WarningIcon from '@mui/icons-material/Warning';
import { Task, TaskSignalMessage, TaskStatusMessage } from '../golink/tasks';
import React from 'react';
import { getTask } from '../store';

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LoadingCircle() {
  return <CircularProgress size={18} />;
}

interface TaskStatusProps {
  initTask: Task | null;
  task: Task | null;
  width?: string;
}

function TaskStatus({ initTask, task, width = '100px' }: TaskStatusProps) {
  console.log('InitTask', initTask);
  if (initTask == null && task == null) {
    // First time loading
    return (
      <Stack
        direction="row"
        spacing={1}
        color="warning.light"
        alignItems="center"
        width={width}
      >
        <Warning />
        <Typography variant="body2">
          Please provide your token and trigger your first update!
        </Typography>
      </Stack>
    );
  }
  if (task?.status === 'RUNNING') {
    return null;
  } else if (task?.status === 'DONE' || initTask?.status === 'DONE') {
    const totalLinks = task ? task.totalLinks : initTask!.totalLinks;
    return (
      <Stack
        direction="row"
        spacing={1}
        color="success.main"
        alignItems="center"
        width={width}
      >
        <CheckCircleIcon />
        <Typography variant="body2">{totalLinks} links loaded</Typography>
      </Stack>
    );
  } else if (
    initTask?.status === 'RUNNING' || // Last task unfinished
    task?.status === 'ERROR' || // Current task failed
    initTask?.status === 'ERROR' // Last task failed
  ) {
    const failedTask = task ? task : initTask;
    return (
      <Stack
        direction="row"
        spacing={1}
        color="error.main"
        alignItems="center"
        width={width}
      >
        <WarningIcon />
        <Typography variant="body2">
          {failedTask?.errorMessage
            ? failedTask.errorMessage
            : 'Last update failed! Please try update again.'}
        </Typography>
      </Stack>
    );
  } else {
    return null;
  }
}

export default function SyncActions() {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [initTask, setInitTask] = React.useState<Task | null>(null);
  const [task, setTask] = React.useState<Task | null>(null);
  // Used to determine if the task is running or not
  const [processing, setProcessing] = React.useState<
    'UPDATE' | 'PULLING_STATUS' | null
  >('PULLING_STATUS');

  const updateProcessing = (status: Task['status'], type: Task['type']) => {
    if (status === 'INIT' || status === 'RUNNING') {
      setProcessing(type);
    }
    if (status === 'DONE' || status === 'ERROR') {
      setProcessing(null);
    }
  };

  const handleClickUpdate = () => {
    setOpenConfirm(true);
  };

  const update = async () => {
    setOpenConfirm(false);
    // chrome.runtime.sendMessage(
    //   {
    //     type: 'TASK_SIGNAL',
    //     payload: {
    //       type: 'UPDATE',
    //       signal: 'START',
    //     },
    //   } as TaskSignalMessage,
    //   () => {
    //     setProcessing('UPDATE');
    //   },
    // );
  };

  const pullStatus = async () => {
    // const initTask = await getTask();
    // setInitTask(initTask);

    // const response = await chrome.runtime.sendMessage({
    //   type: 'PULL_STATUS',
    // });
    // const task = response?.task;
    // setTask(response.task);

    // if (task && task.status == 'RUNNING') {
    //   setProcessing(task.type);
    // } else {
    //   setProcessing(null);
    // }
  };

  // React.useEffect(() => {
  //   // Add listener for task status
  //   chrome.runtime.onMessage.addListener(
  //     (request: TaskStatusMessage, sender, sendResponse) => {
  //       if (request.type === 'TASK_STATUS') {
  //         const task = request.payload;
  //         sendResponse({ ack: true });
  //         setTask(task);
  //         updateProcessing(task.status, task.type);
  //       }
  //     },
  //   );

  //   // Pull latest status from background
  //   pullStatus();
  // }, []);

  return (
    <>
      <Collapse
        in={processing !== null && processing !== 'PULLING_STATUS'}
        unmountOnExit
      >
        <Stack>
          <Typography>
            {task
              ? `Loading ${task?.currentLink ?? 0} / ${task?.totalLinks ?? 0}`
              : 'Initialising ...'}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={task?.progress ?? 0} />
          </Box>
        </Stack>
      </Collapse>
      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          disabled={processing !== null}
          startIcon={processing === 'UPDATE' ? <LoadingCircle /> : <SyncIcon />}
          onClick={handleClickUpdate}
        >
          Update
        </Button>
        {processing !== 'PULLING_STATUS' && (
          <TaskStatus initTask={initTask} task={task} width="200px" />
        )}
      </Stack>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Are you sure you want to update all go links?</DialogTitle>
        <DialogContent>
          This will update all links without cache. Are you sure to do this?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={update}>Execute</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
