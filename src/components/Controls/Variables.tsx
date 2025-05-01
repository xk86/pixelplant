import React from "react";
import { drawOps } from "../../engine/turtle";
import { AppReducerProps, VarEl } from "../../types/AppState";
import { VariableProperties } from "../../types/Lsystems";

export function Variables({ state, dispatch }: AppReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: VarEl[] = [];
    let v = alphabet.variables;
    for (let r in v) {
      let vp: VariableProperties = v[r];
      let newfield: VarEl = { predecessor: r, successor: vp[0], drawcmds: vp[1] };
      a = [...a, newfield];
    }
    return a;
  };

  const [inputFields, setInputFields] = React.useState([...populateFields()]);

  const handleFormChange = (index: number, event) => {
    let data = [...inputFields];
    console.log(data, event.target.name);
    //    console.log(668, data[index]);
    data[index][event.target.name] = event.target.value;
    dispatch({
      type: "variable",
      payload: { ...data[index], [event.target.name]: event.target.value },
    });
    setInputFields(data);
  };

  const addFields = () => {
    let newfield: VarEl = { predecessor: "", successor: "", drawcmds: [] };
    setInputFields([...inputFields, newfield]);
  };

  const addDraw = (input: VarEl, index: number) => {
    handleFormChange(index, { target: { name: "drawcmds", value: [...input.drawcmds, ["nop"]] } });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch({ type: "reset" });
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
        {inputFields.map((input: VarEl, index: number) => {
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
              {input.drawcmds.map((commandTuple, idx) => {
                let r = [...input.drawcmds];
                let fn = (i, e) => {
                  let v = ([...r][idx][i] = e.target.value);
                  handleFormChange(index, { ...e, target: { ...e.target, value: r } });
                };

                //<CommandTupleInput value={commandTuple} cmds={Object.keys(Turtle.drawOps())}/>
                //@ts-ignore
                return commandTuple[0] === "nop" ? (
                  <select name="drawcmds" value={commandTuple[0]} onChange={(e) => fn(0, e)}>
                    {drawOps.map((x) => (
                      <option value={x}>{x}</option>
                    ))}
                  </select>
                ) : (
                  <div className="abc">
                    <select name="drawcmds" value={commandTuple[0]} onChange={(e) => fn(0, e)}>
                      {drawOps.map((x) => (
                        <option value={x}>{x}</option>
                      ))}
                    </select>
                    <input
                      name="drawcmds"
                      placeholder="0"
                      value={commandTuple[1]}
                      onChange={(e) => fn(1, e)}
                    />
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  addDraw(input, index);
                }}
              >
                +
              </button>
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
