// src/SymbolComponents/Probs.tsx
import React from 'react'
import { RuleEditor } from './RuleEditor'
import { ProbTuple } from '../Lsystems'
import { ReducerProps } from '../App'

export interface ProbElement {
  predecessor: string
  probs: ProbTuple[]
}

export function Probs({ state, dispatch }: ReducerProps) {
  const populate = (): ProbElement[] =>
    state.alphabet.probs
      ? Object.entries(state.alphabet.probs).map(
          ([pred, branches]) => ({ predecessor: pred, probs: branches })
        )
      : []

  const [rows, setRows] = React.useState<ProbElement[]>(populate())

  const handleChange = (
    i: number,
    name: 'predecessor' | 'probs',
    val: any
  ) => {
    const updated = [...rows]
    // @ts-ignore
    updated[i][name] = val
    dispatch({ type: 'probabilistic', payload: updated[i] })
    setRows(updated)
  }

  const addRow = () =>
    setRows([...rows, { predecessor: '', probs: [] }])

  const addBranch = (row: ProbElement, i: number) =>
    handleChange(i, 'probs', [...row.probs, ['', 0.5] as ProbTuple])

  return (
    <RuleEditor<ProbElement>
      title="Probabilistic Rules"
      elements={rows}
      onInit={populate}
      onChange={handleChange}
      onAddRow={addRow}
      renderRowAction={(row, i) => (
        <button type="button" onClick={() => addBranch(row, i)}>+ branch</button>
      )}
      renderFields={(row, i) => (
        <>
          <input
            name="predecessor"
            placeholder="Predecessor"
            value={row.predecessor}
            onChange={e => handleChange(i, 'predecessor', e.target.value)}
          />
          {row.probs.map((b, idx) => (
            <div key={idx} className="flex space-x-1">
              <input
                placeholder="rewrite"
                value={b[0]}
                onChange={e => {
                  const newB = [...row.probs]
                  newB[idx][0] = e.target.value
                  handleChange(i, 'probs', newB)
                }}
              />
              <input
                type="number"
                placeholder="prob"
                value={b[1]}
                min={0}
                max={1}
                step={0.01}
                onChange={e => {
                  const newB = [...row.probs]
                  newB[idx][1] = parseFloat(e.target.value)
                  handleChange(i, 'probs', newB)
                }}
              />
            </div>
          ))}
        </>
      )}
    />
  )
}