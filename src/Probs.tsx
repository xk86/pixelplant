

import React from "react";
import { SymbolRef } from "./Lsystems";

export function Probs({ state, dispatch }: ReducerProps) {
  const symbols = state.alphabet.symbols.filter(s => s.type === "prob");
  const [inputFields, setInputFields] = React.useState<SymbolRef[]>(symbols);

  const handleChange = (index: number, field: keyof SymbolRef, value: any) => {
    const updated = [...inputFields];
    if (field === "probs") {
      const parts = value.split(";").map(part => {
        const [ids, weight] = part.split(":");
        return [ids.split("").map(id => ({ id, label: id, type: "variable" })), parseFloat(weight)];
      });
      updated[index][field] = parts;
    } else {
      updated[index][field] = value;
    }
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [...state.alphabet.symbols.filter(s => s.type !== "prob"), ...updated]
    });
  };

  const addProb = () => {
    const newProb: SymbolRef = {
      id: "",
      label: "",
      type: "prob",
      probs: []
    };
    const updated = [...inputFields, newProb];
    setInputFields(updated);
    dispatch({
      type: "updateSymbols",
      payload: [...state.alphabet.symbols.filter(s => s.type !== "prob"), ...updated]
    });
  };

  return (
    <div className="Probs">
      <h2>Probabilistic Rules</h2>
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
            placeholder="probs (e.g. A:0.5;B:0.5)"
            value={(sym.probs || []).map(([seq, w]) => `${seq.map(s => s.id).join("")}:${w}`).join(";")}
            onChange={e => handleChange(i, "probs", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addProb}>Add Probabilistic Rule</button>
    </div>
  );
}