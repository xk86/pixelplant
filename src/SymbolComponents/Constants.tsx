// src/SymbolComponents/Constants.tsx
import React from 'react'
import { RuleEditor } from './RuleEditor'
import { DrawCommandTuples } from '../Lsystems'
import { drawOps } from '../Turtle'
import { ReducerProps } from '../App'

export interface ConstElement {
  predecessor: string
  drawcmds: DrawCommandTuples
}

export function Constants({ state, dispatch }: ReducerProps) {
  const populate = (): ConstElement[] =>
    Object.entries(state.alphabet.constants).map(
      ([pred, cmds]) => ({ predecessor: pred, drawcmds: cmds })
    )

  const [rows, setRows] = React.useState<ConstElement[]>(populate())

  const handleChange = (i: number, name: keyof ConstElement, val: any) => {
    const updated = [...rows]
    // @ts-ignore
    updated[i][name] = val
    dispatch({ type: 'constant', payload: updated[i] })
    setRows(updated)
  }

  const addRow = () => setRows([...rows, { predecessor: '', drawcmds: [] }])

  const addDraw = (row: ConstElement, i: number) =>
    handleChange(i, 'drawcmds', [...row.drawcmds, ['nop']])

  return (
    <RuleEditor<ConstElement>
      title="Constants"
      elements={rows}
      onInit={populate}
      onChange={handleChange}
      onAddRow={addRow}
      renderRowAction={(row, i) => (
        <button type="button" onClick={() => addDraw(row, i)}>+</button>
      )}
      renderFields={(row, i) => (
        <>
          <input
            name="predecessor"
            placeholder="Constant"
            value={row.predecessor}
            onChange={e => handleChange(i, 'predecessor', e.target.value)}
          />
          {row.drawcmds.map((cmd, idx) => (
            <div key={idx} className="flex items-center">
              <select
                value={cmd[0]}
                onChange={e => {
                  const newDraw = [...row.drawcmds]
                  newDraw[idx][0] = e.target.value
                  handleChange(i, 'drawcmds', newDraw)
                }}
              >
                {drawOps.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              {cmd[0] !== 'nop' && (
                <input
                  type="number"
                  placeholder="arg"
                  value={cmd[1] as number}
                  onChange={e => {
                    const newDraw = [...row.drawcmds]
                    newDraw[idx][1] = parseFloat(e.target.value)
                    handleChange(i, 'drawcmds', newDraw)
                  }}
                />
              )}
            </div>
          ))}
        </>
      )}
    />
  )
}