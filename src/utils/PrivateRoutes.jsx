import React from 'react'
import { useAuth } from '../context/authContext'

const PrivateRoutes = ({children}) => {
    const{user, loading} = useAuth()

    return(
        <div>
            
        </div>
    )
}

export default PrivateRoutes