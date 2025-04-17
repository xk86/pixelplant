import React, { ReactNode, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { Turtle, drawOps, opDocs } from "./Turtle";
import { IAlphabet, VariableProperties, CommandTuple, DrawCommandTuples, 
         ProbTuple, applyRules, listToMapAlpha, computeSentence} from "./Lsystems";

import { prodAlphabet } from "./old_example_alphabets";

import { axiomAction, nameAction, variableAction, 
        constantAction, ProbabilisticEntry, 
        ConstantEntry,
        VariableEntry
        
        } from "./SymbolComponents/types";
import { Variables } from "./SymbolComponents/Variables";
import { Constants } from "./SymbolComponents/Constants";
import { Probs } from "./SymbolComponents/Probs";

import "./App.css";

//@ts-ignore
//const controls = ReactDOM.createRoot(document.getElementById("controls"));

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
interface CanvasProps {
  width: number;
  height: number;
  scale: number;
  iters: number;
  state: ReducerState;
}


function initAlphabetState(alphabet:IAlphabet) {
  return { alphabet: alphabet };
}

// Basic state interface
interface AlphabetState {
  alphabet: IAlphabet;
}

interface loadAction {
  type: "load";
  payload: AlphabetState
}

interface resetAction {
  type: "reset";
}

// Putting it all together...
type AllAction = nameAction
               | axiomAction
               | variableAction
               | constantAction
               | loadAction
               | resetAction;

function alphabetReducer(state: AlphabetState, action: AllAction) {
//  const newAlphabet = Object.assign({}, state.alphabet);
  let newAlphabet;
  switch(action.type) {
      case 'variable':
        newAlphabet = {
          alphabet: {
            ...state.alphabet,
            variables: {
              ...state.alphabet.variables,
              [action.payload.predecessor]: [action.payload.successor, action.payload.drawcmds]
            }
          }
        }
        return newAlphabet;
      case 'constant':
        newAlphabet = {
          alphabet: {
            ...state.alphabet,
            constants: {
              ...state.alphabet.constants,
              [action.payload.predecessor]: action.payload.drawcmds
            }
          }
        }
        return newAlphabet;
      case 'name':
        return { alphabet:
          {...state.alphabet,
           name: action.payload.name} }
      case 'axiom':
        return { alphabet: {...state.alphabet,
          axiom: action.payload.axiom} }
      case 'load':
        newAlphabet = action.payload;
        return newAlphabet;
      case 'reset':
        newAlphabet = initAlphabetState({...state.alphabet});
        return newAlphabet;
  }
}

//turtle.moveForward(1);
//turtle.x = 63;
//turtle.y = 63;
//applyRules("B", compute, 4);

function Name(props) {
  let t = {...props.alphabet}.name
  let [inputText, setInputText] = React.useState(t)
  console.log(inputText)

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value)
    setInputText(event.target.value)
    props.dispatch({type: 'name', payload: {name: inputText}})
  }
  const submit = (e) => {
    e.preventDefault();
    props.dispatch({
        type: "name",
        payload: {name: inputText},
      });
    props.dispatch({type: "reset", payload: {alphabet: props.alphabet}});
    }

  return (
    <div>
      <h1>{inputText}</h1>
      <h2>{props.alphabet.name}</h2>
      <form onSubmit={submit}><input type="text" value={inputText} onChange={(e)=>handleChange(e)}></input></form>
    </div>
  );
}

function Axiom(props) {
  let t = {...props.alphabet}.axiom
  let [inputText, setInputText] = React.useState(t)
  console.log(inputText)

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value)
    setInputText(event.target.value)
    props.dispatch({type: 'axiom', payload: {axiom: inputText}})
  }
  const submit = (e) => {
    e.preventDefault();
    props.dispatch({
        type: "axiom",
        payload: {axiom: inputText},
      });
    props.dispatch({type: "reset", payload: {alphabet: props.alphabet}});
    }

  return (
    <div>
      <form onSubmit={submit}><input type="text" value={inputText} onChange={(e)=>handleChange(e)}></input></form>
    </div>
  );
}

//function Variables(props) {
//  let ruleNames = Object.keys(props.alphabet.variables);
//  let rules = Object.values(props.alphabet.variables);
//  let rewrite = [];
//  for (let i = 0; i<rules.length; i++) {
//    rewrite = rewrite.concat(rules[i][0]);
//  }
//  let drawRules = [];
//  for (let i = 0; i<rules.length; i++) {
//    drawRules = drawRules.concat(rules[i][1]);
//  }
//  console.log(ruleNames, rewrite);
//
//  let nameListItems = ruleNames.map((rule) =>
//    <li key={rule}>
//      {rule}
//    </li>
//  );
//  return (<ol>{nameListItems}</ol>);
//}

interface ReducerState {
  alphabet: IAlphabet;
}

export interface ReducerProps {
  state: ReducerState;
  dispatch: Function;
}


function Controls({ state, dispatch }: ReducerProps) {
  //  console.log(alphabet);
  return (
    <div>
      <Name alphabet={state.alphabet} dispatch={dispatch}/>
      <Axiom alphabet={state.alphabet} dispatch={dispatch}/>
      <Variables state={state} dispatch={dispatch} />
      <Constants state={state} dispatch={dispatch}/>
      <Probs state={state} dispatch={dispatch} />
    </div>
  );
}

//const curalpha = probAlphabet;
//controls.render(<Alphabet alphabet={curalpha}/>)
//drawMany(3, turtle, "y", applyRules, computeSentence, 6, curalpha);

const Canvas = (props: CanvasProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const defaultColor = { r: 90, g: 194, b: 90, a: 0.6 };
  console.log(props);
  const alphabet = props.state.alphabet;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0,0,props.width, props.height);
    const turtle = new Turtle(
      props.width / 2,
      props.height,
      defaultColor,
      context
    );
    applyRules(turtle, alphabet.axiom, computeSentence, props.iters, alphabet);
  }, [props.iters, props.state.alphabet]);

  return (
    <canvas
      width={props.width}
      height={props.height}
      style={{
        margin: 8,
        width: props.width * props.scale,
        height: props.height * props.scale,
      }}
      ref={canvasRef}
    />
  );
};


function drawCmdsToString(t: DrawCommandTuples) {
  let retstr = "";
  for(let r of t) {
    retstr += (r + "; ")
  }
  return retstr;
}

function drawCmdsFromString(s: string) {
  for(let c of s) {
    let cmdStr = "";
    console.log(c);
  }
}

function CommandTupleInput({value, cmds}: {value: CommandTuple; cmds:string[]}):React.ReactElement[] {
  return(
    cmds.map((input, index) => {
      return(
        (input === value[0])?
          <option value={input}>{input}</option>
        :
          <option value={input}>{input}</option>
      )
    }
  ))
}



interface DrawSettings {
  width: number;
  height: number;
  scale: number;
  iters: number;
  count: number;
}

function DrawControls({settings, setFn, dispatch}) {
  let localSettings = {...settings}

  const handleFormChange = (index, event) => {
    console.log(508,event.target.value)
   if(index > 1) {
      dispatch({type: "reset"})
      localSettings = {...localSettings, [event.target.name]: parseInt(event.target.value)};
    } else {
      localSettings = {...localSettings, [event.target.name]: parseInt(event.target.value)};
    }
      setFn({...settings, [event.target.name]: parseInt(event.target.value)})

  //  console.log(509,setFn({...settings, [event.target.name]: settings[event.target.name]}));
 //   console.log(510,settings)
  }
  const submit = (e) => {
    e.preventDefault();
  }

  return(
    <div className="drawControls">
      <form onSubmit={submit}>
        <h3>Draw Settings</h3>
        {Object.keys(settings).map((input, index) => {
          return(<div key={index} className="drawSettings">
           {input}:
           <input name={input}
           placeholder={input}
           type="number"
           value={settings[input]}
           onChange={(event) => handleFormChange(index, event)}
           />
          <br />
          </div>);
        })}
      </form>

  </div> );


}

// Component for importing and exporting from/to string.
function ImpExport({state, dispatch}: ReducerProps) {
  const [inputValue, setInputValue] = React.useState(btoa(JSON.stringify({...state})));
  function exp() {
    setInputValue(btoa(JSON.stringify({...state})))
  }
  function imp() {
    console.log(JSON.parse(atob(inputValue)))
    dispatch({type: "load", payload: JSON.parse(atob(inputValue))})
    console.log(state.alphabet.axiom)
    dispatch({type: "reset"})

  }
  function submit(e) {
    e.preventDefault();
    imp()
  }
  return(<div className="impExport">
    <form onSubmit={submit}><input type="textArea" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input></form>
    <button onClick={exp}>Export Plant Settings</button>
    <button onClick={imp}>Import Plant Settings</button>
  </div>)
}


function App() {
  //  const [currentAlphabet, setCurrentAlphabet] = React.useState(exampleAlphabet);
  const [state, dispatch] = React.useReducer(
    alphabetReducer,
    prodAlphabet,
    //binaryTreeAlphabet,
    initAlphabetState
  );
  const [drawSettings, setDrawSettings] = React.useState({width: 150, height: 150, scale: 4, iters: 5, count: 1})
  console.log("render app");
  console.log(drawOps)
  return (
    <ErrorBoundary>
      <div className="container">
        <DrawControls settings={drawSettings} setFn={setDrawSettings} dispatch={dispatch}/>
        <Canvas width={drawSettings.width} height={drawSettings.height} scale={drawSettings.scale} iters={drawSettings.iters} state={state} />
        <Controls state={state} dispatch={dispatch} />
        <ImpExport state={state} dispatch={dispatch} />
      </div>
      <div className="documentation">
        <h1>Documentation</h1>
        <h2>Info about Experimental UI:</h2>
        <h3>Uh what are these letters and what do they have to do with the plants??????</h3>
        <p>The plants are drawn using procedures defined as L-systems, which are a family of rewriting rules, specifically made to replicate biological processes like cellular development.
          Each plant starts as a single sentence, called the "axiom".
          The characters (letters) in the axiom are replaced recursively (which means the result of the first replacement is used as the start for the next).
          So, if you have an axiom "{state.alphabet.axiom}", the rewriter will start with the first letter ("{state.alphabet.axiom[0]}"), and replace it with the successor string (found next to that letter in the controls interface), if it has one.
        </p>
        <p>
          After a certain number of iterations ({drawSettings.iters} right now, see: iters control in the top left), the plant will be drawn by a simple turtle language.
          The turtle reads each predecessor in the resulting string of the recursive rewrite process (usually very long, at least with complex rules) and executes the commands.
          You can view the commands and a brief description of what they do below.
        </p>
        <h3>Some notes about programming these things:</h3>
        <ul>
          <li>Predecessors are the single character letters that are read by the rewriter. They are the first, short box in each of the right hand controls.</li>
          <li>What happens to the predecessor when it's being read depends on what type of rule it is.</li>
          <li>Variable rules are rewritten by the successor strings (they come after the predecessors in the UI as well).</li>
          <li>Successor strings must be composed of valid predecessors, ie. they have to have been defined before.</li>
          <li>Constant rules are not rewritten (equivalent to a variable with a successor string of "")</li>
          <li>There are two special constants: '[' and ']'.</li>
          <li>No matter what you do (short of modifying the code), they will always push and pop the current turtle location, direction, and color</li>
          <li>Probabilistic rules do not have associated draw commands and have their preds replaced with a defined random chance.</li>
          <li>Probabilistic predecessors have lowercase names by arbitrary convention.</li>
          <li>Currently the Probs interface does not work. Savvy users should be able to manually edit the JSON from the exported string. (I wanted to get something out there for people to play with :))</li>
          <li>Each letter used in any successor string must be found in a predecessor slot (which is)</li>
        </ul>

        <h3>Other things to consider:</h3>
        <ul>
          <li>Currently can't remove draw commands (just use a nop if you add one by mistake)</li>
          <li>You also can't move them around</li>
          <li>Adding new rules and renaming preds is... weird (buggy). If you want to make a completely new alphabet, do it from scratch following the object structure and import it :)</li>
          <li>Object members don't update when settings are imported, though the drawing will change.</li>
          <li>Some controls don't work, like the Probabilistic controls, or the count option.</li>
          <li>Some state is wonky and might not get exported properly. Sorry about that :(</li>
          <li>Generally just expect bugs. I just wanted to get something kinda working so people can play around and share things.</li>
          <li>Be sure to hit Export to the right and copy the text above to share!</li>
        </ul>

        <h2>Drawing Operations</h2>
        <p>The plants are drawn with a simple turtle that reads the draw commands when reading the final string generated by the recursive application of the rules.
          A turtle is a simple way to draw graphics from a set of instructions.
          This turtle can rotate (clockwise <i>and</i> counterclockwise!) and move forward.
          It can also change its color.
        </p>
        <h4>Available drawing commands are:</h4>
        <ul>
          {drawOps.map((inp, idx) => (<li key={idx}><pre>{(inp !== "nop")? (inp+" n") : inp}</pre>-{opDocs[idx]}</li>))}
        </ul>
      </div>
    </ErrorBoundary>
  );
}
//for (let i = 0; i < data.length; i += 4) {
//  let x = (i / 4) % imageData.width;
//  let y = Math.floor((i / 4) / imageData.width);
//
//  data[i] = ((y == 5) && (x == 5)) ? 255 : 0 ;        //red
//  data[i+1] = 0; //green
//  data[i+2] = ((y == 5) && (x == 5)) ? 255 : 0; //blue
//  data[i+3] = 255;      //alpha
//}
//ctx.fillRect(15,30,1,2);
//ctx.fillRect(16,28,1,2);

export default App;
