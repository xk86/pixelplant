import React from "react";
import { AppReducerProps } from "../../types/AppState";
import { ProbTuple } from "../../types/Lsystems";

export function Probs({ state, dispatch }: AppReducerProps) {
  type ProbEl = [string, ProbTuple[]];
  const alphabet = state.alphabet;
  const populateFields = () => {
    let a: ProbEl[] = [];
    const p = alphabet.probs;
    for (const r in p) {
      const newfield: ProbEl = [r, p[r]];
      a = [...a, newfield];
    }
    return a;
  };
  const handleFormChange = (
    index: number | [number, number],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const data = [...inputFields];
    switch (event.target.name) {
      case "branchRewrite":
        console.log("probs-rewrite", data[index[0]]);
        //          data[index[0]][1][index[1]][0] = event.target.value;
        //          setInputFields(data);
        break;
      case "rule":
        console.log("probs-rules", Object.keys(data));
        //          data[index[0]][event.target.name] = event.target.value;
        //          setInputFields(data);
        break;
    }
  };

  const [inputFields, setInputFields] = React.useState([...populateFields()]);
  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // i'll be using i later
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    for (const i of inputFields) {
      dispatch({
        type: "replacePRw",
      });
      //      dispatch({
      //        type: "replaceVRw",
      //        payload: { target: i["rule"], contents: i["rewrite"] },
      //      });
    }
  };
  const addFields = () => {
    const newfield: ProbEl = ["", []];
    setInputFields([...inputFields, newfield]);
  };

  const branches = (bs: ProbTuple[], idx: number) => {
    let a: ProbTuple[] = [];
    for (const b of bs) {
      a = a.concat([b]);
    }
    return a.map((input, index) => {
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
    });
  };

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
