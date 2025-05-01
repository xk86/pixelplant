import React from "react";
import { AppReducerProps } from "../../types/AppState";

export function Axiom({ state, dispatch }: AppReducerProps) {
  const t = state.alphabet.axiom;
  const [inputText, setInputText] = React.useState(t);
  console.log(inputText);

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setInputText(event.target.value);
    dispatch({ type: "axiom", payload: { axiom: inputText } });
  };
  const submit = (e) => {
    e.preventDefault();
    dispatch({
      type: "axiom",
      payload: { axiom: inputText },
    });
    dispatch({ type: "reset", payload: { alphabet: state.alphabet } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input type="text" value={inputText} onChange={(e) => handleChange(e)}></input>
      </form>
    </div>
  );
}
