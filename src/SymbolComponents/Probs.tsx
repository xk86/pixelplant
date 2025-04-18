// src/SymbolComponents/Probs.tsx
import React from 'react'
import { SymbolEditor } from './SymbolEditor'
import { useAlphabetEditor } from './useSymbolEditor'
import { probConfig } from './symbolConfigs'
import { ReducerProps } from '../App'
import { ProbTuple } from '../Lsystems'

export function Probs({ state, dispatch }: ReducerProps) {
  const [entries, onChange] = useAlphabetEditor(probConfig, state, dispatch)
  const idCounter = React.useRef(0)

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
      <h2>Probabilistic Rules</h2>
      <SymbolEditor
        entries={entries}
        onChange={onChange}
        newEntry={() => {
          idCounter.current += 1
          return {
            id: `prob-${idCounter.current}`,
            type: 'prob',
            predecessor: '',
            branches: [] as ProbTuple[],
          }
        }}
        renderFields={(entry, i, onField) => (
          <>
            <input
              name="id"
              placeholder="Prob ID"
              value={entry.id}
              onChange={e => handleIdChange(i, e.target.value)}
            />
            {entry.branches.map((branch, idx) => (
              <div key={idx} className="flex space-x-1">
                <input
                  placeholder="rewrite"
                  value={branch[0]}
                  onChange={e => {
                    const newBranches = [...entry.branches]
                    newBranches[idx][0] = e.target.value
                    onField('branches', newBranches)
                  }}
                />
                <input
                  type="number"
                  placeholder="prob"
                  value={branch[1]}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={e => {
                    const newBranches = [...entry.branches]
                    newBranches[idx][1] = parseFloat(e.target.value)
                    onField('branches', newBranches)
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="ml-2"
              onClick={() =>
                onField('branches', [...entry.branches, ['', 0.5] as ProbTuple])
              }
            >
              + branch
            </button>
          </>
        )}
      />
    </section>
  )
}