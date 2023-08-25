import React, { useEffect, useState } from 'react';
import { UserData } from '../../../types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = (props: { hpa: string; row: (string | number)[]; log: any }) => {
  const { hpa, row, log } = props;
  const [open, setOpen] = React.useState(false);

  const filterLogHPA = () => {
    if (typeof log === 'string') {
      return (
        <TableRow key={JSON.stringify(log)}>
          <TableCell component='th' scope='row'>
            {log}
          </TableCell>
        </TableRow>
      );
    } else {
      const removeDuplicateTimestamps: any[] = [];
      const finalLog: any[][] = [];
      log.forEach(arr => {
        if (!removeDuplicateTimestamps.includes(arr[0])) {
          removeDuplicateTimestamps.push(arr[0]);
          finalLog.push(arr);
        }
      });
      return finalLog.map(arr => (
        <TableRow key={JSON.stringify(log)}>
          <TableCell component='th' scope='row'>
            {arr[0]}
          </TableCell>
          <TableCell>{arr[1]}</TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='right'>{hpa}</TableCell>
        <TableCell align='right'>{row[0]}</TableCell>
        <TableCell align='right'>{row[1]}</TableCell>
        <TableCell align='right'>{row[2]}</TableCell>
        <TableCell align='right'>{row[3]}</TableCell>
        <TableCell align='right'>{row[4]}</TableCell>
        <TableCell align='right'>{row[5]}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                {`HPA Utlization >= 80%`}
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Utilization %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{filterLogHPA()}</TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
