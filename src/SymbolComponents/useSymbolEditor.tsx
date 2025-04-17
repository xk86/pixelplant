// src/SymbolComponents/useSymbolEditor.ts
import { useState, useEffect } from 'react';
import { SymbolConfig } from './symbolConfigs';
import { ReducerState } from '../App';

export function useAlphabetEditor<E, P>(
  config: SymbolConfig<E, P>,
  state: ReducerState,
  dispatch: (action: { type: string; payload: P }) => void
): [E[], (updated: E[]) => void] {
  // @ts-ignore: we just grab state.alphabet[section], TS can’t narrow this easily
  const mapData = (state.alphabet as any)[config.section];
  return useSymbolEditor<E, P>(
    mapData,
    config.actionType,
    dispatch,
    config.mapToEntry,
    config.entryToPayload
  );
}

/**
 * Keeps a local list-of-entries in sync with a map in the global state,
 * and dispatches an action for each edited entry.
 *
 * @param mapData    The map string from your IAlphabet (e.g. state.alphabet.constants)
 * @param actionType The reducer action type ('constant', 'variable', 'prob', etc.)
 * @param dispatch   The reducer dispatch
 * @param mapToEntry Turn [k,v] pair into UI entry
 * @param entryToPayload  Turn UI entry back into the reducer payload
 */
export function useSymbolEditor<E, P>(
  mapData: Record<string, any>,
  actionType: string,
  dispatch: (action: { type: string; payload: P }) => void,
  mapToEntry: (key: string, val: any) => E,
  entryToPayload: (e: E) => P
): [E[], (updated: E[]) => void] {
  const init = () => Object.entries(mapData).map(([k, v]) => mapToEntry(k, v));
  const [entries, setEntries] = useState<E[]>(init);

  useEffect(() => {
    setEntries(init());
  }, []);

  const onChange = (next: E[]) => {
    setEntries(next);
    next.forEach(e => dispatch({ type: actionType, payload: entryToPayload(e) }));
  };

  return [entries, onChange];
}