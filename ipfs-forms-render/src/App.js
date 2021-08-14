import React, {useRef, useState}  from 'react'

//import './App.css';
//import 'bootstrap/dist/css/boostrap.min.css'
import 'bootswatch/dist/darkly/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import FormTitle from './components/FormTitle'
import TextInput from './components/TextInput'

import {passwordGenerator, aes256, mytest} from './lib/formCrypto'

//const formCrypto = require('./lib/formCrypto')

function App() {
  let submitErrorMsg = React.createRef()
  
  const [formSubmitted, setFormSubmitted] = useState(false)

  

  function handleSubmit() {
    console.log('questRes=', questRes)
    
    for (let i = 0; i < questRef.length; i++) {
      questRef[i].current.testInput()  
    }
    

    if (questRes.map(i => i.res).every(Boolean) === true) {
      // Handle submit
      console.log("Submitting form")
      submitErrorMsg.current.textContent = ''
      //
      // Prepare Form Result JSON to save in IPFS
      //
      // Get form data
      const formData = questRes.map( (elem) => elem.val )
      // Generate random password
      const aesKey= passwordGenerator()
      console.log('password=', aesKey)
      // Encrypt data with generated password
      console.log('formdata JSON=', JSON.stringify(formData))
      const encryptedFormData = aes256.encrypt( aesKey, JSON.stringify(formData) )
      // Encrypt aesKey (TODO)
      const composerEncryptedKey = aesKey
      
      const formRes = {
        formId: formId,
        composerEncryptedKey: composerEncryptedKey,
        formData: encryptedFormData,
      }
      
      console.log('formRes=', formRes)
      // Decrypt Test
      console.log('decrypted form data=', aes256.decrypt(aesKey, formRes.formData))

      mytest()
      
      setFormSubmitted(true)
      
    } else {
      console.log("Form rejected!")
      submitErrorMsg.current.textContent = 'Check that all fields are valid!'
    }

  }

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

  const numOfQuest = form.quest.length
  // questRes (arr of val,bool) contains all values and "check ok" for questions
  const questRes = [ ...Array(numOfQuest).keys() ].map( i => i = {val: '', res: false})
  //console.log("questRes=", questRes)

  function setQuestRes(idx, val, state) {
    questRes[idx] = {val: val, res: state}
    //questRes[idx].val = val
    //questRes[idx].res = state
  }
  
  // questComp is the question component parsed from json Form
  let questComp
  const questRef = new Array(numOfQuest)
  
  // Disabling eslint hook check: It should be safe in this case (binding questRef array istances to useRef)
  /* eslint-disable */
  for(var i = 0; i < questRef.length; i++){
    questRef[i] = useRef()
  }
  /* eslint-enable */
  

  return (
    <Container fluid="sm">
      { formSubmitted ? 
        <p>{form.formSubmittionMessage}</p>
      :
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormTitle title={form.title} />
          {
            form.quest.map((quest,idx) => {
              console.log("quest=", quest)
              
              switch (quest.type) {
                case 'text':
                  questComp = <TextInput key={idx} label={quest.label} placeHolder={quest.placeHolder} isRequired={quest.isRequired} idx={idx} setQuestRes={setQuestRes} ref={questRef[idx]}/> 
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
