import { useReducer } from "react";
import "../src/styles/App.css"
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import DeleteButton from "./components/DeleteButton";
import { ACTIONS } from "./Constant";



function reducer(state,{type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT :
      if(state.overwrite){
        return{
          ...state ,
          currentOp: payload.digit,
          overwrite: false
        }
      }

      if(payload.digit === "0" && state.currentOp === "0"){
        return state;
      }
      if(payload.digit === "." && state.currentOp.includes(".")){
        return state;
      }
      return { 
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOp == null && state.previousOp == null){
        return state;
      }

      if(state.currentOp == null){
        return {...state , operation: payload.operation};
      }

      if(state.previousOp == null){
        return{
          ...state,
          operation: payload.operation,
          previousOp: state.currentOp,
          currentOp: null
        }
      }

      return {
        ...state,
        previousOp: evaluate(state),
        operation: payload.operation,
        currentOp: null
      }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
      if(state.currentOp == null || state.previousOp == null || state.operation == null){
        return state;
      }

      return{
        ...state,
        overwrite: true,
        previousOp: null,
        operation: null,
        currentOp: evaluate(state),
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOp:null
        };
      }

      if(state.currentOp == null){
        return state
      }

      if(state.currentOp.length === 1){
        return{
          ...state,
          currentOp: null
        }
      }

      return{
        ...state,
        currentOp: state.currentOp.slice(0,-1),
      }
    default:
      return state;
  }
}

function evaluate({currentOp, previousOp, operation}){
  const prev = parseFloat(previousOp);
  const curr = parseFloat(currentOp);

  let res = "";

  if(isNaN(prev) || isNaN(curr)){
    return "";
  }

  switch(operation){
    case "+":
      res = prev+curr;
      break;
    case "-":
      res = prev-curr;
      break;
    case "*":
      res = prev*curr;
      break;
    case "÷":
      res = prev / curr;
      break;
  }

  return res.toString();
}

function formatInt(operand){
  if(operand == null) return
   
  const [integer, decimal] = operand.split(".");
  if(decimal == null){
    return INT_FORMAT.format(integer);
  }

  return `${INT_FORMAT.format(integer)}.${decimal}`
}

const INT_FORMAT = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

function App() {
  const [{currentOp, previousOp, operation}, dispatch] = useReducer(reducer,{});
  return (
    <div className='calculator-grid'>
      <div className="output">
        <div className="prev-op">{formatInt(previousOp)}{operation}</div>
        <div className="new-op">{formatInt(currentOp)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <DeleteButton dispatch={dispatch}/>
      <OperationButton operation='÷' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      
    </div>
  );
}

export default App;
