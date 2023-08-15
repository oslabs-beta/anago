const Pods = ({
  conditions,
  containerStatuses,
  containers,
  creationTimestamp,
  labels,
  name,
  namespace,
  nodeName,
  phase,
  podIP,
  serviceAccount,
  id,
}) => {
  console.log(serviceAccount);

  return (
    <div className='pod' id={id}>
      <p>Pod</p>
      <h3>{name}</h3>
      <p>{phase}</p>
    </div>
  );
};

export default Pods;
