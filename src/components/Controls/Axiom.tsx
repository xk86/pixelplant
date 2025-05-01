import React from "react";

export function Axiom(props) {
  let t = { ...props.alphabet }.axiom;
  let [inputText, setInputText] = React.useState(t);
  console.log(inputText);

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setInputText(event.target.value);
    props.dispatch({ type: "axiom", payload: { axiom: inputText } });
  };
  const submit = (e) => {
    e.preventDefault();
    props.dispatch({
      type: "axiom",
      payload: { axiom: inputText },
    });
    props.dispatch({ type: "reset", payload: { alphabet: props.alphabet } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input type="text" value={inputText} onChange={(e) => handleChange(e)}></input>
      </form>
    </div>
  );
}
