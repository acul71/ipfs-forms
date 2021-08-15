
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
//const WEB3STORAGE_TOKEN = require('./WEB3STORAGE_TOKEN')


function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an 
  // environement variable or other configuration that's kept outside of 
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  //return process.env.WEB3STORAGE_TOKEN
  return 'Insert your WEB3STORAGE_TOKEN Here'
  //return WEB3STORAGE_TOKEN
}
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}
console.log('WEB3STORAGE_TOKEN=', getAccessToken())

async function storeFiles(formResString, formFileName) {
  const client = makeStorageClient()
  const files = createFile(formResString, formFileName)
  //const files = createFile(formResString)
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

function createFile(formResString='', formFileName='hello.json') {
  const blob = new Blob([formResString], {type : 'application/json'})
  const files = [
    new File([blob], formFileName)
  ]
  return files
}




//exports.storeFiles = storeFiles
export default storeFiles