import { Turtle, drawOps } from "./Turtle";
import { DrawCommandTuples } from "./Lsystems";
import React from "react";

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