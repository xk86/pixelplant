// src/SymbolComponents/Variables.tsx
import React, { useRef } from 'react';
import { drawOps } from '../Turtle';
import { SymbolEditor } from './SymbolEditor';
import { useAlphabetEditor } from './useSymbolEditor';
import { variableConfig } from './symbolConfigs';
import { ReducerProps } from '../App';

export interface VariableElement {
  predecessor: string
  successor: string
  drawcmds: DrawCommandTuples
}

export function Variables({ state, dispatch }: ReducerProps) {
  const [entries, onChange] = useAlphabetEditor(variableConfig, state, dispatch);
  const idCounter = useRef(0);
  // Prevent duplicate IDs
  const handleIdChange = (index: number, newId: string) => {
    if (entries.some((e, idx) => idx !== index && e.id === newId)) {
      return; // ignore duplicate
    }
    onChange(entries.map((e, idx) =>
      idx === index ? { ...e, id: newId } : e
    ));
  };
  return (
    <section>
  <h2>Variables</h2>
  <SymbolEditor
    entries={entries}
    onChange={onChange}
    newEntry={() => {
      idCounter.current += 1;
      return {
        id: `variable-${idCounter.current}`,
        type: 'variable',
        predecessor: '',
        successor: '',
        drawcmds: [['nop', 0]],
      };
    }}
    renderFields={(entry, i, onField) => (
      <>
        <input
          name="id"
          placeholder="Variable"
          value={entry.id}
          onChange={e => handleIdChange(i, e.target.value)}
        />
        <input
          name="successor"
          placeholder="Successor"
          value={entry.successor}
          onChange={e => onField('successor', e.target.value)}
        />
        {entry.drawcmds.map((cmd, idx) => (
          <div key={idx} className="flex items-center">
            <select
              value={cmd[0]}
              onChange={e => {
                const newDraw = [...entry.drawcmds];
                newDraw[idx][0] = e.target.value;
                onField('drawcmds', newDraw);
              }}
            >
              {drawOps.map(x => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            {cmd[0] !== 'nop' && (
              <input
                type="number"
                placeholder="arg"
                value={cmd[1] as number}
                onChange={e => {
                  const newDraw = [...entry.drawcmds];
                  newDraw[idx][1] = parseFloat(e.target.value);
                  onField('drawcmds', newDraw);
                }}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="ml-2"
          onClick={() => onField('drawcmds', [...entry.drawcmds, ['nop', 0]])}
        >
          + Cmd
        </button>
      </>
    )}
  />
  </section>
  )
}