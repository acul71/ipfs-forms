import React, { useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

//function TextInput(props) {
const TextInput = React.forwardRef( (props, ref) => {
  let text = React.createRef()
  let textError = React.createRef()

  useImperativeHandle(ref, () => ({
    testTextInput: () => testTextInput()  
  }))

  
  function testTextInput() {
    const textVal = text.current.value
    console.log(textVal)
    props.setQuestRes(props.idx, textVal, true)
    if(props.isRequired) {
      if(textVal.trim().length === 0) {
        textError.current.textContent = 'This field is required'
        text.current.className = text.current.className.replace('is-valid', 'is-invalid')
        props.setQuestRes(props.idx, textVal, false)
      } else {
        textError.current.textContent = ''
        text.current.className = text.current.className.replace('is-invalid', 'is-valid')
      }
    }
  }

  function handleChangeTextInput(e) {
    e.preventDefault()
    testTextInput()
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