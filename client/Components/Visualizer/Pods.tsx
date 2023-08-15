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
  uid,
}) => {
  return (
    <div className='pod'>
      <h3>{name}</h3>
      <div>{containerStatuses}</div>
    </div>
  );
};

export default Pods;
