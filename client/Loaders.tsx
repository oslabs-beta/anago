// export const dashboardLoader = async () => {
//     const res = await fetch('/api/user', {
//         method: 'GET'
//     })

import { redirect } from 'react-router-dom';

//     return res.json();

// }

// export const metricsLoader = async ({metricIds}) => {
//     try {

//     } catch (err) {
//         console.log(err)
//     }

//     const res = await fetch('/api/metrics/', {
//         method: 'GET'
//     })
//     return res.json()
// }

export const userLoader = async () => {
  const res = await fetch('/api/user', {
    method: 'GET',
  })
  return res.json();
  //return redirect('/0');
};

export const alertLoader = async () => {
  const res = await fetch('/api/alerts', {
    method: 'GET',
  });
  return res.json();
};
