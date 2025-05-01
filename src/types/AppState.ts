import { DrawCommandTuples, IAlphabet } from "./Lsystems";
// Basic state interface
export interface AlphabetState {
  alphabet: IAlphabet;
}

// Various state element interfaces
interface NameEl {
  name: string;
}

interface AxiomEl {
  axiom: string;
}

export interface VarEl {
  predecessor: string;
  successor: string;
  drawcmds: DrawCommandTuples;
}

export interface ConstEl {
  predecessor: string;
  drawcmds: DrawCommandTuples;
}

export interface ProbEl {
  predecessor: string;
  probs: unknown; // TODO
}

// Reducer action interfaces
interface nameAction {
  type: "name";
  payload: NameEl;
}
interface axiomAction {
  type: "axiom";
  payload: AxiomEl;
}
interface variableAction {
  type: "variable";
  payload: VarEl;
}
interface constantAction {
  type: "constant";
  payload: ConstEl;
}

interface loadAction {
  type: "load";
  payload: AlphabetState;
}
interface resetAction {
  type: "reset";
}

// Putting it all together...
export type AllAction =
  | nameAction
  | axiomAction
  | variableAction
  | constantAction
  | loadAction
  | resetAction;

export interface AppReducerState {
  alphabet: IAlphabet;
}

export interface AppReducerProps {
  state: AppReducerState;
  dispatch: (action: AllAction) => void;
}
