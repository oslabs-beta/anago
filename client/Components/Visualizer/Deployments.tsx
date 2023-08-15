const Deployments = ({
  name,
  replicas,
  creationTimestamp,
  labels,
  namespace,
  id,
}) => {
  return (
    <div className='deployment'>
      <p>Deployment</p>
      <h3>{name}</h3>
      <p>{creationTimestamp}</p>
    </div>
  );
};

export default Deployments;
