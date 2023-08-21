import React, { useState, useRef, useEffect, useContext } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { StoreContext } from '../../context/stateStore.tsx';

export function Dropdown() {
  const clusterData: any = useRouteLoaderData('cluster');
  const { selectedStates, setSelectedStates }: any = useContext(StoreContext);
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false);

  //set the default 'selected states' to include all nodes and namespaces returned from K8s API so the page initially loads with content
  const defaultStates = () => {
    let obj = {};
    clusterData.nodes.map(node => {
      obj[node.name] = false;
    });
    clusterData.namespaces.map(namespace => {
      obj[namespace.name] = false;
    });
    return obj;
  };

  //determine the number of nodes and namespaces that are selected from the dropdown and the total number of nodes and namespaces available. this creates a label for the dropdown bar that shows the proportion of available items are currently viewed
  const numSelected = Object.values(selectedStates).filter(Boolean).length;
  const numNodes = Object.keys(selectedStates).filter(
    item => item.charAt(0) === 'i' && selectedStates[item] === true,
  ).length;
  const numNamespaces = Object.keys(selectedStates).filter(
    item => item.charAt(0) !== 'i' && selectedStates[item] === true,
  ).length;
  const totalNodes = clusterData.nodes.length;
  const totalNamespaces = clusterData.namespaces.length;


  //handler function to close the dropdown if clicked outside of the dropdown window
  const dropdownRef = useRef(null);
  const onClick = e => {
    if (e.target !== dropdownRef.current) {
      setIsDropdownDisplayed(false);
    }
  };

  //upon component mounting, set the default selected states to the recieved API data, add an event listener to handle closing the dropdown with clicks outside of reference. remove event listener when component unmounts
  useEffect(() => {
    const base = defaultStates();
    setSelectedStates(base);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <fieldset className='dropdown'>
      <button
        className='state-dropdown'
        onClick={e => {
          e.stopPropagation();
          setIsDropdownDisplayed(prevState => !prevState);
        }}>
        {numSelected > 0
          ? `Nodes selected: ${numNodes}/${totalNodes}, Namespaces selected: ${numNamespaces}/${totalNamespaces}`
          : '--Filter Your Cluster View--'}
      </button>
      {isDropdownDisplayed && (
        <div
          className='panel'
          ref={dropdownRef}
          onClick={e => e.stopPropagation()}>
          <h4 className='dropdown-sublabel'>Nodes: </h4>
          {clusterData.nodes.map(node => {
            return (
              <div className='dropdown-items' key={node.uid}>
                <fieldset
                  className={selectedStates[node.name] ? `selected` : ''}>
                  <input
                    onChange={e =>
                      setSelectedStates({
                        ...selectedStates,
                        [node.name]: e.target.checked,
                      })
                    }
                    checked={selectedStates[node.name]}
                    type='checkbox'
                  />
                  <label htmlFor={node.uid}>{node.name}</label>
                </fieldset>
              </div>
            );
          })}
          <h4 className='dropdown-sublabel'>Namespaces: </h4>
          {clusterData.namespaces.map(namespace => {
            return (
              <div className='dropdown-items' key={namespace.uid}>
                <fieldset
                  className={selectedStates[namespace.name] ? `selected` : ''}>
                  <input
                    onChange={e =>
                      setSelectedStates({
                        ...selectedStates,
                        [namespace.name]: e.target.checked,
                      })
                    }
                    checked={selectedStates[namespace.name]}
                    type='checkbox'
                  />
                  <label htmlFor={namespace.uid}>{namespace.name}</label>
                </fieldset>
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
