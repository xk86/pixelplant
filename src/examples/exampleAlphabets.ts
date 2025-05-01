import { IAlphabet } from "../types/Lsystems";

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

export const prodAlphabet: IAlphabet = {
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
  },
};
