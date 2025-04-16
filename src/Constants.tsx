import React from "react";
import { SymbolRef } from "./Lsystems";

export function Constants({ state, dispatch }: ReducerProps) {
  const symbols = state.alphabet.symbols.filter(s => s.type === "constant");
  const [inputFields, setInputFields] = React.useState<SymbolRef[]>(symbols);

  const handleChange = (index: number, field: keyof SymbolRef, value: any) => {
    const updated = [...inputFields];
    updated[index][field] = value;
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [
        ...state.alphabet.symbols.filter(s => s.type !== "constant"),
        ...updated
      ]
    });
  };

  const addConstant = () => {
    const newConst: SymbolRef = {
      id: "",
      label: "",
      type: "constant",
      drawCommands: []
    };
    const updated = [...inputFields, newConst];
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [
        ...state.alphabet.symbols.filter(s => s.type !== "constant"),
        ...updated
      ]
    });
  };

  return (
    <div className="Constants">
      <h2>Constants</h2>
      {inputFields.map((sym, i) => (
        <div key={i}>
          <input
            placeholder="id"
            value={sym.id}
            maxLength={1}
            onChange={e => handleChange(i, "id", e.target.value)}
          />
          <input
            placeholder="label"
            value={sym.label}
            onChange={e => handleChange(i, "label", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addConstant}>Add Constant</button>
    </div>
  );
}