import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from './Home'
import { AuthContext } from './context/AuthContext'
import Login from './Login'



const App = () => {

    const { currentUser } = useContext(AuthContext)

    // const ProtectedRoute = ({ children }) => {
    //     if (!currentUser) {
    //         return <Navigate to="/login" />
    //     }
    //     return children;
    // };
    return (
        <div>
            <Routes>
                <Route path="/" element={
                    <Home />
                } />
                {/* <Route path='/login' element={<Login />} /> */}
            </Routes>

        </div>
        
    )
}

export default App
