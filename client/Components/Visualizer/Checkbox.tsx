
// import DropdownTreeSelect from "react-dropdown-tree-select";
// import {useRouteLoaderData} from 'react-router-dom'



// const onChange = (currentNode, selectedNodes) => {
//   console.log("path::", currentNode.path);
// };

// const assignObjectPaths = (obj, stack?) => {
//   Object.keys(obj).forEach(k => {
//     const node = obj[k];
//     if (typeof node === "object") {
//       node.path = stack ? `${stack}.${k}` : k;
//       assignObjectPaths(node, node.path);
//     }
//   });
// };

// const Dropdown = () => {
//     const clusterData: any = useRouteLoaderData('cluster');

//     const createItems = (clusterData) => {
//         const dataObj = {};
//         dataObj['Nodes'] = clusterData.nodes.forEach(node => {
//             node.uid = node.name;
//         })
//         dataObj['Namespaces'] = clusterData.namespaces.forEach(namespace => {
//                 namespace.uid = namespace.name;
//             })
//         return dataObj;
//     }
    
//     const data = createItems(clusterData)
//     console.log(data)
//     assignObjectPaths(data);

//   return (
//     <DropdownTreeSelect
//       data={data}
//       onChange={onChange}
//       className="dropdown"
//     />
//   );
// };

// export default Dropdown;
