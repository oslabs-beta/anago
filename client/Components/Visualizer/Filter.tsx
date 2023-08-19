import React, { useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

export function Filter() {
  const [isOuterOpen, setOuterOpen] = useState(false);
  const [isNsOpen, setNSOpen] = useState(false);
  const [isNodeOpen, setNodeOpen] = useState(false);
  //const [isActivePodOpen, setActivePodOpen] = useState(false);
  const [title, setTitle] = useState('     ');
  const clusterData: any = useRouteLoaderData('cluster');

  const outerOpen = () => setOuterOpen(true);
  const outerClose = () => setOuterOpen(false);
  const nsOpen = () => setNSOpen(true);
  const nsClose = () => setNSOpen(false);
  const nodeOpen = () => setNodeOpen(true);
  const nodeClose = () => setNodeOpen(false);
//   const activePodOpen = () => setActivePodOpen(true);
//   const activePodClose = () => setActivePodOpen(false);

  const handleClick = event => {
    setTitle(event.target.id);
  };

  return (
    <div className='dropdown'>
      <div className='filter-info'>
        <span style={{ display: 'inline-block' }}>
          <h2 style={{ display: 'inline-block' }}>{`Filter by: ${title}`}</h2>

          <button
            onMouseEnter={outerOpen}
            id='down-arrow'
            style={{ display: 'inline-block', float: 'right' }}>
            <strong>⌄</strong>
          </button>
        </span>
      </div>
      {isOuterOpen && (
        <div className='component-type'>
          <div onMouseEnter={nodeOpen} onMouseLeave={nodeClose}>
            <h3 className='node-dropdown'>Node</h3>
            {isNodeOpen &&
              clusterData.nodes.map(node => {
                return (
                  <h3 onClick={handleClick} id={node.uid}>
                    {node.name}
                  </h3>
                );
              })}
          </div>
          <div onMouseEnter={nsOpen} onMouseLeave={nsClose}>
            <h3 className='namespace-dropdown'>Namespace</h3>
            {isNsOpen &&
              clusterData.namespaces.map(namespace => {
                return (
                  <h5 onClick={handleClick} id={namespace.uid}>
                    {namespace.name}
                  </h5>
                );
              })}
          </div>
          {/* <div onMouseEnter={activePodOpen} onMouseLeave={activePodClose}>
            <h3 className='namespace-dropdown'>Active Pods</h3>
            {isActivePodOpen && (
              <div>
                <h3 onClick={handleClick} id={'Namespace: 1'}>
                  Namespace 1
                </h3>
                <h3 onClick={handleClick} id={'Namespace: 2'}>
                  Namespace 2
                </h3>
              </div>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}
