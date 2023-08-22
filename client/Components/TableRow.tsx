import React, { useEffect, useState } from 'react';
import { UserData } from '../../types';
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
import { promResResultElements } from '../../types';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import metricsController from '../../server/controllers/metricsController';

const Row = (props: { hpa: string; row: (string | number)[]; log: any }) => {
  const { hpa, row, log } = props;
  const [open, setOpen] = React.useState(false);
  const [filteredLog, setFilteredLog] = useState<any>(undefined);

  const filterLogHPA = () => {
    if (typeof log === 'string') {
      return setFilteredLog(
        <TableRow key={JSON.stringify(log)}>
          <TableCell component='th' scope='row'>
            {log}
          </TableCell>
        </TableRow>,
      );
    } else {
      /* {row.history.map(historyRow => (
                      <TableRow key={historyRow.date}>
                        <TableCell component='th' scope='row'>
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.customerId}</TableCell>
                        <TableCell align='right'>{historyRow.amount}</TableCell>
                        <TableCell align='right'>
                          {Math.round(historyRow.amount * row.price * 100) /
                            100}
                        </TableCell>
                      </TableRow>
                    ))} */
      return setFilteredLog(
        log.map(arr => (
          <TableRow key={JSON.stringify(log)}>
            <TableCell component='th' scope='row'>
              {arr[0]}
            </TableCell>
            <TableCell>{arr[1]}</TableCell>
            {/* <TableCell align='right'>{historyRow.amount}</TableCell>
            <TableCell align='right'>
              {Math.round(historyRow.amount * row.price * 100) / 100}
            </TableCell> */}
          </TableRow>
        )),
      );
    }
  };

  useEffect(() => {
    filterLogHPA();
  });

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
        {/* <TableCell component='th' scope='row'>
          {row.name}
        </TableCell> */}
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
                {`HPA Utlization >= 90%`}
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Utilization %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{filteredLog}</TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
