import React, { useRef } from 'react'
 
import { DrawCommandTuples } from '../Lsystems'
import { drawOps } from '../Turtle'
import { ReducerProps } from '../App'
import { ConstantEntry } from './types'
import { useAlphabetEditor } from './useSymbolEditor';
import { SymbolEditor } from './SymbolEditor'
import { constantConfig } from './symbolConfigs';

export interface ConstElement {
  predecessor: string
  drawcmds: DrawCommandTuples
}

export function Constants({ state, dispatch }: ReducerProps) {
  const [entries, onChange] = useAlphabetEditor(
    constantConfig,
    state,
    dispatch
  );

  const idCounter = useRef(0);

  return (
    <section>
      <h2>Constants</h2>
      <SymbolEditor<ConstantEntry>
        entries={entries}
        onChange={onChange}
        newEntry={() => {
          idCounter.current += 1;
          return { id: `constant-${idCounter.current}`, type: 'constant', drawcmds: [['nop', 0]] };
        }}
        renderFields={(entry, i, onField) => (
          <>
            <input
              name="id"
              placeholder="Constant"
              value={entry.id}
              onChange={e => onField('id', e.target.value)}
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
                    <option key={x} value={x}>
                      {x}
                    </option>
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
  );
}