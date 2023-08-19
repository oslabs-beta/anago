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

  const filterTableData = () => {
    const rows: {} = {};
    const tableIterator = tableData.values();
    try {
      console.log('iterator', tableIterator);

      // initialize a row for each active hpa
      tableIterator.next().value.forEach(metricObj => {
        rows[metricObj.metric.horizontalpodautoscaler] = [];
      });
      // filter metrics into specific hpa row and associated table columns
      let column = 1;
      while (column < 7) {
        tableIterator.next().value.forEach(metricObj => {
          rows[metricObj.metric.horizontalpodautoscaler].push(
            metricObj.value[1],
          );
        });
        column += 1;
      }

      console.log('rows', rows);
    } catch (err) {
      console.log(err);
    }
  };
  /*
  //  retrieve hpa table data on mount
  useEffect(() => {
    getTableData();
  }, []);
  */
  /*
  // filter and shape the metrics to be put in a table only after they have all been received
  useEffect(() => {
    if (fetchCount === 7) return filterTableData();
  }, [fetchCount]);
  */
  useEffect(() => {
    filterTableData();
  }, []);
  // metadata to retrieve all active HPAs. Filter them out by name
  // const metaData = tableData[0];

  // TODO GET METRICS FOR HPA UTILIZATION (final element in array) and display when click the down arrow on table

  // table:
  // [hpa name, status target, desired target, min pods, max pods, replicas ]
  return <div>hi</div>;
};

export default TableDisplay;
