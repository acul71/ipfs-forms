import React, {useRef, useState, useEffect}  from 'react'

//import './App.css';
//import 'bootstrap/dist/css/boostrap.min.css'
import 'bootswatch/dist/darkly/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import FormTitle from './components/FormTitle'
import TextInput from './components/TextInput'

import {formEncrypt} from './lib/formCrypto'
import storeFiles from './lib/formWeb3Storage'


//const formCrypto = require('./lib/formCrypto')

import axios from 'axios'

function App() {
  let submitErrorMsg = React.createRef()
  
  //const [formSubmitted, setFormSubmitted] = useState(false)
  // formState: 0=loading 1=to fill 2=submitted
  const [formState, setFormState] = useState(0)
  const [form, setForm] = useState('')
  const [questRes, setQuestRes] = useState([])
  const [composerPublicKey, setComposerPublicKey] = useState('')


  

  async function handleSubmit() {
    //console.log('questRes=', questRes)
    
    console.log('questRef=', questRef)

    //for (let i = 0; i < questRef.length; i++) {
    for (let i = 0; i < form.quest.length; i++) {
      questRef[i].current.testInput()  
    }
    
    console.log('handleSubmit: questRes=', questRes)

    if (questRes.map(i => i.res).every(Boolean) === true) {
      // Handle submit
      console.log("Submitting form")
      submitErrorMsg.current.textContent = ''
      //
      // Prepare Form Result JSON to save in IPFS
      //
      // Get form data
      const formData = questRes.map( (elem) => elem.val )

      /*
      // Generate random password
      const aesKey= passwordGenerator()
      console.log('password=', aesKey)
      // Encrypt data with generated password
      console.log('formdata JSON=', JSON.stringify(formData))
      const encryptedFormData = aes256.encrypt( aesKey, JSON.stringify(formData) )
      // Encrypt aesKey (TODO)
      const composerEncryptedKey = aesKey
      */

      //const [composerEncryptedKey, encryptedFormData ] = await formEncrypt(composerPublicKey, formData)


      const formRes = await formEncrypt(composerPublicKey, formData)
      const formResString = JSON.stringify(formRes)

      // Save formRes to web3.storage
      const cid = await storeFiles(formResString, 'FormTest.json')

      console.log('formRes=', formRes)
      // Decrypt Test
      //console.log('decrypted form data=', aes256.decrypt(aesKey, formRes.formData))
      
      
      
      setFormState(2)
      
    } else {
      console.log("Form rejected!")
      submitErrorMsg.current.textContent = 'Check that all fields are valid!'
    }

  }

  

  


  /*
  const formId = 'form001'
  const form = {
    title: "Form Title",
    submitText: "Submit",
    formSubmittionMessage: 'Thanks, form submitted!',
    quest: [
      {
        type: "text",
        label: "What is your name?",
        placeHolder: "Insert text here",
        isRequired: false
      },
      {
        type: "text",
        label: "What is your surname?",
        placeHolder: "Insert text here",
        isRequired: true
      },
      {
        type: "text",
        label: "Where do you live?",
        placeHolder: "Insert text here",
        isRequired: true
      },
    ]
  }
  */


  
  // questComp is the question component parsed from json Form
  let questComp
    
  const formUrl = 'https://luca.files.fission.name/p/Form/FORM_1628993404351.json'
    
  //let questRes
  /*
  if (form === '') {
    questRes = getForm(formUrl)
    console.log('questRes after getForm=', questRes)
  }
  */
  // To be fixed (the number 100 is arbitrary. It should be set to form.quest.length But I have problems with useRef() )
  const questRef = new Array(100)
  
  //for(var i = 0; i < questRef.length; i++){
  // To be fixed
  // Disabling eslint hook check: It should be safe in this case (binding questRef array istances to useRef)
  /* eslint-disable */
  for(var i = 0; i < 100; i++){
    questRef[i] = useRef()
  }
  /* eslint-enable */
  
  /*
  function setQuestRes(idx, val, state) {
    questRes[idx] = {val: val, res: state}
    //questRes[idx].val = val
    //questRes[idx].res = state
  }
  */

  useEffect( () => {

    // Get composer public Key
    async function getComposerPublicKey(composerPublicKeyUrl='') {
      try {
        const composerPublicKeyFetch = await axios.get(composerPublicKeyUrl)
        console.log('getComposerPublicKey: composerPublicKey=', composerPublicKeyFetch.data)
        const composerPublicKey = composerPublicKeyFetch.data
        return composerPublicKey
      } catch (error) {
        console.error(error)
      }
    }

    // Get form Json
    async function getForm(formUrl='') {
      try {
        const formFetch = await axios.get(formUrl)
        console.log('getForm: form=', formFetch.data)
        const formData = formFetch.data

        const numOfQuest = formData.quest.length
        // questRes (arr of val,bool) contains all values and "check ok" for questions
        const wquestRes = [ ...Array(numOfQuest).keys() ].map( i => i = {val: '', res: false})
        //console.log("questRes=", questRes)

        // https://luca.files.fission.name/p/Form/publicReadKey.rsa
        const composerPublicKeyUrl = 'https://' + formData.composerUsername + '.files.fission.name/p/Form/publicReadKey.rsa'
        setComposerPublicKey( await getComposerPublicKey( composerPublicKeyUrl ) )
        setForm(formData)
        setFormState(1)
        setQuestRes(wquestRes)
        //return questRes
      } catch (error) {
        console.error(error)
      }

    }
    

    if (form === '') {
      // componentDidMount
      console.log("componentDidMount")
      getForm(formUrl)

    } else {
      // componentDidUpdate
      console.log("componentDidUpdate")
    }
  }, [form])






  if (formState === 0) {
    return (
      <Container fluid="sm">
        <p>Loading....</p>
      </Container>  
    )
  }
  // else
  return (
    <Container fluid="sm">
      { formState === 2 ? 
        <p>{form.formSubmittionMessage}</p>
      :
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormTitle title={form.title} />
          {
            form.quest.map((quest,idx) => {
              console.log("quest=", quest, questRes)
              
              switch (quest.type) {
                case 'text':
                  questComp = <TextInput key={idx} label={quest.label} placeHolder={quest.placeHolder} isRequired={quest.isRequired} idx={idx} questRes={questRes} setQuestRes={setQuestRes} ref={questRef[idx]}/> 
                  break;
                default:
                  break;
              }
              
              return questComp
            })
          }
          
          <Col sm={3}>
            <Button variant="primary" type="submit" onClick={handleSubmit}>{form.submitText}</Button>
          </Col>
          <Col sm={4}><p className="text-danger" ref={submitErrorMsg}></p></Col>

        </Form>
      }
    </Container>
  )
  
}

export default App;
