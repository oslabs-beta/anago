import React, {
  ReactComponentElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
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
import { promResResultElements } from '../../../types';
import Row from './TableRow';
import { cleanTime } from '../../context/functions';

interface RowsObj {
  [key: string]: any[];
}

const TableDisplay = ({ tableData, logId, graphIds }) => {
  const [filteredTableData, setfilteredTableData]: any[] = useState([]);

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
      })
      .catch(err => console.log('Error retrieving HPA Utilization data', err));
  };

  const filterHPAUtilization = (data: any[]) => {
    // initialize cache to store an array of metric values by their associated hpa
    const cache = {};
    // if not metrics met the scope of the query
    if (data[0] === 'No metrics meet the scope of the query') {
      return filterTableData(cache);
    } else {
      data.forEach(metricObj => {
        cache[metricObj.metric.horizontalpodautoscaler] = [];
        if (!Array.isArray(metricObj.values[0][0])) {
          metricObj.values.forEach(arr => {
            cache[metricObj.metric.horizontalpodautoscaler].push([
              cleanTime(arr[0]),
              arr[1],
            ]);
          });
        }
        // if the values array from prometheus is >99, then it will return nested arrays of the values array (each holds the metrics for every 99 set of values)
        // in this case, only display the most recent 99 metrics
        else {
          metricObj.values[0].forEach(arr => {
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
