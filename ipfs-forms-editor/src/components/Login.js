import React from 'react'

import { useAuth } from '../hooks/useAuth'


const Login = () => {
  const { authorise } = useAuth()

  return (
    <div>
      <header className="header">
        <h1>ipfs-form editor</h1>
      </header>
      <section className="main">
        <button
          style={{
            position: 'relative',
            color: '#b83f45',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            cursor: 'pointer',
            fontSize: '20px'
          }}
          onClick={() => authorise()}
        >
          <h2>Sign in with Fission</h2>
        </button>

      </section></div>
  );
}

export default Login;