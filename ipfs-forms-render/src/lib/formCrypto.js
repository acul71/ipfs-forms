
const aes256 = require('aes256')


//const crypto = require('crypto').webcrypto
const crypto = window.crypto
/*
const crypto =
        // nodejs v15+
        (globalThis.crypto as any).webcrypto?.subtle
        // browser
        || globalThis.crypto.subtle
*/

const uint8arrays = require('uint8arrays')

async function formEncrypt(publicKeyBase64='', formData=[]) {
  //const publicKeyBase64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwWqzJ8BjEtNTBe8JnQGlcFH9ESG4+iNzSnbJoJFzN8zuF3IQTdQjSn3krclMqv1XzG2Uwe6Wd9OioVEtv4uiDvHlD7BtWI/Nl9j2ZX3jKEcl1foQ6H5iXdBSdRLu0t0csA2OkJ9lAF0hTS7dHY5jqRDZlgO7aUuIpMshQ8cLTCNXt4aqZd8aGZroUFxqSa90tWsc+3LoVtkUw1pjaZFzKO/k7HkNIe2yIcgr3qvJzppXZHHlOuCh6wGEBPE/Rl7cfRDEhf8Prb1lPP2YijijlXzUWP/f7y51UqqY+d6NU9T6t8uNHONhZQz0SFDOb1127eVvCXiMAHcUcfkPEH07NQIDAQAB'

  const sessionKey = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256
    },
    true, // marked as exportable
    ["encrypt", "decrypt"]
  )
  // Import the recipient's public key into webcrypto:
  const RSA_KEY_ALGO = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" }
  }
  const recipientPubKey = await crypto.subtle.importKey(
    "spki",
    // I recommend the uint8arrays library
    uint8arrays.fromString(publicKeyBase64, "base64pad").buffer,
    RSA_KEY_ALGO,
    false,
    ["encrypt"]
  )
  // export your symmetric encryption key
  const sessionKeyRaw = await crypto.subtle.exportKey("raw", sessionKey)
  console.log('sessionKeyRaw=', sessionKeyRaw)
  // Encrypt the symmetric encryption key for the recipient
  const encryptedSessionKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientPubKey,
    sessionKeyRaw
  )
  console.log('encryptedSessionKey=', encryptedSessionKey)
  
  // encrypt form data
  let enc = new TextEncoder()
  const encoded = enc.encode(JSON.stringify(formData))
  // iv will be needed for decryption
  const iv = crypto.getRandomValues(new Uint8Array(12));
  console.log('iv=', iv)
  console.log('sessionKey=', sessionKey)
  const ciphertext =  await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    sessionKey,
    encoded
  )
  console.log('ciphertext=', ciphertext)

  //let buffer = new Uint8Array(ciphertext, 0, 5)
  const encryptedFormData = new Uint8Array(ciphertext, 0, 5)

  //
  // Test decrypt
  //
  const formRes = {
    //formId: formId,
    algorithm: {
      name: "AES-GCM",
      iv:  uint8arrays.toString(iv, "base64pad")
    },
    encryptedSessionKey: uint8arrays.toString(new Uint8Array(encryptedSessionKey), "base64pad"),
    //encryptedSessionKey: sessionKey,
    formData: uint8arrays.toString(new Uint8Array(ciphertext), "base64pad"),
    //formData: ciphertext
  }

  console.log('formRes=', formRes)
  const formResString = JSON.stringify(formRes)
  console.log('formResString', formResString)
  
  // Decrypt with json string
  const formResJson = JSON.parse(formResString)
  //formResJson.algorithm.iv = uint8arrays.fromString(formResJson.algorithm.iv, "base64pad").buffer
  formResJson.algorithm.iv = uint8arrays.fromString(formResJson.algorithm.iv, "base64pad")
  formResJson.formData = uint8arrays.fromString(formResJson.formData, "base64pad").buffer

  console.log('formResJson', formResJson)
  /*
  const jsonDecrypted = await crypto.subtle.decrypt(
    formResJson.algorithm,
    formResJson.composerEncryptedKey,
    formResJson.formData
  )
  const jsonDec = new TextDecoder()
  const jsonDecryptedFormData = jsonDec.decode(jsonDecrypted)
  console.log('jsonDecryptedFormData=', jsonDecryptedFormData)  
  */
  
  // Decrypt example
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      //iv: iv
      iv: formResJson.algorithm.iv
    },
    sessionKey,
    //ciphertext
    formResJson.formData
  )

  const dec = new TextDecoder()
  const decryptedFormData = dec.decode(decrypted)

  console.log('decryptedFormData=', decryptedFormData)

  //return [encryptedSessionKey, encryptedFormData]
  return formRes
  
}



/*
const publicKeyString = '-----BEGIN RSA PUBLIC KEY-----\n'+
    'MIICCgKCAgEAuuqCU5cTiVEb7iiBvlxtT0Vb8uj/AN6vuHe70ga9+5E0QODqTPdE\n'+
    'c0zbfGwP70m4I2a4as3HlEX1YustDr2+4uexArMMrgc51S5TVY0qkEePVaREbItv\n'+
    'TmSD/u6QEs2qi68TpT5VL+nJTHo7dq0JBT3lWu5LFNoeJXzQdE5gHP4XL2THSnFg\n'+
    'zU10OBSTjyFHyDUDbqAJXUP1+yg/ED14GMS5JVfCFvrdbB8IenH7yLRFYK/moHk6\n'+
    '3XujlWfiLiTU3BeyVjtfsjzObBBUHo6noBpMnwzZ9bbPTYSU9pZ0mTWyLYX4LqWh\n'+
    'NuqLj0PjBRnKmrfe/lt2vVmy8dJ8bQ0j5QwcGugWRniZsqcHlEyUxDECt4nobpY1\n'+
    'gkgAg1OLOQTy483OnUmSlOXeyw0eNH+zFf7DYhWVPt12ElIbQfUBls4DZs4+X+lC\n'+
    'WLFTW+5fAMbR8kmAxqhWZuGXFVbzNT0oU5HaY9iiDaVA4rkmnUDxvOgyx3sOZ2kZ\n'+
    'i5P5WwWl8yKb6BoE+esMsnDbFZ+XlqVMUX8Gxw/zQeNneLIvBmxKmNSpR/JonuiC\n'+
    'IIfFK+noh9P+4JR3EFS8b3emnE3A8U6KpRWmgJjpZiJQ7sdnW8ULuggX4+5l1cdw\n'+
    'eB4BG2CihTZL9/lOhNgJA0qKR6WT3PLga8AhuJLevhsu5o7gZZaA/t8CAwEAAQ==\n'+
    '-----END RSA PUBLIC KEY-----';
*/
/*
  //const publicKeyString = '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEA2AKBr2GwI8nftrVZ+jcql/1UOObIDO4AjNG1Xn6VwDQ41VOX19BS\nb6l2Ux83ePJwrZDCuFMYVoU2uw4lb74oSXbXfeHL8BDWLb9w4QefsiuQrpztU/Pi\n/8TTgfR4KaDy750mgxeDd3F0N/2h+UmrexDZc0XVoQgWD+eljyRrbcCFyXODvFWs\ndGjwwDqq3I6BnSklMYCYxgaLyg6IPF38L//MWqoYlVmjsb0o2Y+gm06FunXpqroW\n3MBBYwLVLmwGbHWsn0w0RSbKsj5NuOniwGf8QoDY07eq4RUP19Y4dAxEjcEWWSU7\nC3PL5s275bwtjr502f9wDnsqQnt96g+yhQIDAQAB\n-----END RSA PUBLIC KEY-----'

  const publicKeyString = '-----BEGIN RSA PUBLIC KEY-----\n'
  +'MIIBCgKCAQEA2AKBr2GwI8nftrVZ+jcql/1UOObIDO4AjNG1Xn6VwDQ41VOX19BS\n'
  +'b6l2Ux83ePJwrZDCuFMYVoU2uw4lb74oSXbXfeHL8BDWLb9w4QefsiuQrpztU/Pi\n'
  +'/8TTgfR4KaDy750mgxeDd3F0N/2h+UmrexDZc0XVoQgWD+eljyRrbcCFyXODvFWs\n'
  +'dGjwwDqq3I6BnSklMYCYxgaLyg6IPF38L//MWqoYlVmjsb0o2Y+gm06FunXpqroW\n'
  +'3MBBYwLVLmwGbHWsn0w0RSbKsj5NuOniwGf8QoDY07eq4RUP19Y4dAxEjcEWWSU7\n'
  +'C3PL5s275bwtjr502f9wDnsqQnt96g+yhQIDAQAB\n'
  +'-----END RSA PUBLIC KEY-----'

  const privateKeyString = ''


  let publicKey = {
    key: publicKeyString,
    //padding: crypto.constants.RSA_PKCS1_PADDING
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
  }
  console.log('publicKey', publicKey)
  //let encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from("my secret data")).toString('base64')
  let encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from("my secret data"))
  console.log("encryptedMessage=", encryptedMessage);

  let privateKey = {
    key: privateKeyString,
    //padding: crypto.constants.RSA_PKCS1_PADDING
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
  }
  let decryptedMessage = crypto.publicDecrypt(privateKey, encryptedMessage)
  console.log('decryptedMessage=', decryptedMessage)


  /*
  // This is the data we want to encrypt
  const data = "my secret data";
  const pubKey = '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEA2AKBr2GwI8nftrVZ+jcql/1UOObIDO4AjNG1Xn6VwDQ41VOX19BS\nb6l2Ux83ePJwrZDCuFMYVoU2uw4lb74oSXbXfeHL8BDWLb9w4QefsiuQrpztU/Pi\n/8TTgfR4KaDy750mgxeDd3F0N/2h+UmrexDZc0XVoQgWD+eljyRrbcCFyXODvFWs\ndGjwwDqq3I6BnSklMYCYxgaLyg6IPF38L//MWqoYlVmjsb0o2Y+gm06FunXpqroW\n3MBBYwLVLmwGbHWsn0w0RSbKsj5NuOniwGf8QoDY07eq4RUP19Y4dAxEjcEWWSU7\nC3PL5s275bwtjr502f9wDnsqQnt96g+yhQIDAQAB\n-----END RSA PUBLIC KEY-----'
  key = {
    key: pubKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  }
  
  const encryptedData = crypto.publicEncrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data)
  );
  
  console.log('encryptedData=', encryptedData)
  */


// https://github.com/bermi/password-generator
const generatePassword = require("password-generator")

const passwordGenerator = (maxLength=18, minLength=12, uppercaseMinCount=3, lowercaseMinCount=3, numberMinCount=2, specialMinCount=2) => {
  const UPPERCASE_RE = /([A-Z])/g
  const LOWERCASE_RE = /([a-z])/g
  const NUMBER_RE = /([\d])/g
  const SPECIAL_CHAR_RE = /([?-])/g
  const NON_REPEATING_CHAR_RE = /([\w\d?-])\1{2,}/g

  function isStrongEnough(password) {
    const uc = password.match(UPPERCASE_RE)
    const lc = password.match(LOWERCASE_RE)
    const n = password.match(NUMBER_RE)
    const sc = password.match(SPECIAL_CHAR_RE)
    const nr = password.match(NON_REPEATING_CHAR_RE)
    return password.length >= minLength &&
      !nr &&
      uc && uc.length >= uppercaseMinCount &&
      lc && lc.length >= lowercaseMinCount &&
      n && n.length >= numberMinCount &&
      sc && sc.length >= specialMinCount
  }

  function customPassword() {
    let password = ""
    const randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength
    while (!isStrongEnough(password)) {
      //password = generatePassword(randomLength, false, /[\w\d\?\-]/);
      password = generatePassword(randomLength, false, /[\w\d?-]/)
    }
    return password
  }

  //console.log(customPassword()); // => 2hP5v?1KKNx7_a-W
  return customPassword()
}

//console.log(passwordGenerator())

//export default passwordGenerator
exports.passwordGenerator = passwordGenerator
exports.aes256 = aes256
exports.formEncrypt = formEncrypt