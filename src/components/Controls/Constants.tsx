import React from "react";
import { drawOps } from "../../engine/turtle";
import { AppReducerProps, ConstEl } from "../../types/AppState";

export function Constants({ state, dispatch }: AppReducerProps) {
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: ConstEl[] = [];
    let c = alphabet.constants;
    for (let r in c) {
      let newfield: ConstEl = { predecessor: r, drawcmds: c[r] };
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    console.log(event);
    data[index][event.target.name] = event.target.value;
    dispatch({
      type: "constant",
      payload: { ...data[index], [event.target.name]: event.target.value },
    });
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
    let newfield: ConstEl = { predecessor: "", drawcmds: [] };
    setInputFields([...inputFields, newfield]);
  };
  const addDraw = (input: ConstEl, index: number) => {
    handleFormChange(index, { target: { name: "drawcmds", value: [...input.drawcmds, ["nop"]] } });
  };
  return (
    <div className="Constants">
      <form onSubmit={submit}>
        <h2>Constants</h2>
        {inputFields.map((input, index) => {
          return (
            <div key={index} className="constItems">
              <br />
              <input
                name="predecessor"
                placeholder="Rule"
                value={input.predecessor}
                onChange={(event) => handleFormChange(index, event)}
              />
              {input.drawcmds.map((commandTuple, idx) => {
                let r = [...input.drawcmds];
                let fn = (i, e) => {
                  let v = ([...r][idx][i] = e.target.value);
                  handleFormChange(index, { ...e, target: { ...e.target, value: r } });
                };

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
        <br />
        <button type="button" onClick={addFields}>
          Add more...
        </button>
        <button>Submit</button>
      </form>
    </div>
  );
}
