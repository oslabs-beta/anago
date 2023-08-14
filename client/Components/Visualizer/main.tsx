import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';

export default function Icosahedron(
  props: ThreeElements['icosahedronBufferGeometry'],
) {
  const ref = useRef<THREE.IcosahedronGeometry>(null!);
  const [hovered, hover] = useState(false);
  //const [clicked, click] = useState(false)
//   useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <Icosahedron
      {...props}
      ref={ref}
      scale={hovered ? 1.5 : 1}
      onPointerOver={event => hover(true)}
      onPointerOut={event => hover(false)}>
      {/* <icosahedronGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'blue'} /> */}
    </Icosahedron>
  );
}
// color={hovered ? 'hotpink' : 'orange'}
{
  /* <mesh>
          <boxGeometry args={[1, 1, 1]} />
        </mesh> */
}
