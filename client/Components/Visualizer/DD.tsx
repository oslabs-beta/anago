import React, {useState} from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { ClusterData } from '../../../types';


export function DropdownState () {
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false)
  const clusterData: any = useRouteLoaderData('cluster');




  const dataItems = (data :ClusterData) => {
    let dataObj = [{}];
    
    const nodeArray= data.nodes.map(node => {node.name})
    const namespaceArray = data.namespaces.map(namespace => {namespace.name})
    
    dataObj.push({Nodes: nodeArray}, {Namespaces: namespaceArray})

    console.log(dataObj)
    return dataObj;
  }

  const data = dataItems(clusterData);
  



  return (
    <fieldset className="dropdown">
      <button className="state-dropdown" onClick={()=>setIsDropdownDisplayed((prevState)=> !prevState)}> --Filter Your Cluster View--</button>
    {isDropdownDisplayed && 
    (<div className="panel">
      {clusterData.nodes.map(node => {
        return (
          <div> 
  
            <input type='checkbox' key={node.uid}/>
            <label htmlFor={node.uid}>{node.name}</label>

          </div>
        )
      })}
      {clusterData.namespaces.map(namespace => {
        return (
          <div> 
  
            <input type='checkbox' key={namespace.uid}/>
            <label htmlFor={namespace.uid}>{namespace.name}</label>

          </div>
        )
      })}
      </div>)
      }
    </fieldset>
  )
}