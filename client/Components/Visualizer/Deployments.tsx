const Deployments = ({name, replicas, creationTimestamp, labels, namespace, id}) => {

    return(
        <div className="deployment">
            <h3>{name}</h3>
            <p>{replicas}</p>
            <p>{creationTimestamp}</p>
        </div>
    )



}

export default Deployments;