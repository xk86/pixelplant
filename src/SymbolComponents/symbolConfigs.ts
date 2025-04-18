// symbolConfigs.ts
// Code for mapping the string based LSystems to the list ones
import { IAlphabet, DrawCommandTuples, ProbTuple } from '../Lsystems';
import { ConstantEntry, VariableEntry, ProbabilisticEntry } from './types';

export interface SymbolConfig<E, P> {
  /** which sub‑map on IAlphabet: 'constants' | 'variables' | 'probs' */
  section: keyof IAlphabet;
  /** the reducer action type to use */
  actionType: string;
  /** map [key, value] from IAlphabet map → UI entry */
  mapToEntry: (id: string, val: any) => E;
  /** map UI entry → reducer payload */
  entryToPayload: (e: E) => P;
}

// Constants
export const constantConfig: SymbolConfig<
  ConstantEntry,
  { predecessor: string; drawcmds: DrawCommandTuples }
> = {
  section: 'constants',
  actionType: 'constant',
  mapToEntry: (id, drawcmds) => ({ id, type: 'constant', drawcmds }),
  entryToPayload: e => ({ predecessor: e.id, drawcmds: e.drawcmds }),
};

// Variables
export const variableConfig: SymbolConfig<
  VariableEntry,
  { predecessor: string; successor: string; drawcmds: DrawCommandTuples }
> = {
  section: 'variables',
  actionType: 'variable',
  mapToEntry: (id, [succ, drawcmds]) => ({
    id,
    type: 'variable',
    successor: succ,
    drawcmds,
  }),
  entryToPayload: e => ({
    predecessor: e.id,
    successor: e.successor,
    drawcmds: e.drawcmds,
  }),
};

// Probabilistic rules
export const probConfig: SymbolConfig<
  ProbabilisticEntry,
  { predecessor: string; branches: ProbTuple[] }
> = {
  section: 'probs',
  actionType: 'prob',
  mapToEntry: (id, branches) => ({ id, type: 'prob', branches }),
  entryToPayload: e => ({ predecessor: e.id, branches: e.branches }),
};