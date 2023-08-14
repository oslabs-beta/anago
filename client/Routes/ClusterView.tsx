import { useLoaderData } from 'react-router-dom';

const ClusterView = () => {
  const clusterData = useLoaderData();
  console.log(clusterData);

  return (
    <div>
      <p>This is the ClusterView page</p>
    </div>
  );
};

export default ClusterView;
