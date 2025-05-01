import { Turtle, Color } from "./turtle";
import { IAlphabet } from "../types/Lsystems";

export function applyRules(turtle: Turtle, sentence: string, fn, n: number, alphabet: IAlphabet) {
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
export function computeSentence(s, a) {
  let end = "";
  const va = a.variables;
  const cn = a.constants;
  const pr = a.probs;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    //  console.log(c)
    if (va[c] != undefined) {
      end += va[c][0];
    } else if (cn[c] != undefined) {
      end += c;
    } else if (pr != undefined && pr[c] != undefined) {
      let items = [];
      let probs = [];

      for (let j = 0; j < pr[c].length; j++) {
        items = items.concat(pr[c][j][0]);
        probs = probs.concat(pr[c][j][1]);
      }
      //  console.log(items);
      end += weighted_random(items, probs);
    } else {
      end += "";
    }
  }
  return end;
}

export const drawCommands: [string, number][] = [];

function draw(s: string, t: Turtle, a: IAlphabet) {
  interface StackFrame {
    x: number;
    y: number;
    facing: string;
    color: Color;
  }
  const stack: StackFrame[] = [];
  const va = a.variables;
  const cn = a.constants;
  const pr = a.probs;
  //console.log(a.name);

  const verbs = Turtle.drawOps(t);

  for (let i = 0; i <= s.length; i++) {
    const c = s[i];
    if (pr != undefined && pr[c] != undefined) {
      verbs["nop"]();
    } else if (cn[c] != undefined) {
      if (c === "[") {
        stack.push({
          x: t.x,
          y: t.y,
          facing: t.facing,
          color: Object.assign({}, t.color),
        });
        //        t.color = {r:0,g:127,b:0,a:1};
      } else if (c === "]") {
        const o = stack.pop();
        if (o !== undefined) {
          t.x = o.x;
          t.y = o.y;
          t.facing = o.facing;
          t.color = o.color;
        }
      }
      for (let i = 0; i < cn[c].length; i++) {
        const [verb, arg] = cn[c][i];
        verbs[verb](arg);
      }
    } else if (va[c] != undefined) {
      //      console.log(280, va[c])
      for (let i = 0; i < va[c][1].length; i++) {
        const [verb, arg] = va[c][1][i];
        verbs[verb](arg);
      }
    } else {
      break;
    }
  }
}

function weighted_random(items, weights) {
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
