// export const dashboardLoader = async () => {
//     const res = await fetch('/api/user', {
//         method: 'GET'
//     })

//     return res.json();

// }

export const metricsLoader = async () => {
    const res = await fetch('/api/metrics/')
}

export const userLoader = async () => {
    const res = await fetch('/api/user', {
        method: 'GET'
    })

    return res.json();
}

export const alertLoader =async () => {
    const res = await fetch('/api/alerts', {
        method: 'GET'
    })
    return res.json();
}