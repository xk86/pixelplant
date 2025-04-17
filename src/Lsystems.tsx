import {Turtle, Color, clamp} from "./Turtle";

// strong, discriminated symbol-entry types
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

// collection shape for lists of entries
export interface ListAlphabet {
  name: string;
  axiom: string;
  variables: VariableEntry[];
  constants: ConstantEntry[];
  probs?: ProbabilisticEntry[];
}

export type SentenceSymbol = {
  id: string
  entry: SymbolEntry
}

export type Sentence = SentenceSymbol[]



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

export function listToMapAlpha(L: ListAlphabet): IAlphabet {
  return {
    name:    L.name,
    axiom:   L.axiom,
    variables: Object.fromEntries(
      L.variables.map(e => [e.id, [e.successor, e.drawcmds]])
    ),
    constants: Object.fromEntries(
      L.constants.map(e => [e.id, e.drawcmds])
    ),
    probs: L.probs && Object.fromEntries(
      L.probs.map(e => [e.id, e.branches])
    )
  };
}

export function applyRules(turtle: Turtle, sentence: string, fn, n, alphabet) {
  let end = sentence;
  for (var i = 1; i <= n; i++) {
    //console.log(end);
    end = fn(end, alphabet);
    if (i == n) {
      draw(end, turtle, alphabet);
    }
  }
  return end;
}

export function computeSentence(sentence: string, alphabet: IAlphabet) {
  let end = "";
  let variables = alphabet.variables;
  let constants = alphabet.constants;
  let probs     = alphabet.probs;

  for (let i = 0; i < sentence.length; i++) {
    let symbol = sentence[i];
    //  console.log(c)
    if (variables[symbol] != undefined) {
      end += variables[symbol][0];
    } else if (constants[symbol] != undefined) {
      end += symbol;
    } else if (probs != undefined && probs[symbol] != undefined) {
      let items = [];
      let probsResult = [];

      for (let j = 0; j < probs[symbol].length; j++) {
        items = items.concat(probs[symbol][j][0]);
        probsResult = probsResult.concat(probs[symbol][j][1]);
      }
      //  console.log(items);
      end += weighted_random(items, probsResult);
    } else {
      end += "";
    }
  }
  return end;
}

export var drawCommands:[string, number][] = []

function draw(sentence: string, turtle: Turtle, alphabet: IAlphabet) {
  interface StackFrame {
    x: number;
    y: number;
    facing: string;
    color: Color;
  }
  let stack:StackFrame[];
  let variables = alphabet.variables;
  let constants = alphabet.constants;
  let probs = alphabet.probs;

  let verbs = Turtle.drawOps(turtle);

  stack = [];
  for (let i = 0; i <= sentence.length; i++) {
    let symbol = sentence[i];
    if (probs != undefined && probs[symbol] != undefined) {
      verbs["nop"]();
    } else if (constants[symbol] != undefined) {
      if (symbol === "[") {
        stack.push({
          x: turtle.x,
          y: turtle.y,
          facing: turtle.facing,
          color: Object.assign({}, turtle.color),
        });
        //        t.color = {r:0,g:127,b:0,a:1};
      } else if (symbol === "]") {
        let frame = stack.pop();
        if (frame !== undefined) {
          turtle.x = frame.x;
          turtle.y = frame.y;
          turtle.facing = frame.facing;
          turtle.color = frame.color;
        }
      }
      for (let i = 0; i < constants[symbol].length; i++) {
        let [verb, arg] = constants[symbol][i];
        verbs[verb](arg);
      }
    } else if (variables[symbol] != undefined) {
      for (let i = 0; i < variables[symbol][1].length; i++) {
        let [verb, arg] = variables[symbol][1][i];
        verbs[verb](arg);
      }
    } else {
      break;
    }
  }
}

function weighted_random(items, weights) {
  // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
  var i;

  for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return items[i];
}


function compute() {
  //  let end = "";
  //  let stack = [];
  //  turtle.facing = "N";
  //  for(var i = 0; i <= s.length; i++) {
  //    let c = s[i];
  //
  //    if(c === 'A') {
  //      turtle.moveForward(2)
  //      end = end.concat('AA');
  //    }
  //    else if (c === 'B') {
  //      turtle.moveForward(2);
  //      end = end.concat('A[B]B');
  //    }
  //    else if (c === 'C') {
  //      turtle.moveForward(1);
  //      turtle.color = rgba(0,128,0,1)
  //      end = end.concat('BX')
  //    }
  //    else if (c === "X") {
  //      turtle.goto(15,33);
  //      end = end.concat('[AB]')
  //    }
  //    else if (c === "[") {
  //      stack.push({x: turtle.x, y: turtle.y, facing: turtle.facing});
  //      turtle.turn("L",1);
  //      end += "["
  //    }
  //    else if (c === "]") {
  //      let o = stack.pop();
  //      turtle.x = o.x;
  //      turtle.y = o.y;
  //      turtle.facing = o.facing;
  //
  //      turtle.turn("R",1);
  //      end += "]"
  //    }
  //  }
  //  return end;
}

//const canvas: HTMLCanvasElement = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');
const start_y = 256;
const start_x = start_y;
//const turtle = new Turtle(start_x,start_y,{r:90,g:194,b:93,a:0.6});
//turtle.facing = "N";
//applyRules(turtle, "B", computeSentence, 7, binaryTreeAlphabet);
//applyRules(turtle, "F", computeSentence, 13, dragonCurveAlphabet);
//applyRules(turtle, "X", computeSentence, 5, fernAlphabet);
//applyRules(turtle, "Y", computeSentence, 5, probAlphabet);
function drawMany(n, turtle, applyFn, compFn, iters, alphabet) {
  turtle.x -= 128 * n;
  for (let i = 1; i <= n; i++) {
    let cGreen = { r: 90, g: 194, b: 93, a: 0.6 };
    //   console.log("drawn ", i);
    turtle.facing = "N";
    turtle.x += 52 * n + iters * n;
    turtle.y = start_y;
    turtle.color = cGreen;
    //    turtle.shade(0.01)
    applyFn(turtle, alphabet.axiom, compFn, iters, alphabet);
  }
}
