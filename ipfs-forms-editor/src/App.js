import React from "react";
import './App.css';
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import FormEditor from "./components/FormEditor";
const crypto = require("crypto")
const aes256 = require('aes256')

function App() {
  const { state, publicKey } = useAuth()
  console.log('state=', state)
  console.log('publicKey=', publicKey)
  if (state) {
    if (state?.authenticated) {
      return (
        
          <React.Fragment>
            <div className="todoapp">
              <FormEditor />
            </div>
          </React.Fragment>
        
      );
    }
    else {
      return (
        <div className="todoapp">
          <Login/>
        </div>
      );
    }
  }
  return <div>Loading...</div>
}

export default App;
