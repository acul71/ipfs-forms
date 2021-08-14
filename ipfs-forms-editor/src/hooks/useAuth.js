import { useEffect, useState } from 'react'
import * as wn from 'webnative'

wn.setup.debug({ enabled: true })



export function useAuth() {
  const [state, setState] = useState(null)
  let fs;
  let publicKey;

  const authorise = () => {
    if (state) {
      wn.redirectToLobby(state.permissions)
    }
  }

  useEffect(() => {
    async function getState() {
      const result = await wn.initialise({
        permissions: {
          app: {
            name: 'ipfs-forms',
            creator: 'acul71',
          },
          // Ask the user permission to additional filesystem paths
          fs: {
            public: [ wn.path.directory("Form") ]
          }
        },
      })
      setState(result)
    }

    getState()
  }, [])
  
  async function setPublicKeyFile() {
    // If you're authenticated in fission, you can get the public key for getting data shared with you like so:
    const publicKeyBase64 = await wn.crypto.keystore.publicReadKey()
    console.log('publicKeyBase64=', publicKeyBase64)
    console.log('wn.crypto.keystore=', wn.crypto.keystore)
    // Save public Key in public/Forms/publicReadKey.rsa
    // https://{username}.files.fission.name/p/Form/publicReadKey.rsa
    const publicReadKeyExists = await fs.exists( wn.path.file("public", "Form", "publicReadKey.rsa") )
    if (!publicReadKeyExists) {
      const addRes = await fs.add( wn.path.file("public", "Form", "publicReadKey.rsa"),  publicKeyBase64)
      console.log('addRes=', addRes)
      const publishCID = await fs.publish()
      console.log('publicKey publish=', publishCID)
    }
  }

  switch (state?.scenario) {
    case wn.Scenario.AuthSucceeded:
    case wn.Scenario.Continuation:
      fs = state.fs;
      
      setPublicKeyFile()
      
      break;

    default:
      break;
  }

  return { authorise, fs, state, publicKey }
}




/*
const state = await wn.initialise({
    permissions: {
      // Will ask the user permission to store
      // your apps data in `private/Apps/Nullsoft/Winamp`
      app: {
        name: "Winamp",
        creator: "Nullsoft"
      },
  
      // Ask the user permission to additional filesystem paths
      fs: {
        private: [ wn.path.directory("Audio", "Music") ],
        public: [ wn.path.directory("Audio", "Mixtapes") ]
      }
    }
  
  }).catch(err => {
    switch (err) {
      case wn.InitialisationError.InsecureContext:
        // We need a secure context to do cryptography
        // Usually this means we need HTTPS or localhost
  
      case wn.InitialisationError.UnsupportedBrowser:
        // Browser not supported.
        // Example: Firefox private mode can't use indexedDB.
    }
  
  })
  
  
  switch (state.scenario) {
  
    case wn.Scenario.AuthCancelled:
      // User was redirected to lobby,
      // but cancelled the authorisation
      break;
  
    case wn.Scenario.AuthSucceeded:
    case wn.Scenario.Continuation:
      // State:
      // state.authenticated    -  Will always be `true` in these scenarios
      // state.newUser          -  If the user is new to Fission
      // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
      // state.username         -  The user's username.
      //
      // ☞ We can now interact with our file system (more on that later)
      state.fs
      break;
  
    case wn.Scenario.NotAuthorised:
      wn.redirectToLobby(state.permissions)
      break;
  
  }
*/