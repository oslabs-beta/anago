import React, {
  ReactComponentElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
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
// import { cleanTime } from '../../server/controllers/helperFuncs';

interface RowsObj {
  [key: string]: any[];
}

// ! should be able to import this func from helperFuncs but getting an error with reading 'fs'
/*
function cleanTime(date: Date, options: any) {
  const metricDuration = options.hasOwnProperty('duration')
    ? options.duration
    : 24 * 60 * 60;

  if (metricDuration >= 2 * 7 * 24 * 60 * 60) {
    // >= 2 week
    return date.toLocaleDateString(); //date only
  } else if (metricDuration <= 12 * 60 * 60) {
    // < 12 h
    const dateArr = date.toLocaleTimeString().split(':');
    const pref = dateArr.slice(0, 2).join(':');
    const suff = dateArr[2].split(' ')[1];
    return pref + ' ' + suff; // time + AM/PM
  } else {
    // 12-2w
    const arr = date.toLocaleString().split(',');
    const dateStr = arr[0].split('/').slice(0, 2).join('/');
    const timeArr = arr[1].split(':');
    const pref = timeArr.slice(0, 2).join(':');
    const suff = timeArr[2].split(' ')[1];
    const timeStr = pref + ' ' + suff;
    return dateStr + ': ' + timeStr; // MM/DD, TOD
  }
}
*/

const TableDisplay = ({ tableData, logId, graphIds }) => {
  // const [tableData, setTableData]: any = useState(new Map());
  const [fetchCount, setFetchCount] = useState(0);
  const [filteredTableData, setfilteredTableData]: any[] = useState([]);
  const [logHPA, setLogHPA] = useState<string | promResResultElements[][]>([]);

  const newData: promResResultElements[][] = [];

  const getHPAUtilization = async () => {
    fetch(`/api/data/metrics/${logId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayType: 'log',
      }),
    })
      .then(data => data.json())
      .then(data => {
        filterHPAUtilization(data);
        // setLogHPA(data);
      })
      .catch(err => console.log(err));
  };

  const filterHPAUtilization = data => {
    // initialize cache to store an array of metric values by their associated hpa
    const cache = {};

    // if not metrics met the scope of the query
    if (typeof data === 'string') {
      return filterTableData(cache);
    } else {
      data.forEach(metricObj => {
        cache[metricObj.metric.horizontalpodautoscaler] = [];
        if (!Array.isArray(metricObj.values[0][0])) {
          metricObj.values.forEach(arr => {
            // ! may need to update duration when fixing the HPA Utilization query
            /*
          cache[metricObj.metric.horizontalpodautoscaler].push(
            [cleanTime(arr[0], { duration: 60 * 60 }),
            arr[1]]
          );
          */
            cache[metricObj.metric.horizontalpodautoscaler].push([
              arr[0],
              arr[1],
            ]);
          });
        }
        // if the values array from prometheus is >99, then it will return nested arrays of the values array (each holds the metrics for every 99 set of values)
        // in this case, only display the most recent 99 metrics
        else {
          metricObj.values[0].forEach(arr => {
            // ! may need to update duration when fixing the HPA Utilization query
            /*
          cache[metricObj.metric.horizontalpodautoscaler].push(
            [cleanTime(arr[0], { duration: 60 * 60 }),
            arr[1]]
          );
          */
            cache[metricObj.metric.horizontalpodautoscaler].push([
              arr[0],
              arr[1],
            ]);
          });
        }
      });
      return filterTableData(cache);
    }
  };

  const rows: RowsObj = {};
  const filterTableData = cache => {
    // initialize object to store hpa's as keys and all associated metrics as values to eliminate potential errors due to lack of order preservation (individual scraped metrics may not be in order by hpa) and obtain constant lookup time
    const tableIterator = tableData.values();

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
    // !may need to be a separate func
    setfilteredTableData(
      Object.keys(rows).map(hpa => {
        return (
          <Row
            key={hpa}
            hpa={hpa}
            row={rows[hpa]}
            log={
              cache[hpa] ||
              'This HPA has not reached 90% or more utilization within the last day'
            }
          />
        );
      }),
    );
  };

  useEffect(() => {
    getHPAUtilization();
  }, []);

  // useEffect(() => {
  //   filterTableData();
  // }, [logHPA]);

  // TODO GET METRICS FOR HPA UTILIZATION (final element in array) and display when click the down arrow on table

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>HPA</TableCell>
              <TableCell align='right'>Target Status %</TableCell>
              <TableCell align='right'>Target Spec %</TableCell>
              <TableCell align='right'>Min Pods</TableCell>
              <TableCell align='right'>Max Pods</TableCell>
              <TableCell align='right'>Current Replicas</TableCell>
              <TableCell align='right'>Desired Replicas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{filteredTableData}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableDisplay;
