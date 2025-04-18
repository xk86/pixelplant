// src/SymbolComponents/SymbolEditor.tsx
// Defines basic outline for the different types of symbol editors.
import { BaseSymbolEntry } from "./types"

interface SymbolEditorProps<T extends BaseSymbolEntry & { type: string }> {
  entries: T[]
  onChange: (newList: T[]) => void
  renderFields: (entry: T, idx: number, onFieldChange: (k: keyof T, v: any)=>void) => React.ReactNode
  newEntry: () => T
}

export function SymbolEditor<T extends BaseSymbolEntry & { type: string }>({
  entries, onChange, renderFields, newEntry
}: SymbolEditorProps<T>) {
  const addEmpty = () => onChange([...entries, newEntry()]);

  const updateAt = (i: number, patch: Partial<T>) => {
    const next = entries.map((e, j) =>
      j === i ? ({ ...e, ...patch } as T) : e
    )
    onChange(next)
  }
  return (
    <div className="symbol‑editor">
      {entries.map((entry, i) =>
        <div key={entry.id || `${i}-${entry.type}`} className="entry-row flex items-center gap-2">
          {renderFields(entry, i, (k, v) => updateAt(i, { [k]: v } as Partial<T>))}
        </div>
      )}
      <button type="button" onClick={addEmpty}>
        + Add {entries[0]?.type || 'Item'}
      </button>
    </div>
  )
}