import React, {useState} from 'react';

export const StoreContext = React.createContext('null');

export default ({children}) => {


    const store = {};

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )

}

