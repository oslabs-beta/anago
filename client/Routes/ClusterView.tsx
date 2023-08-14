import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useLoaderData } from 'react-router-dom';
import Icosahedron from '../Components/Visualizer/main';

const ClusterView = () => {
  const clusterData = useLoaderData();
  console.log(clusterData);
  // const getCluster = async () => {
  //   try {
  //     const data = await fetch('/api/k8s/cluster', {
  //       method: 'GET',
  //     });
  //     const response = await data.json();
  //     console.log(response);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div>
      <p>This is the ClusterView page</p>
    </div>
  );
};

export default ClusterView;

      // <Canvas>
      //   <ambientLight />
      //   <pointLight position={[10, 10, 10]} />
      //   <Icosahedron position={[-1.2, 0, 0]} />
      //   {/* <Box position={[1.2, 0, 0]} /> */}
      // </Canvas>
      // ,