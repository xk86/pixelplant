import React from "react";
import { AppReducerProps } from "../../types/AppState";

export function Name({ state, dispatch }: AppReducerProps) {
  const t = state.alphabet.name;
  const [inputText, setInputText] = React.useState(t);
  console.log(inputText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log(event.target.value);
    setInputText(event.target.value);
    dispatch({ type: "name", payload: { name: inputText } });
  };
  const submit = (e) => {
    e.preventDefault();
    dispatch({
      type: "name",
      payload: { name: inputText },
    });
    dispatch({ type: "reset", payload: { alphabet: state.alphabet } });
  };

  return (
    <div>
      <h1>{inputText}</h1>
      <h2>{state.alphabet.name}</h2>
      <form onSubmit={submit}>
        <input type="text" value={inputText} onChange={(e) => handleChange(e)}></input>
      </form>
    </div>
  );
}
