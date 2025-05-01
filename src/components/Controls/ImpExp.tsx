import React from "react";
import { AppReducerProps } from "../../types/AppState";

export function ImpExport({ state, dispatch }: AppReducerProps) {
  const [inputValue, setInputValue] = React.useState(btoa(JSON.stringify({ ...state })));
  function exp() {
    setInputValue(btoa(JSON.stringify({ ...state })));
  }
  function imp() {
    console.log(JSON.parse(atob(inputValue)));
    dispatch({ type: "load", payload: JSON.parse(atob(inputValue)) });
    console.log(state.alphabet.axiom);
    dispatch({ type: "reset" });
  }
  function submit(e) {
    e.preventDefault();
    imp();
  }
  return (
    <div className="impExport">
      <form onSubmit={submit}>
        <input
          type="textArea"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></input>
      </form>
      <button onClick={exp}>Export Plant Settings</button>
      <button onClick={imp}>Import Plant Settings</button>
    </div>
  );
}
