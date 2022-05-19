import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { Turtle } from "./Turtle";
import { fernAlphabet, exampleAlphabet, binaryTreeAlphabet, probAlphabet, dragonCurveAlphabet, prodAlphabet,
         IAlphabet, VariableProperties, DrawCommandTuples, ProbTuple, applyRules, computeSentence} from "./Lsystems"
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

interface AlphabetState {
  alphabet: IAlphabet;
}

interface VarEl {
  predecessor: string;
  successor: string;
  drawcmds: DrawCommandTuples;
}

interface variableAction {
  type: "variable";
  payload: VarEl;
}
interface resetAction {
  type: "reset";
}


type AllAction = variableAction | resetAction;
//  switch (action.type) {
//    case "replaceVRw":
//      na = {
//        alphabet: {
//          ...state.alphabet,
//          variables: {
//            ...state.alphabet.variables,
//            [action.payload.target]: [action.payload.contents, state.alphabet.variables[action.payload.target][1]],
//          },
//        },
//      };
//      return na;
//    case "replaceVName":
//      na = {
//        alphabet: {
//          ...state.alphabet,
//          variables: {
//            ...state.alphabet.variables,
//            [action.payload.target]: [action.payload.contents, state.alphabet.variables[action.payload.target][1]],
//          },
//        },
//      };
//      return na;
//
//    case "reset":
//      return initAlphabetState(state.alphabet);
//  }

function alphabetReducer(state: AlphabetState, action: AllAction) {
//  const newAlphabet = Object.assign({}, state.alphabet);
  let na;
  switch(action.type) {
      case 'variable':
        console.log(511,action.payload);
        na = {
          alphabet: {
            ...state.alphabet,
            variables: {
              ...state.alphabet.variables,
              [action.payload.predecessor]: [action.payload.successor, action.payload.drawcmds]
            }
          }
        }
        return na;
      case 'reset':
        na = initAlphabetState(state.alphabet);
        console.log(526,na);
        return na;
  }
}

//turtle.moveForward(1);
//turtle.x = 63;
//turtle.y = 63;
//applyRules("B", compute, 4);

function Name(props) {
  return (
    <div>
      <h1>{props.alphabet.name}</h1>
    </div>
  );
}

function Axiom(props) {
  return (
    <div>
      <p>{props.alphabet.axiom}</p>
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

interface ReducerProps {
  state: ReducerState;
  dispatch: Function;
}

function Controls({ state, dispatch }: ReducerProps) {
  //  console.log(alphabet);
  return (
    <div>
      <Name alphabet={state.alphabet} />
      <Axiom alphabet={state.alphabet} />
      <Variables state={state} dispatch={dispatch} />
      <Constants state={state} dispatch={dispatch}/>
      <Probs state={state} dispatch={dispatch} />
    </div>
  );
}

const curalpha = probAlphabet;
//controls.render(<Alphabet alphabet={curalpha}/>)
//drawMany(3, turtle, "y", applyRules, computeSentence, 6, curalpha);

const Canvas = (props: CanvasProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const defaultColor = { r: 90, g: 194, b: 90, a: 0.6 };
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
    console.log(477);
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


function Variables({ state, dispatch }: ReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a:VarEl[] = [];
    let v = alphabet.variables;
    for (let r in v) {
      let vp:VariableProperties = v[r]
      let newfield:VarEl = {predecessor: r, successor: vp[0], drawcmds: vp[1]}
      a = [...a, newfield];
    }
    return a;
  };

  const [inputFields, setInputFields] = React.useState([...populateFields()]);

  const handleFormChange = (index: number, event) => {
    let data = [...inputFields];
    console.log(261,event.target.value)
//    console.log(668, data[index]);
    data[index][event.target.name] = event.target.value;
    dispatch({type: "variable", payload: {...data[index],
                                          [event.target.name]: event.target.value}}
    );
    setInputFields(data);
  };

  const addFields = () => {
    let newfield:VarEl= {predecessor: "", successor: "", drawcmds: []};
    setInputFields([...inputFields, newfield]);
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch({type: "reset"});
    for (let variable of inputFields) {
      dispatch({
        type: "variable",
        payload: variable,
      });
    }
  };

  //  populateFields();

  return (
    <div className="Variables">
      <form onSubmit={submit}>
        <h2>Variables</h2>
        {inputFields.map((input:VarEl, index:number) => {
          return (
            <div key={index} className="varItems">
              <input
                name="predecessor"
                placeholder="Predecessor"
                value={input.predecessor}
                maxLength={1}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="successor"
                placeholder="Successor"
                value={input.successor}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="draw"
                placeholder="Draw rule"
                value={drawCmdsToString(input.drawcmds)}
                onChange={(event) => handleFormChange(index, event)}
              />
            </div>
          );
        })}
        <br /> <br />
        <button type="button" onClick={addFields}>
          Add more...
        </button>
        <button>Submit</button>
      </form>
    </div>
  );
}

function Constants({ state, dispatch }: ReducerProps) {
  type ConstEl = [string, DrawCommandTuples];
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: ConstEl[] = [];
    let c = alphabet.constants;
    for (let r in c) {
      let newfield:ConstEl = [r, c[r]]
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };
  const [inputFields, setInputFields] = React.useState([...populateFields()]);
  const submit = (e) => {
    e.preventDefault();
    for (let i of inputFields) {
//      dispatch({
//        type: "replaceVRw",
//        payload: { target: i["rule"], contents: i["rewrite"] },
//      });
      console.log(i);
    }
    console.log(alphabet);
  };
  const addFields = () => {
    let newfield:ConstEl = ["", []];
    setInputFields([...inputFields, newfield]);
  };
  return (
    <div className="Constants">
      <form onSubmit={submit}>
        <h2>Constants</h2>
        {inputFields.map((input, index) => {
          return (
            <div key={index} className="constItems">
              <input
                name="rule"
                placeholder="Rule"
                value={input[0]}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="draw"
                placeholder="Draw rule"
                value={drawCmdsToString(input[1])}
                onChange={(event) => handleFormChange(index, event)}
              />
            </div>
          );
        })}
        <br />
        <button type="button" onClick={addFields}>
          Add more...
        </button>
        <button>Submit</button>
      </form>
    </div>
  );
}

function Probs({ state, dispatch }: ReducerProps) {
  type ProbEl = [string, ProbTuple[]];
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a:ProbEl[] = [];
    let p = alphabet.probs;
    for (let r in p) {
      let newfield:ProbEl = [r, p[r]];
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (index:number | [number, number], event) => {
    let data = [...inputFields];
    switch(event.target.name) {
        case 'branchRewrite':
          console.log(808,data[index[0]])
//          data[index[0]][1][index[1]][0] = event.target.value;
//          setInputFields(data);
        case 'rule':
          console.log(812,Object.keys(data))
//          data[index[0]][event.target.name] = event.target.value;
//          setInputFields(data);
    }
  };


  const [inputFields, setInputFields] = React.useState([...populateFields()]);
  const submit = (e) => {
    e.preventDefault();
    for (let i of inputFields) {
      dispatch({
        type: "replacePRw"
      })
//      dispatch({
//        type: "replaceVRw",
//        payload: { target: i["rule"], contents: i["rewrite"] },
//      });
    }
  };
  const addFields = () => {
    let newfield = ["", [["", 0]]];
    setInputFields([...inputFields, newfield]);
  };

  const branches = (bs:ProbTuple[], idx:number) => {
    let a:ProbTuple[] = [];
    for (let b of bs) {
      a = a.concat([b]);
    }
    return(a.map((input, index) => {
      return (
        <div key={index} className="probBranch">
          <input
            name="branchRewrite"
            placeholder="Branch Successor"
            value={input[0]}
            onChange={(event) => handleFormChange([idx, index], event)}
          />
          <input
            name="branchProb"
            placeholder="Branch Probability"
            value={input[1]}
            type="number"
            min="0"
            max="1"
            step="0.001"
            onChange={(event) => handleFormChange([idx, index], event)}
          />
        </div>
      );
    }
    ));
  }

  return (
    <div className="Probs">
      <form onSubmit={submit}>
        <h2>Probabalistic Rules</h2>
        {inputFields.map((input, index) => {
          return (
            <div key={index} className="probItems">
              <input
                name="predecessor"
                placeholder="Predecessor"
                value={input[0]}
                onChange={(event) => handleFormChange(index, event)}
              />
              {branches(input[1], index)}
              <button type="button" onClick={addFields}>
                +
              </button>
            </div>
          );
        })}
        <button type="button" onClick={addFields}>
          Add more...
        </button>
        <button>Submit</button>
      </form>
    </div>
  );

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

function App() {
  //  const [currentAlphabet, setCurrentAlphabet] = React.useState(exampleAlphabet);
  const [state, dispatch] = React.useReducer(
    alphabetReducer,
    prodAlphabet,
    initAlphabetState
  );
  const [drawSettings, setDrawSettings] = React.useState({width: 150, height: 150, scale: 4, iters: 5, count: 1})
  console.log("render app");
  return (
    <ErrorBoundary>
      <div className="container">
        <DrawControls settings={drawSettings} setFn={setDrawSettings} dispatch={dispatch}/>
        <Canvas width={drawSettings.width} height={drawSettings.height} scale={drawSettings.scale} iters={drawSettings.iters} state={state} />
        <Controls state={state} dispatch={dispatch} />
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
