import React from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../hooks/useAuth'
import * as wn from 'webnative'



function  FormEditor(props) {
  const { fs, state } = useAuth()
  let formUrlText = React.createRef()
  let formTextarea = React.createRef()

  const createForm = async () => {
    console.log('create form button clicked!')
    formUrlText.current.textContent = 'Working.....'
    
    const content = formTextarea.current.value
    console.log('content=', content)
    const username = state.username
    console.log('username=', username)
    const formFileName = 'FORM_' + Date.now().toString() + '.json'
    const addRes = await fs.add( wn.path.file("public", "Form", formFileName), content)
    console.log('addRes=', addRes)
    const publishCID = await fs.publish()
    console.log('publish=', publishCID)
    const formURL = 'https://ipfs.runfission.com/ipfs/' + publishCID + '/p/Form/' + formFileName 
    console.log('formURL=', formURL)
    // https://luca.files.fission.name/p/Form/publicReadKey.rsa
    const formURL2 = 'https://' + username + '.files.fission.name/p/Form/' + formFileName
    console.log('formURL2=', formURL2)
    formUrlText.current.textContent = formURL2
  }

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

  const formStr = JSON.stringify(form,null,2)
  
  

  return (
    <div>
      <h2>Form Editor</h2>
      <textarea rows="28" cols="60" ref={formTextarea}>{formStr}</textarea>
      <p></p>
      <button onClick={() => createForm()}>Create Form</button>
      <p></p>
      <p ref={formUrlText}></p>
    </div>
  )
}

FormEditor.propTypes = {

}

export default FormEditor

