import React, { useState } from 'react';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <div>
            <button className="bg-cyan-800 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Create new setup</button>
            {loggedIn ? (
                <button className="bg-cyan-800 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">My setups</button>) : null}
            {!loggedIn ? (
                <button className="bg-cyan-800 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded float-right">Register</button>
            ) : (
                <button className="bg-cyan-800 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded float-right">Logout</button>
            )}
        </div>
    )
  }
  
  export default Navbar;
  