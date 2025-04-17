// src/SymbolComponents/RuleEditor.tsx
import React from 'react'

export interface RuleEditorProps<T> {
  title: string
  elements: T[]
  onInit: () => T[]
  onChange: (index: number, name: keyof T, value: any) => void
  onAddRow: () => void
  renderRowAction?: (item: T, index: number) => React.ReactNode
  renderFields: (item: T, index: number) => React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
}

export function RuleEditor<T extends object>({
  title,
  elements,
  onInit,
  onChange,
  onAddRow,
  renderRowAction,
  renderFields,
  onSubmit,
}: RuleEditorProps<T>) {
  // initialize once on mount
  React.useEffect(() => {
    const data = onInit()
    // if you want to seed local state here, call dispatch/reset etc
  }, [])

  return (
    <div className={`${title.replace(/\s+/g,'')} Editor`} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <form onSubmit={onSubmit}>
        <h2>{title}</h2>

        {elements.map((el, i) => (
          <div key={i} className="ruleRow flex space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0' }}>
            {renderFields(el, i)}
            {renderRowAction && <div>{renderRowAction(el, i)}</div>}
          </div>
        ))}

        <div className="mt-4 space-x-2">
          <button type="button" onClick={onAddRow}>
            Add more…
          </button>
          {onSubmit && <button>Submit</button>}
        </div>
      </form>
    </div>
  )
}