import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { Turtle, Color, clamp } from "./Turtle";
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

function applyRules(t, sentence, fn, n, alphabet) {
  let end = sentence;
  for (var i = 1; i <= n; i++) {
    //console.log(end);
    end = fn(end, alphabet);
    if (i == n) {
      draw(end, t, alphabet);
    }
  }
  return end;
}

type CommandTuple = [string, number] | ["nop"];

type DrawCommandTuples = CommandTuple[];

type VariableProperties = [string, DrawCommandTuples];

type Variable = { [name: string]: VariableProperties };

type Constant = { [name: string]: DrawCommandTuples };

type ProbTuple = [string, number];

type Prob = { [name: string]: ProbTuple[] };

interface IAlphabet {
  name: string;
  atomic: string;
  variables: Variable;
  constants: Constant;
  probs?: Prob;
}

const exampleAlphabet: IAlphabet = {
  // Fields: name, atomic, variables, constants, probs
  name: "Example/Documentation Alphabet",

  // Starting sentence.
  atomic: "B",

  // The keys of the following data structures should be single characters and are read by computeSentence(); recursively.
  //
  // variables: Characters that are re-written by the string in [0]. The rewrite string should only contain characters defined in variables, constants, or probs
  //   The array (value[1]) of arrays correspond to turtle commands run by draw()
  //   see draw() for documentation on DSL.
  variables: {
    C: ["CC", [["fwd", 2]]],
    B: [
      "CB",
      [
        ["fwd", 2],
        ["tcw", 2],
        ["fwd", 1],
      ],
    ],
  },

  // constants: Like variables, but do not get re-written. Draw commands belong in the same form as in variables.
  //  Special constants:
  //    [ : pushes turtle position, orientation, and color to a stack during draw();
  //    ] : pops the stack, returning above values to where they were before.
  //    There is no validation for balancing the brackets. Expect undefined weirdness for unbalanced brackets.
  constants: { "[": [["tcw", 2]], "]": [["tcc", 2]] },

  // probs: Like variables, but no draw commands, and the rewrite rules are chosen by chances in values[n][1] (eg, 0.5 = 50% chance)
  // todo: add default for p<1.0
  probs: {
    b: [
      ["C[b]", 0.5],
      ["b[C]", 0.5],
    ],
  },
};

const binaryTreeAlphabet: IAlphabet = {
  name: "Binary Tree",
  atomic: "B",
  //variables: process rule [0], drawing commands and parameters in [1]
  variables: { A: ["AA", [["fwd", 2]]], B: ["A[B]B", [["fwd", 2]]] },
  //constants: draw commands, params (no re-write rules).
  constants: { "[": [["tcw", 2]], "]": [["tcc", 2]] },
};

const probAlphabet: IAlphabet = {
  name: "Prob",
  atomic: "y",
  variables: {
    F: ["F", [["fwd", 1]]],
    //"X": ["FF[VF[FFYFF[Q]]]", [["fwd", 1]]],
    X: ["XF[++XIF]X[F[--Fq]]", [["fwd", 1]]],
    B: ["F[v[[F]FX]vX[[Fq]]]", [["fwd", 1]]],
    I: ["[vXFvB]", [["nop"]]],
    U: ["U", [["tup", 1]]],
    T: ["", [["tnt", 0.01]]],
    S: ["", [["shd", 0.01]]],
  },
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    R: [
      ["cr+", 25],
      ["cg-", 25],
    ],
    D: [["cr+", 25]],
    "+": [["tcc", 1]],
    "-": [["tcw", 1]],
  },
  probs: {
    y: [
      ["FF[XvTDTT[vFB]]", 0.5],
      ["FF[XvSDSS[vFB]]", 0.5],
    ],
    c: [
      ["TTTT", 0.5],
      ["SSSS", 0.5],
    ],
    v: [
      ["-", 0.5],
      ["+", 0.5],
    ],
    q: [
      ["FFFU+++RRRRRccc[F----F----F----F----F----F]", 0.1],
      ["y", 0.9],
    ],
  },
};

const fernAlphabet = {
  //variables: process rule [0], drawing commands and parameters in [1]
  name: "Fern (var. 3)",
  variables: {
    F: ["FF", [["fwd", 1]]],
    //'X': ["F+[[X]-X]-F[-FX]+X",
    //'X': ["F+[[X]+X]-F[-FX]-X+[X]",
    //              'X': ["XF+[X[+X]F]-X[X[-X]-FX[+FX]]",
    Y: ["XY", [["fwd", 2]]],
    X: ["XF+[X[+XF]]-X[X[-XY]-FX[+FX]]", [["nop"]]],
  },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    "+": [["tcw", 1]],
    "-": [["tcc", 1]],
  },
};

const prodAlphabet = {
  //variables: process rule [0], drawing commands and parameters in [1]
  name: "Fern (var. 4)",
  atomic: "Yv",
  variables: {
    F: ["FF", [["fwd", 1]]],
    //'X': ["F+[[X]-X]-F[-FX]+X",
    //'X': ["F+[[X]+X]-F[-FX]-X+[X]",
    //              'X': ["XF+[X[+X]F]-X[X[-X]-FX[+FX]]",
    Y: ["XY", [["fwd", 2]]],
    U: ["", [["tup", 2]]],
    X: ["XF+[X[+XF]]-X[X[vXY]-FX[vFXq]]", [["nop"]]],
  },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    R: [
      ["cr+", 25],
      ["cg-", 25],
    ],
    D: [["cr+", 25]],
    T: [["tnt", 0.01]],
    S: [["shd", 0.01]],
    "+": [["tcw", 1]],
    "-": [["tcc", 1]],
  },
  probs: {
    y: [
      ["FF[TDDTT[vF]]", 0.5],
      ["FF[SDDSS[vF]]", 0.5],
    ],
    v: [
      ["+", 0.5],
      ["-", 0.5],
    ],
    c: [
      ["TTTT", 0.5],
      ["SSSS", 0.5],
    ],
    q: [
      ["FFFU+++RRRRRcccc[F----F----F----F----F----F]", 0.1],
      ["y", 0.9],
    ],
  }

};
const dragonCurveAlphabet = {
  name: "Dragon Curve",
  variables: { F: ["F+G", [["fwd", 2]]], G: ["F-G", [["fwd", 2]]] },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    "+": [["tcw", 4]],
    "-": [["tcc", 4]],
  },
};

function draw(s, t, a) {
  let stack = [];
  let va = a.variables;
  let cn = a.constants;
  let pr = a.probs;
  //console.log(a.name);

  let verbs = {
    fwd: (steps) => {
      t.moveForward(steps);
    },
    tcw: (amount) => {
      t.turn("R", amount);
    },
    tcc: (amount) => {
      t.turn("L", amount);
    },
    tup: (steps) => {
      t.facing = "N";
      t.moveForward(steps);
    },
    // c[rgb][+-](n): increases/decreases turtle red, green, blue by n.
    "cr+": (amount) => {
      t.color["r"] += clamp(amount, 0, 255);
    },
    "cr-": (amount) => {
      t.color["r"] -= clamp(amount, 0, 255);
    },
    "cg+": (amount) => {
      t.color["g"] += clamp(amount, 0, 255);
    },
    "cg-": (amount) => {
      t.color["g"] -= clamp(amount, 0, 255);
    },
    "cb+": (amount) => {
      t.color["b"] += clamp(amount, 0, 255);
    },
    "cb-": (amount) => {
      t.color["b"] -= clamp(amount, 0, 255);
    },
    tnt: (amount) => {
      t.tint(amount);
    },
    shd: (amount) => {
      t.shade(amount);
    },
    nop: () => {
      t.nop();
    },
  };

  for (let i = 0; i <= s.length; i++) {
    let c = s[i];
    if (pr != undefined && pr[c] != undefined) {
      verbs["nop"]();
    } else if (cn[c] != undefined) {
      if (c === "[") {
        stack.push({
          x: t.x,
          y: t.y,
          facing: t.facing,
          color: Object.assign({}, t.color),
        });
        //        t.color = {r:0,g:127,b:0,a:1};
      } else if (c === "]") {
        let o = stack.pop();
        // console.log(o.color["r"] - t.color["r"]);
        t.x = o.x;
        t.y = o.y;
        t.facing = o.facing;
        t.color = o.color;
        //       t.color = {r:0,g:155,b:0,a:1};
      }
      for (let i = 0; i < cn[c].length; i++) {
        let [verb, arg] = cn[c][i];
        verbs[verb](arg);
      }
    } else if (va[c] != undefined) {
//      console.log(280, va[c])
      for (let i = 0; i < va[c][1].length; i++) {
        let [verb, arg] = va[c][1][i];
        verbs[verb](arg);
      }
    } else {
      break;
    }
  }
}

function weighted_random(items, weights) {
  // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
  var i;

  for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return items[i];
}

function computeSentence(s, a) {
  let end = "";
  let va = a.variables;
  let cn = a.constants;
  let pr = a.probs;

  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    //  console.log(c)
    if (va[c] != undefined) {
      end += va[c][0];
    } else if (cn[c] != undefined) {
      end += c;
    } else if (pr != undefined && pr[c] != undefined) {
      let items = [];
      let probs = [];

      for (let j = 0; j < pr[c].length; j++) {
        items = items.concat(pr[c][j][0]);
        probs = probs.concat(pr[c][j][1]);
      }
      //  console.log(items);
      end += weighted_random(items, probs);
    } else {
      end += "";
    }
  }
  return end;
}

function compute() {
  //  let end = "";
  //  let stack = [];
  //  turtle.facing = "N";
  //  for(var i = 0; i <= s.length; i++) {
  //    let c = s[i];
  //
  //    if(c === 'A') {
  //      turtle.moveForward(2)
  //      end = end.concat('AA');
  //    }
  //    else if (c === 'B') {
  //      turtle.moveForward(2);
  //      end = end.concat('A[B]B');
  //    }
  //    else if (c === 'C') {
  //      turtle.moveForward(1);
  //      turtle.color = rgba(0,128,0,1)
  //      end = end.concat('BX')
  //    }
  //    else if (c === "X") {
  //      turtle.goto(15,33);
  //      end = end.concat('[AB]')
  //    }
  //    else if (c === "[") {
  //      stack.push({x: turtle.x, y: turtle.y, facing: turtle.facing});
  //      turtle.turn("L",1);
  //      end += "["
  //    }
  //    else if (c === "]") {
  //      let o = stack.pop();
  //      turtle.x = o.x;
  //      turtle.y = o.y;
  //      turtle.facing = o.facing;
  //
  //      turtle.turn("R",1);
  //      end += "]"
  //    }
  //  }
  //  return end;
}

//const canvas: HTMLCanvasElement = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');
const start_y = 256;
const start_x = start_y;
//const turtle = new Turtle(start_x,start_y,{r:90,g:194,b:93,a:0.6});
//turtle.facing = "N";
//applyRules(turtle, "B", computeSentence, 7, binaryTreeAlphabet);
//applyRules(turtle, "F", computeSentence, 13, dragonCurveAlphabet);
//applyRules(turtle, "X", computeSentence, 5, fernAlphabet);
//applyRules(turtle, "Y", computeSentence, 5, probAlphabet);
function drawMany(n, turtle, applyFn, compFn, iters, alphabet) {
  turtle.x -= 128 * n;
  for (let i = 1; i <= n; i++) {
    let cGreen = { r: 90, g: 194, b: 93, a: 0.6 };
    //   console.log("drawn ", i);
    turtle.facing = "N";
    turtle.x += 52 * n + iters * n;
    turtle.y = start_y;
    turtle.color = cGreen;
    //    turtle.shade(0.01)
    applyFn(turtle, alphabet.atomic, compFn, iters, alphabet);
  }
}

function initAlphabetState(alphabet) {
  return { alphabet: alphabet };
}

interface AlphabetState {
  alphabet: IAlphabet;
}

interface Payload {
  target: string;
  contents: any;
}

interface variableAction {
  type: "variable";
  payload: Payload;
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
        na = {
          alphabet: {
            ...state.alphabet,
            variables: {
              [action.payload.target]: [action.payload.contents]
            }
          }
        }
        console.log(464,na);
        return na;
      case 'reset':
        return initAlphabetState(state.alphabet);
  }
}

//turtle.moveForward(1);
//turtle.x = 63;
//turtle.y = 63;
//applyRules("B", compute, 4);
function renderVariables(variables) {
  console.log(ruleNames, rewrite, drawRules);
}

function Name(props) {
  return (
    <div>
      <h1>{props.alphabet.name}</h1>
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
    applyRules(turtle, alphabet.atomic, computeSentence, props.iters, alphabet);
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
    let a: { rule: string; rewrite: string; draw: DrawCommandTuples }[] = [];
    let v = alphabet.variables;
    for (let r in v) {
      let newfield = { rule: r, rewrite: v[r][0], draw: v[r][1] };
      a = [...a, newfield];
    }
    return a;
  };

  const [inputFields, setInputFields] = React.useState([...populateFields()]);

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };

  const addFields = () => {
    let newfield = { rule: "", rewrite: "", draw: [] };
    setInputFields([...inputFields, newfield]);
  };

  const submit = (e) => {
    e.preventDefault();
    for (let i of inputFields) {
      dispatch({
        type: "variable",
        payload: { target: i["rule"], contents: [i["rewrite"], i["draw"]]},
      });
    }
  };

  //  populateFields();

  return (
    <div className="Variables">
      <form onSubmit={submit}>
        <h2>Variables</h2>
        {inputFields.map((input, index) => {
          return (
            <div key={index} className="varItems">
              <input
                name="rule"
                placeholder="Rule"
                value={input.rule}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="rewrite"
                placeholder="Rewrite"
                value={input.rewrite}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="draw"
                placeholder="Draw rule"
                value={drawCmdsToString(input.draw)}
                onChange={(event) => handleFormChange(index, event)}
              />
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

function Constants({ state, dispatch }: ReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: { rule: string; draw: DrawCommandTuples }[] = [];
    let c = alphabet.constants;
    for (let r in c) {
      let newfield = { rule: r, draw: c[r] };
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
    let newfield = { rule: "", rewrite: "", draw: [] };
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
                value={input.rule}
                onChange={(event) => handleFormChange(index, event)}
              />
              <input
                name="draw"
                placeholder="Draw rule"
                value={drawCmdsToString(input.draw)}
                onChange={(event) => handleFormChange(index, event)}
              />
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

function Probs({ state, dispatch }: ReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: { rule: string; branches: ProbTuple[]}[] = [];
    let p = alphabet.probs;
    for (let r in p) {
      //console.log(p[r])
      let newfield = { rule: r, branches: p[r]};
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (index:number | [number, number], event) => {
    let data = [...inputFields];
    console.log(event.target.name, event.target.value);
    console.log(data);
    switch(event.target.name) {
        case 'branchRewrite':
          console.log(716,index)
          data[index[0]]["branches"][index[1]][0] = event.target.value;
          setInputFields(data);
        case 'rule':
          data[index[0]][event.target.name] = event.target.value;
          setInputFields(data);
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
    let b:ProbTuple[] = [["A", 0.5]]
    let newfield = { rule: "", branches: b};
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
            placeholder="Branch Rewrite Rule"
            value={input[0]}
            onChange={(event) => handleFormChange([idx, index], event)}
          />
          <input
            name="branchProb"
            placeholder="Branch Probability"
            value={input[1]}
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
                name="rule"
                placeholder="Rule"
                value={input.rule}
                onChange={(event) => handleFormChange(index, event)}
              />
              {branches(input.branches, index)}
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

function App() {
  //  const [currentAlphabet, setCurrentAlphabet] = React.useState(exampleAlphabet);
  const [state, dispatch] = React.useReducer(
    alphabetReducer,
    prodAlphabet,
    initAlphabetState
  );
  console.log("render app");
  return (
    <ErrorBoundary>
      <div className="container">
        <Canvas width={150} height={150} scale={4} iters={5} state={state} />
      </div>
    </ErrorBoundary>
  );
}
        //<Controls state={state} dispatch={dispatch} />
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
