const Services = ({
  name,
  loadBalancer,
  creationTimestamp,
  labels,
  namespace,
  ports,
  id,
}) => {
  return (
    <div className='service'>
      <p>Service</p>
      <h4>{name}</h4>
      <p>{creationTimestamp}</p>
    </div>
  );
};

export default Services;
