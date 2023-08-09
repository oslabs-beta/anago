import { redirect } from 'react-router-dom';
import { StoreContext } from './stateStore';
import { useContext } from 'react';


export const dashboardLoader = async ({params}) => {
    
    
    const res = await fetch('/api/user', {
        method: 'GET'
    })

}

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
    const {setHasFetchedUserData}: any = useContext(StoreContext);
  const res = await fetch('/api/user', {
    method: 'GET',
  })
  setHasFetchedUserData(true);
 return res.json()
//   const userData = await res.json();
//   console.log('this is Userdata', userData.dashboards)
//   return userData;
  
};

export const alertLoader = async () => {
  const res = await fetch('/api/alerts', {
    method: 'GET',
  });
  return res.json();
};
