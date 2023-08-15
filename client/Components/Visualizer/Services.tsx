const Services = ({name, loadBalancer, creationTimestamp, labels, namespace, ports, id}) => {

    return(
        <div className="service">
            <h4>{name}</h4>
            <p>{ports}</p>
        </div>
    )



}

export default Services;