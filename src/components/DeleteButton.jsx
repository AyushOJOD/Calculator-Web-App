import React from 'react'
import { ACTIONS } from '../Constant'

const DeleteButton = ({dispatch}) => {
  return (
    <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
  )
}

export default DeleteButton
