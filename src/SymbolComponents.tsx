import { Turtle, drawOps } from "./Turtle";
import { DrawCommandTuples } from "./Lsystems";
import React from "react";

// Various state element interfaces
interface NameElement {
  name: string;
}
interface AxiomElement {
  axiom: string;
}
interface VariableElement {
  predecessor: string;
  successor: string;
  drawcmds: DrawCommandTuples;
}
interface ConstElement {
  predecessor: string;
  drawcmds: DrawCommandTuples;
}
interface ProbElement {
  predecessor: string;
  probs: any; // TODO
}

// Reducer action interfaces
export interface nameAction {
  type: "name";
  payload: NameElement;
}

export interface axiomAction {
  type: "axiom";
  payload: AxiomElement;
}

export interface variableAction {
  type: "variable";
  payload: VariableElement;
}

export interface constantAction {
  type: 'constant';
  payload: ConstElement;
}


export function SymbolBlock({ symbol, index }) {
  return (
    <div data-symbol-id={symbol.id}
    >
      {symbol.id}
    </div>
  )
}

export function Variables({ state, dispatch }: ReducerProps) {
  const alphabet = state.alphabet;

  const populateFields = () => {
    let a:VariableElement[] = [];
    let v = alphabet.variables;
    for (let r in v) {
      let vp:VariableProperties = v[r]
      let newfield:VariableElement = {predecessor: r, successor: vp[0], drawcmds: vp[1]}
      a = [...a, newfield];
    }
    return a;
  };

  const [inputFields, setInputFields] = React.useState([...populateFields()]);

  const handleFormChange = (index: number, event) => {
    let data = [...inputFields];
    console.log(data,event.target.name)
    data[index][event.target.name] = event.target.value;
    dispatch({type: "variable", payload: {...data[index],
                                          [event.target.name]: event.target.value}}
    );
    setInputFields(data);
  };

  const addFields = () => {
    let newfield:VariableElement= {predecessor: "", successor: "", drawcmds: []};
    setInputFields([...inputFields, newfield]);
  };

  const addDraw = (input:VariableElement, index:number) => {
    handleFormChange(index, {target: {name: "drawcmds", value:[...input.drawcmds, ["nop"]]}});
  }

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
        {inputFields.map((input:VariableElement, index:number) => {
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
              {input.drawcmds.map((commandTuple, idx) =>
                {
                  let r = [...input.drawcmds];
                  let fn = (i, e) => {
                    let v = [...r][idx][i] = e.target.value
                    handleFormChange(index, {...e, target: {...e.target, value: r}});
                  }

                  //<CommandTupleInput value={commandTuple} cmds={Object.keys(Turtle.drawOps())}/>
//@ts-ignore
                  return ((commandTuple[0] === "nop")?
                 <select name="drawcmds" value={commandTuple[0]} onChange={(e)=>fn(0, e)}>
                   {drawOps.map((x) => <option value={x}>{x}</option>)}
                 </select>
                  :
                 <div className="abc">
                   <select name="drawcmds" value={commandTuple[0]} onChange={(e)=>fn(0, e)}>
                    {drawOps.map((x) => <option value={x}>{x}</option>)}
                    </select>
                  <input
                    name="drawcmds"
                    placeholder="0"
                    value={commandTuple[1]}
                    onChange={(e)=>fn(1, e)}
                  />
                </div>
                )}

              )}
                <button type="button" onClick={()=>{addDraw(input, index)}}>+</button>
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

export function Constants({ state, dispatch }: ReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: ConstElement[] = [];
    let c = alphabet.constants;
    for (let r in c) {
      let newfield:ConstElement = {predecessor: r, drawcmds: c[r]}
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    console.log(event)
    data[index][event.target.name] = event.target.value;
    dispatch({type: "constant", payload: {...data[index],
                                          [event.target.name]: event.target.value}}
    );
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
    }
  };
  const addFields = () => {
    let newfield:ConstElement = {predecessor: "", drawcmds: []};
    setInputFields([...inputFields, newfield]);
  };
  const addDraw = (input:ConstElement, index:number) => {
    handleFormChange(index, {target: {name: "drawcmds", value:[...input.drawcmds, ["nop"]]}});
  }
  return (
    <div className="Constants">
      <form onSubmit={submit}>
        <h2>Constants</h2>
        {inputFields.map((input, index) => {
          return (
            <div key={index} className="constItems">
        <br/>
              <input
                name="predecessor"
                placeholder="Rule"
                value={input.predecessor}
                onChange={(event) => handleFormChange(index, event)}
              />
              {input.drawcmds.map((commandTuple, idx) =>
                {
                  let r = [...input.drawcmds];
                  let fn = (i, e) => {
                    let v = [...r][idx][i] = e.target.value
                    handleFormChange(index, {...e, target: {...e.target, value: r}});
                  }

                  return ((commandTuple[0] === "nop")?
                 <select name="drawcmds" value={commandTuple[0]} onChange={(e)=>fn(0, e)}>
                    {drawOps.map((x) => <option value={x}>{x}</option>)}
                 </select>
                  :
                 <div className="abc">
                   <select name="drawcmds" value={commandTuple[0]} onChange={(e)=>fn(0, e)}>
                      {drawOps.map((x) => <option value={x}>{x}</option>)}
                    </select>
                  <input
                    name="drawcmds"
                    placeholder="0"
                    value={commandTuple[1]}
                    onChange={(e)=>fn(1, e)}
                  />
                </div>
                )}

              )}
                <button type="button" onClick={()=>{addDraw(input, index)}}>+</button>
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

export function Probs({ state, dispatch }: ReducerProps) {
  type ProbElement = [string, ProbTuple[]];
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a:ProbElement[] = [];
    let p = alphabet.probs;
    for (let r in p) {
      let newfield:ProbElement = [r, p[r]];
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
    let newfield:ProbElement = ["", []]
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