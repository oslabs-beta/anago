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
import Row from './TableRow';

const TableDisplay = ({ tableData }) => {
  // const [tableData, setTableData]: any = useState(new Map());
  const [fetchCount, setFetchCount] = useState(0);
  const [filteredTableData, setfilteredTableData]: any[] = useState([]);

  console.log('tableData', tableData);
  const newData: promResResultElements[][] = [];
  /*
  const getTableData = async () => {
    // perserve the order of the metric results after fetching
    const tableOrder = tableData;
    let count = 0;
    try {
      metricIds.forEach(async id => {
        tableOrder.set(id, null);
        fetch(`/api/data/metrics/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: 'instant',
          }),
        })
          .then(data => data.json())
          .then(data => {
            tableOrder.set(id, data);
            setTableData(tableOrder);
            setFetchCount(++count);
          });
      });
    } catch (err) {
      console.log(err);
    }
  };
  */

  const rows: {} = {};
  const filterTableData = () => {
    // initialize object to store hpa's as keys and all associated metrics as values to eliminate potential errors due to lack of order preservation
    const tableIterator = tableData.values();
    console.log('iterator', tableIterator);
    // initialize a key for each active hpa, representing a row in the table
    tableIterator.next().value.forEach(metricObj => {
      rows[metricObj.metric.horizontalpodautoscaler] = [];
    });
    // filter metrics into specific hpa row and associated table columns
    let column = 1;
    while (column < 7) {
      tableIterator.next().value.forEach(metricObj => {
        rows[metricObj.metric.horizontalpodautoscaler].push(metricObj.value[1]);
      });
      column += 1;
    }
  };

  useEffect(() => {
    filterTableData();
  }, []);

  // TODO GET METRICS FOR HPA UTILIZATION (final element in array) and display when click the down arrow on table

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>HPA</TableCell>
              <TableCell align='right'>Target Status</TableCell>
              <TableCell align='right'>Target Spec</TableCell>
              <TableCell align='right'>Min Pods</TableCell>
              <TableCell align='right'>Max Pods</TableCell>
              <TableCell align='right'>Current Replicas</TableCell>
              <TableCell align='right'>Desired Replicas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {Object.keys(rows).forEach(hpa => {
              <Row key={hpa} hpa={hpa} row={rows[hpa]} />;
            })} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableDisplay;
