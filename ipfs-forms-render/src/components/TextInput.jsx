import React, { useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

// Using forwardRef and useImperativeHandle to make testInput() accessible from outside the component
// I'm checking the input from inside the component but 
// when you submit the form I need to check if test condition are valid
// in case the user click on submit without filling the form fields
const TextInput = React.forwardRef( (props, ref) => {
  let text = React.createRef()
  let textError = React.createRef()

  useImperativeHandle(ref, () => ({
    testInput: () => testInput()  
  }))

  const myQuestRes = [...props.questRes]

  function testInput() {
    const textVal = text.current.value
    //console.log(textVal)

    //props.setQuestRes(props.idx, textVal, true)
    console.log('testInput: props.questRes', props.questRes)
    //let myQuestRes = [...props.questRes]
    myQuestRes[props.idx] = {val: textVal, res: true}
    //props.setQuestRes(myQuestRes)
    //console.log('testInput: ', props.idx, myQuestRes[props.idx])
    if(props.isRequired) {
      if(textVal.trim().length === 0) {
        textError.current.textContent = 'This field is required'
        text.current.className = text.current.className.replace('is-valid', 'is-invalid')
        //props.setQuestRes(props.idx, textVal, false)
        //myQuestRes = [...props.questRes]
        myQuestRes[props.idx] = {val: textVal, res: false}
        //props.setQuestRes(myQuestRes)
        //console.log('testInput: inside isRequired', props.idx, myQuestRes[props.idx])
        //console.log('testInput: inside isRequired props.questRes=', props.questRes)
      } else {
        textError.current.textContent = ''
        text.current.className = text.current.className.replace('is-invalid', 'is-valid')
      }
    }
    props.setQuestRes(myQuestRes)
    console.log('testInput: myQuestRes=', myQuestRes)
    console.log('testInput: props.questRes=', props.questRes)
  }

  function handleChangeTextInput(e) {
    e.preventDefault()
    testInput()
  }

  return (
    <Form.Group className='ml-1 mt-3' controlId="textID">
      <Col sm={3}>
        <Form.Label className="text-center">{props.label}</Form.Label>
      </Col>
      <Col sm={4}>
        <Form.Control
            isInvalid={props.isRequired}
            onChange={handleChangeTextInput}
            type="text"
            placeholder={props.placeHolder}
            ref={text}
        />
      </Col>
      <Col sm={4}><p className="text-danger" ref={textError}></p></Col>
  </Form.Group>

  ) 
})

TextInput.prototype = {
  isRequired: PropTypes.bool.isRequired,
  placeHolder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  setQuestRes: PropTypes.object.isRequired
}

export default TextInput