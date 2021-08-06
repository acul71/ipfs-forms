import React from 'react'
import PropTypes from 'prop-types'

function FormTitle(props) {
  return (
    <h4>{props.title}</h4>
  )
}

FormTitle.propTypes = {
  title: PropTypes.string.isRequired
}

export default FormTitle

