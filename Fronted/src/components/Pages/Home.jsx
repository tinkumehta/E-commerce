import { AuthContext } from "../../context/AuthContext";
import React, { useContext } from 'react'

function Home() {
    const {user, logout} = useContext(AuthContext);

  return (
    <div>
    <h1 className="m-5 flex justify-center">Product Sections</h1> 
    </div>
  )
}

export default Home