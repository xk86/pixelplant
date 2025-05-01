import { Turtle, Color } from "./turtle";
import { IAlphabet, ApplyRulesFn } from "../types/Lsystems";

export function applyRules(
  turtle: Turtle,
  sentence: string,
  fn: ApplyRulesFn,
  n: number,
  alphabet: IAlphabet,
): string {
  let end = sentence;
  for (let i = 1; i <= n; i++) {
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
  const variables = alphabet.variables;
  const constants = alphabet.constants;
  const probs = alphabet.probs;

  for (let i = 0; i < sentence.length; i++) {
    const symbol = sentence[i];
    //  console.log(c)
    if (variables[symbol] != undefined) {
      end += variables[symbol][0];
    } else if (constants[symbol] != undefined) {
      end += symbol;
    } else if (probs != undefined && probs[symbol] != undefined) {
      let items: string[] = [];
      let probas: number[] = [];

      for (let j = 0; j < probs[symbol].length; j++) {
        items = items.concat(probs[symbol][j][0]);
        probas = probas.concat(probs[symbol][j][1]);
      }
      console.log(items, probas);
      //  console.log(items);
      end += weighted_random(items, probas);
    } else {
      end += "";
    }
  }
  return end;
}

export const drawCommands: [string, number][] = [];

function draw(sentence: string, turtle: Turtle, alphabet: IAlphabet) {
  interface StackFrame {
    x: number;
    y: number;
    facing: string;
    color: Color;
  }
  const stack: StackFrame[] = [];
  const variables = alphabet.variables;
  const constants = alphabet.constants;
  const probs = alphabet.probs;
  //console.log(a.name);

  const verbs = Turtle.drawOps(turtle);

  for (let i = 0; i <= sentence.length; i++) {
    const symbol = sentence[i];
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
        const o = stack.pop();
        if (o !== undefined) {
          turtle.x = o.x;
          turtle.y = o.y;
          turtle.facing = o.facing;
          turtle.color = o.color;
        }
      }
      for (let i = 0; i < constants[symbol].length; i++) {
        const [verb, arg] = constants[symbol][i];
        verbs[verb](arg);
      }
    } else if (variables[symbol] != undefined) {
      //      console.log(280, va[c])
      for (let i = 0; i < variables[symbol][1].length; i++) {
        const [verb, arg] = variables[symbol][1][i];
        verbs[verb](arg);
      }
    } else {
      break;
    }
  }
}

function weighted_random(items: unknown[], weights: number[]) {
  // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
  let i: number;

  for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;

  const random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return items[i];
}

// Unused so far, but I have plans
//const start_y = 256;
//const start_x = start_y;
//
//function drawMany(n, turtle, applyFn, compFn, iters, alphabet) {
//  turtle.x -= 128 * n;
//  for (let i = 1; i <= n; i++) {
//    const cGreen = { r: 90, g: 194, b: 93, a: 0.6 };
//    //   console.log("drawn ", i);
//    turtle.facing = "N";
//    turtle.x += 52 * n + iters * n;
//    turtle.y = start_y;
//    turtle.color = cGreen;
//    //    turtle.shade(0.01)
//    applyFn(turtle, alphabet.axiom, compFn, iters, alphabet);
//  }
//}
