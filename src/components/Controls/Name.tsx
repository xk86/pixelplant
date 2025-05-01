import React from "react";

export function Name(props) {
  let t = { ...props.alphabet }.name;
  let [inputText, setInputText] = React.useState(t);
  console.log(inputText);

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setInputText(event.target.value);
    props.dispatch({ type: "name", payload: { name: inputText } });
  };
  const submit = (e) => {
    e.preventDefault();
    props.dispatch({
      type: "name",
      payload: { name: inputText },
    });
    props.dispatch({ type: "reset", payload: { alphabet: props.alphabet } });
  };

  return (
    <div>
      <h1>{inputText}</h1>
      <h2>{props.alphabet.name}</h2>
      <form onSubmit={submit}>
        <input type="text" value={inputText} onChange={(e) => handleChange(e)}></input>
      </form>
    </div>
  );
}
