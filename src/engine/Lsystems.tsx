import {Turtle, Color, clamp} from "./Turtle";
import { IAlphabet } from "../types/lsystems";

export function applyRules(t, sentence, fn, n, alphabet) {
  let end = sentence;
  for (var i = 1; i <= n; i++) {
    //console.log(end);
    end = fn(end, alphabet);
    if (i == n) {
      draw(end, t, alphabet);
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

export const exampleAlphabet: IAlphabet = {
  // Fields: name, axiom, variables, constants, probs
  name: "Example/Documentation Alphabet",

  // Starting sentence.
  axiom: "B",

  // The keys of the following data structures should be single characters and are read by computeSentence(); recursively.
  //
  // variables: Predecessor characters re-written by the successor string in [0].
  //   The production word (successor) should only contain characters defined in variables, constants, or probs
  //   The array (value[1]) of arrays correspond to turtle commands run by draw()
  //   see draw() for documentation on DSL.
  variables: {
    C: ["CC", [["fwd", 2]]],
    B: [
      "CB",
      [
        ["fwd", 2],
        ["tcw", 2],
        ["fwd", 1],
      ],
    ],
  },

  // constants: Like variables, but do not have a successor. Draw commands belong in the same form as in variables.
  //  Special constants:
  //    [ : pushes turtle position, orientation, and color to a stack during draw();
  //    ] : pops the stack, returning above values to where they were before.
  //  There is no validation for balancing the brackets. Expect undefined weirdness for unbalanced brackets.
  constants: { "[": [["tcw", 2]], "]": [["tcc", 2]] },

  // probs: Like variables, but no draw commands, and the successor words are chosen by chances in values[n][1] (eg, 0.5 = 50% chance)
  //  todo: add default for p<1.0
  // My personal naming convention uses lowercase letters for prob predecessors.
  probs: {
    b: [
      ["C[b]", 0.5], // 50/50 chance to get "C[b]" or "b[C]"
      ["b[C]", 0.5],
    ],
  },
};
export const binaryTreeAlphabet: IAlphabet = {
  name: "Binary Tree",
  axiom: "B",
  //variables: process rule [0], drawing commands and parameters in [1]
  variables: { A: ["AA", [["fwd", 2]]], B: ["A[B]B", [["fwd", 2]]] },
  //constants: draw commands, params (no re-write rules).
  constants: { "[": [["tcw", 2]], "]": [["tcc", 2]] },
};
export const probAlphabet: IAlphabet = {
  name: "Prob",
  axiom: "y",
  variables: {
    F: ["F", [["fwd", 1]]],
    //"X": ["FF[VF[FFYFF[Q]]]", [["fwd", 1]]],
    X: ["XF[++XIF]X[F[--Fq]]", [["fwd", 1]]],
    B: ["F[v[[F]FX]vX[[Fq]]]", [["fwd", 1]]],
    I: ["[vXFvB]", [["nop"]]],
    U: ["U", [["tup", 1]]],
    T: ["", [["tnt", 0.01]]],
    S: ["", [["shd", 0.01]]],
  },
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    R: [
      ["cr+", 25],
      ["cg-", 25],
    ],
    D: [["cr+", 25]],
    "+": [["tcc", 1]],
    "-": [["tcw", 1]],
  },
  probs: {
    y: [
      ["FF[XvTDTT[vFB]]", 0.5],
      ["FF[XvSDSS[vFB]]", 0.5],
    ],
    c: [
      ["TTTT", 0.5],
      ["SSSS", 0.5],
    ],
    v: [
      ["-", 0.5],
      ["+", 0.5],
    ],
    q: [
      ["FFFU+++RRRRRccc[F----F----F----F----F----F]", 0.1],
      ["y", 0.9],
    ],
  },
};
export const fernAlphabet = {
  //variables: process rule [0], drawing commands and parameters in [1]
  name: "Fern (var. 3)",
  variables: {
    F: ["FF", [["fwd", 1]]],
    //'X': ["F+[[X]-X]-F[-FX]+X",
    //'X': ["F+[[X]+X]-F[-FX]-X+[X]",
    //              'X': ["XF+[X[+X]F]-X[X[-X]-FX[+FX]]",
    Y: ["XY", [["fwd", 2]]],
    X: ["XF+[X[+XF]]-X[X[-XY]-FX[+FX]]", [["nop"]]],
  },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    "+": [["tcw", 1]],
    "-": [["tcc", 1]],
  },
};
export const prodAlphabet = {
  //variables: process rule [0], drawing commands and parameters in [1]
  name: "Fern (var. 4)",
  axiom: "Yv",
  variables: {
    F: ["FF", [["fwd", 1]]],
    //'X': ["F+[[X]-X]-F[-FX]+X",
    //'X': ["F+[[X]+X]-F[-FX]-X+[X]",
    //              'X': ["XF+[X[+X]F]-X[X[-X]-FX[+FX]]",
    Y: ["XY", [["fwd", 2]]],
    U: ["", [["tup", 2]]],
    X: ["XF+[X[+XF]]-X[X[vXY]-FX[vFXq]]", [["nop"]]],
  },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    R: [
      ["cr+", 25],
      ["cg-", 25],
    ],
    D: [["cr+", 25]],
    T: [["tnt", 0.01]],
    S: [["shd", 0.01]],
    "+": [["tcw", 1]],
    "-": [["tcc", 1]],
  },
  probs: {
    y: [
      ["FF[TDDTT[vF]]", 0.5],
      ["FF[SDDSS[vF]]", 0.5],
    ],
    v: [
      ["+", 0.5],
      ["-", 0.5],
    ],
    c: [
      ["TTTT", 0.5],
      ["SSSS", 0.5],
    ],
    q: [
      ["FFFU+++RRRRRcccc[F----F----F----F----F----F]", 0.1],
      ["y", 0.9],
    ],
  }

};
export const dragonCurveAlphabet = {
  name: "Dragon Curve",
  variables: { F: ["F+G", [["fwd", 2]]], G: ["F-G", [["fwd", 2]]] },
  //constants: draw commands, params (no re-write rules).
  constants: {
    "[": [["nop"]],
    "]": [["nop"]],
    "+": [["tcw", 4]],
    "-": [["tcc", 4]],
  },
};

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
