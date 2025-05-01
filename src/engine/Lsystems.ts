import {Turtle, Color, clamp} from "./turtle";
import { IAlphabet } from "../types/Lsystems";

export function applyRules(
  turtle: Turtle,
  sentence: string,
  fn,
  n: number,
  alphabet: IAlphabet)
{
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
export function computeSentence(s, a) {
  let end = "";
  let va = a.variables;
  let cn = a.constants;
  let pr = a.probs;

  for (let i = 0; i < s.length; i++) {
    let c = s[i];
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

export var drawCommands:[string, number][] = []

function draw(s: string, t: Turtle, a: IAlphabet) {
  interface StackFrame {
    x: number;
    y: number;
    facing: string;
    color: Color;
  }
  let stack:StackFrame[];
  let va = a.variables;
  let cn = a.constants;
  let pr = a.probs;
  //console.log(a.name);

  let verbs = Turtle.drawOps(t);

  stack = [];
  for (let i = 0; i <= s.length; i++) {
    let c = s[i];
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
        let o = stack.pop();
        if (o !== undefined) {
          t.x = o.x;
          t.y = o.y;
          t.facing = o.facing;
          t.color = o.color;
        }
      }
      for (let i = 0; i < cn[c].length; i++) {
        let [verb, arg] = cn[c][i];
        verbs[verb](arg);
      }
    } else if (va[c] != undefined) {
//      console.log(280, va[c])
      for (let i = 0; i < va[c][1].length; i++) {
        let [verb, arg] = va[c][1][i];
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
