const ClusterView = () => {
  const getPods = () => {
    try {
      fetch('/api/k8s', {
        method: 'GET',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p>This is the ClusterView page</p>
      <button onClick={getPods}>Get Default Pods</button>
    </div>
  );
};

export default ClusterView;
