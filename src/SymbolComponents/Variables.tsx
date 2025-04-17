// src/SymbolComponents/Variables.tsx
import React from 'react'
import { drawOps } from '../Turtle'
import { RuleEditor } from './RuleEditor'
import { DrawCommandTuples, VariableProperties } from '../Lsystems'
import { ReducerProps }  from '../App'

export interface VariableElement {
  predecessor: string
  successor: string
  drawcmds: DrawCommandTuples
}

export function Variables({ state, dispatch }: ReducerProps) {
  const populate = (): VariableElement[] => {
    return Object.entries(state.alphabet.variables).map(
      ([pred, [succ, drawcmds]]) => ({ predecessor: pred, successor: succ, drawcmds })
    )
  }

  const [rows, setRows] = React.useState<VariableElement[]>(populate())

  const handleChange = (i: number, name: keyof VariableElement, val: any) => {
    const updated = [...rows]
    // @ts-ignore
    updated[i][name] = val
    dispatch({ type: 'variable', payload: updated[i] })
    setRows(updated)
  }

  const addRow = () =>
    setRows([...rows, { predecessor: '', successor: '', drawcmds: [['nop', 0]] }])

  const addDraw = (row: VariableElement, i: number) =>
    handleChange(i, 'drawcmds', [...row.drawcmds, ['nop', 0]])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'reset' })
    rows.forEach(r => dispatch({ type: 'variable', payload: r }))
  }

  return (
    <RuleEditor<VariableElement>
      title="Variables"
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
            placeholder="Predecessor"
            maxLength={1}
            value={row.predecessor}
            onChange={e => handleChange(i, 'predecessor', e.target.value)}
          />
          <input
            name="successor"
            placeholder="Successor"
            value={row.successor}
            onChange={e => handleChange(i, 'successor', e.target.value)}
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
      onSubmit={handleSubmit}
    />
  )
}