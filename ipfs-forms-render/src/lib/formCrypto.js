
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

async function mytest() {
  const publicKeyBase64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwWqzJ8BjEtNTBe8JnQGlcFH9ESG4+iNzSnbJoJFzN8zuF3IQTdQjSn3krclMqv1XzG2Uwe6Wd9OioVEtv4uiDvHlD7BtWI/Nl9j2ZX3jKEcl1foQ6H5iXdBSdRLu0t0csA2OkJ9lAF0hTS7dHY5jqRDZlgO7aUuIpMshQ8cLTCNXt4aqZd8aGZroUFxqSa90tWsc+3LoVtkUw1pjaZFzKO/k7HkNIe2yIcgr3qvJzppXZHHlOuCh6wGEBPE/Rl7cfRDEhf8Prb1lPP2YijijlXzUWP/f7y51UqqY+d6NU9T6t8uNHONhZQz0SFDOb1127eVvCXiMAHcUcfkPEH07NQIDAQAB'

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

  const privateKeyString = '-----BEGIN RSA PRIVATE KEY-----\n'
  +'MIIEowIBAAKCAQEA2AKBr2GwI8nftrVZ+jcql/1UOObIDO4AjNG1Xn6VwDQ41VOX\n'
  +'19BSb6l2Ux83ePJwrZDCuFMYVoU2uw4lb74oSXbXfeHL8BDWLb9w4QefsiuQrpzt\n'
  +'U/Pi/8TTgfR4KaDy750mgxeDd3F0N/2h+UmrexDZc0XVoQgWD+eljyRrbcCFyXOD\n'
  +'vFWsdGjwwDqq3I6BnSklMYCYxgaLyg6IPF38L//MWqoYlVmjsb0o2Y+gm06FunXp\n'
  +'qroW3MBBYwLVLmwGbHWsn0w0RSbKsj5NuOniwGf8QoDY07eq4RUP19Y4dAxEjcEW\n'
  +'WSU7C3PL5s275bwtjr502f9wDnsqQnt96g+yhQIDAQABAoIBAAXwe7Rg0UEKqfYS\n'
  +'Ink4zxkCxDAUWGfSm31DvuLsRB3W0cE73S738WxUkoZSk2nl8Kc1FcWPs1mdrBWU\n'
  +'m/7okZ8Df4Vckgj1zY3Qd8AYP5HclMvYUMZALHuv48js+ejbHhLslUSBfwHnwrRP\n'
  +'awa5uddWbUQ4JVmaKVEio3C+JZ4M4imCyfuiXFzEOwS6sjBXiunA8QQkm2GRzyO5\n'
  +'Z+nSnwxhZ51c5sOb7OpHEGhSqGfzGu9ijnu7jUxkxyycyi6CJJEaoY466gVUTyYx\n'
  +'0CEM7tgJfh+P19RCQY6AvoMxTiyCShGK8wbtRX/UQEAg/BKMMm4ch6+CyDMskMmz\n'
  +'UrhhZnkCgYEA/OrkxYPghmqPeia6m6tDVb2BfhfxifnuCp8a+Nesu+ILHB+WSFRc\n'
  +'DfaG1jNgGwtjQwgWEyxs85IBp+xq/Xckvpi8hbN9fHzrhkGIJ57sfSFKDTOrhGCk\n'
  +'kjajzbfl2bLsKNLDd0/HjaoAUQpCXbwsRwLT+kTVbJN5PI/uBgu70/8CgYEA2qR1\n'
  +'z8bB3SQwb+2klN6me4eYfArWcRSp4LOKMyk7yEKGuzPmnnV02DBGtHn+jEuDbYfT\n'
  +'x/Yy2f6WUIdcoYwLdfaAO4pI24w7xILCUgTQPEj6ZRsOPf0mKMDYiXM27I+fCCY/\n'
  +'LIzgCCVAU1BLIEnqHVbufEgZSoTX4gKpQMojKXsCgYAqkv/fn8tz1QxB67MN8U5s\n'
  +'aHIb37vxFflUIGRR7zxMhEiKe2a41jqIvy8Db7KF2uzio8HTiG7usW1F7y4zbJLq\n'
  +'4psZhpVhF0YuW2moAcCdb7Ufc8szhXEui7QXNRWkB9JpLNFqjCtzVWKoQanaTYrG\n'
  +'iVtVjbC/jjOiVjgjHGaJ0QKBgD4IXyyeNa6qb9uxzvo12YI+zHKVGJZoyHHqPpGZ\n'
  +'Z07AIT3H0eyvYoFb4ROfcSsY2acf3GRlY7QZ2Ufrv8pN04qab3N1Hoq71NFCUCO5\n'
  +'HeOcyP4amQXZZxQ08rq8p56iePp074OSTJXDC+cXZtk4X2YHng5A3nwYCLAlFSQ+\n'
  +'tY81AoGBAIn/aORvd6nI+crNpjhoCbHIXAA8qtljxFqh4HZ8VTkd0S+OkKGYKhX7\n'
  +'5/ztDkREjWqOHQNuqtG1k48gfh0EQvPGaUs4LBbeY0oCWdtoTjxU9cO3J1LlPbnb\n'
  +'K+gMJoREoM28PRYa7xUId2bmfr1ji6iGcc3XbpCR6/6UBA3enFip\n'
  +'-----END RSA PRIVATE KEY-----'


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
exports.mytest = mytest