export type CommandTuple = [string, number] | ["nop"];
export type DrawCommandTuples = CommandTuple[];
export type VariableProperties = [string, DrawCommandTuples];
export type Variable = { [predecessor: string]: VariableProperties };
export type Constant = { [name: string]: DrawCommandTuples };
export type ProbTuple = [string, number];
export type Prob = { [name: string]: ProbTuple[] };
export interface IAlphabet {
  name: string;
  axiom: string;
  variables: Variable;
  constants: Constant;
  probs?: Prob;
}
export interface ApplyRulesFn {
  (sentence: string, alphabet: IAlphabet): string;
}
