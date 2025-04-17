import { Turtle, drawOps } from "../Turtle";
import { DrawCommandTuples, ProbTuple } from "../Lsystems";
import React from "react";

// Generic alphabet shape parametrized by axiom type (string or string[]).
export interface Alphabet<AxiomType> {
  name: string;
  axiom: AxiomType;
  variables: VariableEntry[];
  constants: ConstantEntry[];
  probs?: ProbabilisticEntry[];
}
// Concrete aliases for string- and list-based alphabets
export type StringAlphabet = Alphabet<string>;
export type ListAlphabet = Alphabet<string[]>;

// Various state element interfaces
interface NameElement {
  name: string;
}
interface AxiomElement {
  axiom: string;
}
interface VariableElement {
  predecessor: string;
  successor: string;
  drawcmds: DrawCommandTuples;
}
interface ConstElement {
  predecessor: string;
  drawcmds: DrawCommandTuples;
}
interface ProbElement {
  predecessor: string;
  probs: any; // TODO
}

// Reducer action interfaces
export interface nameAction {
  type: "name";
  payload: NameElement;
}

export interface axiomAction {
  type: "axiom";
  payload: AxiomElement;
}

export interface variableAction {
  type: "variable";
  payload: VariableElement;
}

export interface constantAction {
  type: 'constant';
  payload: ConstElement;
}

// Types for the List-based lsystems used by the UI (for now)
export interface BaseSymbolEntry {
  id: string;
  label?: string;
}

// a variable always has a successor string and draw commands
export interface VariableEntry extends BaseSymbolEntry {
  type: 'variable';
  successor: string;
  drawcmds: DrawCommandTuples;
}

// a constant has only draw commands (no successor)
export interface ConstantEntry extends BaseSymbolEntry {
  type: 'constant';
  drawcmds: DrawCommandTuples;
}

// a probabilistic symbol has only branches (no direct draw commands)
export interface ProbabilisticEntry extends BaseSymbolEntry {
  type: 'probabilistic';
  branches: ProbTuple[];
}

// union of all entries
export type SymbolEntry = VariableEntry | ConstantEntry | ProbabilisticEntry;

export type SentenceSymbol = {
  id: string
  entry: SymbolEntry
}

export type Sentence = SentenceSymbol[]