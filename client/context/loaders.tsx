//fetch initial userData upon page load and pass to dashboard and metric display components
export const userLoader = async () => {
  try {
    const res = await fetch('/api/user', {
      method: 'GET',
    });
    return res.json();
  } catch (err) {
    console.error('user loader error: ', err);
  }
};

//fetch cluster information from kubernetes API and pass to visualizer components
export const clusterLoader = async () => {
  const res = await fetch('api/k8s/cluster');
  return res.json();
};
