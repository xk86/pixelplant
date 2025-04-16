import React from "react";
import { SymbolRef } from "./Lsystems";

export function Variables({ state, dispatch }: ReducerProps) {
  const symbols = state.alphabet.symbols.filter(s => s.type === "variable");
  const [inputFields, setInputFields] = React.useState<SymbolRef[]>(symbols);

  const handleChange = (index: number, field: keyof SymbolRef, value: any) => {
    const updated = [...inputFields];
    if (field === "successor") {
      updated[index].successor = value.split("").map(id => ({
        id,
        label: id,
        type: "variable"
      }));
    } else {
      updated[index][field] = value;
    }
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [
        ...state.alphabet.symbols.filter(s => s.type !== "variable"),
        ...updated
      ]
    });
  };

  const addField = () => {
    const newVar: SymbolRef = {
      id: "",
      label: "",
      type: "variable",
      drawCommands: [],
      successor: []
    };
    const updated = [...inputFields, newVar];
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [
        ...state.alphabet.symbols.filter(s => s.type !== "variable"),
        ...updated
      ]
    });
  };

  return (
    <div className="Variables">
      <h2>Variables</h2>
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
          <input
            placeholder="successor"
            value={(sym.successor || []).map(s => s.id).join("")}
            onChange={e => handleChange(i, "successor", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addField}>
        Add Variable
      </button>
    </div>
  );
}