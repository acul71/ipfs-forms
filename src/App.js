import React, {useRef} from 'react'
//import './App.css';
//import 'bootstrap/dist/css/boostrap.min.css'
import 'bootswatch/dist/darkly/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import FormTitle from './components/FormTitle'
import TextInput from './components/TextInput'


function App() {
  let submitErrorMsg = React.createRef()

  function handleSubmit() {
    console.log('questRes=', questRes)
    
    for (let i = 0; i < questRef.length; i++) {
      questRef[i].current.testTextInput()  
    }
    //questRef[1].current.testTextInput()
    //questRef[0].current.testTextInput()

    if (questRes.map(i => i.res).every(Boolean) === true) {
      // Handle submit
      console.log("Submitting form")
      submitErrorMsg.current.textContent = ''
    } else {
      console.log("Form rejected!")
      submitErrorMsg.current.textContent = 'Check that all fields are valid!'
    }

  }

  const form = {
    title: "Form Title",
    submitText: "Submit",
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
  

  /*
  return (
    <Container fluid="sm">
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormTitle title="Form Title" />
        <TextInput label="What is your name?" placeHolder="Insert text here" isRequired={true} idx={0} setQuestRes={setQuestRes}/>

        <TextInput label="What is your surname?" placeHolder="Insert text here" isRequired={true} idx={1} setQuestRes={setQuestRes}/>

        <Col sm={3}>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
        </Col>
        <Col sm={4}><p className="text-danger" ref={submitErrorMsg}></p></Col>

      </Form>
    </Container>
  )
  */
  let questComp

  
  const questRef = new Array(numOfQuest)
  
  /* eslint-disable */
  for(var i = 0; i < questRef.length; i++){
    questRef[i] = useRef()
  }
  /* eslint-enable */
  
  //questRef.forEach(val => {
  //  val = useRef()
  //});
  //questRef[0] = useRef()
  //questRef[1] = useRef()
  /*
  <TextInput label="Test useImperativeHandle 0 ?" placeHolder="Insert text here" isRequired={true} idx={2} setQuestRes={setQuestRes} ref={questRef[0]}/>
  <TextInput label="Test useImperativeHandle 1 ?" placeHolder="Insert text here" isRequired={true} idx={3} setQuestRes={setQuestRes} ref={questRef[1]}/>
  */


  return (
    <Container fluid="sm">
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
            console.log("questComp=", questComp)
            
            return questComp
          })
        }
        
        
        <Col sm={3}>
          <Button variant="primary" type="submit" onClick={handleSubmit}>{form.submitText}</Button>
        </Col>
        <Col sm={4}><p className="text-danger" ref={submitErrorMsg}></p></Col>

      </Form>
    </Container>
  )
  /*
  return (
    <div className="App">
      <header className="App-header">       
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
   */
}

export default App;
