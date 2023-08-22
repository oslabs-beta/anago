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

interface RowsObj {
  [key: string]: any[];
}
const TableDisplay = ({ tableData, logId }) => {
  // const [tableData, setTableData]: any = useState(new Map());
  const [fetchCount, setFetchCount] = useState(0);
  const [filteredTableData, setfilteredTableData]: any[] = useState([]);
  const [logHPA, setLogHPA] = useState<string | promResResultElements[][]>([]);

  console.log('logId', logId);
  console.log('tableData', tableData);
  const newData: promResResultElements[][] = [];
  /*
  const getHPAUtilization = async () => {
    fetch(`/api/data/metrics/${logId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        console.log('hpa data', data);
        setLogHPA(data);
      })
      .catch(err => console.log(err));
  };
  */
  let arrOfRows: any = undefined;
  const rows: RowsObj = {};
  const filterTableData = () => {
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
        return <Row key={hpa} hpa={hpa} row={rows[hpa]} />;
      }),
    );
    // arrOfRows = Object.keys(rows).map(hpa => {
    //   return <Row key={hpa} hpa={hpa} row={rows[hpa]} />;
    // });
    console.log('rows', rows);
    console.log('Object.keys(rows)', Object.keys(rows));
  };

  useEffect(() => {
    // getHPAUtilization();
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
              <TableCell align='right'>Target Status %</TableCell>
              <TableCell align='right'>Target Spec %</TableCell>
              <TableCell align='right'>Min Pods</TableCell>
              <TableCell align='right'>Max Pods</TableCell>
              <TableCell align='right'>Current Replicas</TableCell>
              <TableCell align='right'>Desired Replicas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTableData}
            <Row
              key='pithy-deploymentTest'
              hpa='pithy-deploymentTest'
              row={['0', '50', '1', '10', '1', '1']}
            />
            {/* <Row
              key={'hpa'}
              hpa={'hpa'}
              row={[1, 2, 3, 4, 5, 6]}
              logHPA={logHPA}
            /> */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableDisplay;
