import React, { ReactNode } from "react";

// Engine
import { drawOps, opDocs } from "./engine/turtle";

// Controls
import { DrawControls } from "./components/Controls/DrawControls";
import { Controls } from "./components/Controls/Editor";
import { Canvas } from "./components/Canvas/Canvas";
import { ImpExport } from "./components/Controls/ImpExp";

// Reducers
import { alphabetReducer, initAlphabetState } from "./reducers/alphabetReducer";

// Example/Default alphabet
import { prodAlphabet } from "./examples/exampleAlphabets";

// Style
import "./App.css";

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// function drawCmdsToString(t: DrawCommandTuples) {
//   let retstr = "";
//   for (let r of t) {
//     retstr += r + "; ";
//   }
//   return retstr;
// }
//
// function drawCmdsFromString(s: string) {
//   for (let c of s) {
//     let cmdStr = "";
//     console.log(c);
//   }
// }
//
// function CommandTupleInput({
//   value,
//   cmds,
// }: {
//   value: CommandTuple;
//   cmds: string[];
// }): React.ReactElement[] {
//   return cmds.map((input, index) => {
//     return input === value[0] ? (
//       <option value={input}>{input}</option>
//     ) : (
//       <option value={input}>{input}</option>
//     );
//   });
// }

function App() {
  //  const [currentAlphabet, setCurrentAlphabet] = React.useState(exampleAlphabet);
  const [state, dispatch] = React.useReducer(
    alphabetReducer,
    prodAlphabet,
    //binaryTreeAlphabet,
    initAlphabetState,
  );
  const [drawSettings, setDrawSettings] = React.useState({
    width: 150,
    height: 150,
    scale: 4,
    iters: 5,
    count: 1,
  });
  console.log("render app");
  console.log(drawOps);
  return (
    <ErrorBoundary>
      <div className="container">
        <DrawControls settings={drawSettings} setFn={setDrawSettings} dispatch={dispatch} />
        <Canvas
          width={drawSettings.width}
          height={drawSettings.height}
          scale={drawSettings.scale}
          iters={drawSettings.iters}
          state={state}
        />
        <Controls state={state} dispatch={dispatch} />
        <ImpExport state={state} dispatch={dispatch} />
      </div>
      <div className="documentation">
        <h1>Documentation</h1>
        <h2>Info about Experimental UI:</h2>
        <h3>Uh what are these letters and what do they have to do with the plants??????</h3>
        <p>
          The plants are drawn using procedures defined as L-systems, which are a family of
          rewriting rules, specifically made to replicate biological processes like cellular
          development. Each plant starts as a single sentence, called the &quot;axiom&quot;. The
          characters (letters) in the axiom are replaced recursively (which means the result of the
          first replacement is used as the start for the next). So, if you have an axiom &quot;
          {state.alphabet.axiom}&quot;, the rewriter will start with the first letter (&quot;
          {state.alphabet.axiom[0]}&quot;), and replace it with the successor string (found next to
          that letter in the controls interface), if it has one.
        </p>
        <p>
          After a certain number of iterations ({drawSettings.iters} right now, see: iters control
          in the top left), the plant will be drawn by a simple turtle language. The turtle reads
          each predecessor in the resulting string of the recursive rewrite process (usually very
          long, at least with complex rules) and executes the commands. You can view the commands
          and a brief description of what they do below.
        </p>
        <h3>Some notes about programming these things:</h3>
        <ul>
          <li>
            Predecessors are the single character letters that are read by the rewriter. They are
            the first, short box in each of the right hand controls.
          </li>
          <li>
            What happens to the predecessor when it&quot;s being read depends on what type of rule
            it is.
          </li>
          <li>
            Variable rules are rewritten by the successor strings (they come after the predecessors
            in the UI as well).
          </li>
          <li>
            Successor strings must be composed of valid predecessors, ie. they have to have been
            defined before.
          </li>
          <li>
            Constant rules are not rewritten (equivalent to a variable with an empty successor)
          </li>
          <li>There are two special constants: &apos;[&apos; and &apos;]&apos;.</li>
          <li>
            No matter what you do (short of modifying the code), they will always push and pop the
            current turtle location, direction, and color
          </li>
          <li>
            Probabilistic rules do not have associated draw commands and have their preds replaced
            with a defined random chance.
          </li>
          <li>Probabilistic predecessors have lowercase names by arbitrary convention.</li>
          <li>
            Currently the Probs interface does not work. Savvy users should be able to manually edit
            the JSON from the exported string. (I wanted to get something out there for people to
            play with :))
          </li>
          <li>
            Each letter used in any successor string must be found in a predecessor slot (which is)
          </li>
        </ul>

        <h3>Other things to consider:</h3>
        <ul>
          <li>
            Currently can&apos;t remove draw commands (just use a nop if you add one by mistake)
          </li>
          <li>You also can&apos;t move them around</li>
          <li>
            Adding new rules and renaming preds is... weird (buggy). If you want to make a
            completely new alphabet, do it from scratch following the object structure and import it
            :)
          </li>
          <li>
            Object members don&apos;t update when settings are imported, though the drawing will
            change.
          </li>
          <li>
            Some controls don&apos;t work, like the Probabilistic controls, or the count option.
          </li>
          <li>Some state is wonky and might not get exported properly. Sorry about that :(</li>
          <li>
            Generally just expect bugs. I just wanted to get something kinda working so people can
            play around and share things.
          </li>
          <li>Be sure to hit Export to the right and copy the text above to share!</li>
        </ul>

        <h2>Drawing Operations</h2>
        <p>
          The plants are drawn with a simple turtle that reads the draw commands when reading the
          final string generated by the recursive application of the rules. A turtle is a simple way
          to draw graphics from a set of instructions. This turtle can rotate (clockwise <i>and</i>{" "}
          counterclockwise!) and move forward. It can also change its color.
        </p>
        <h4>Available drawing commands are:</h4>
        <ul>
          {drawOps.map((inp, idx) => (
            <li key={idx}>
              <pre>{inp !== "nop" ? inp + " n" : inp}</pre>-{opDocs[idx]}
            </li>
          ))}
        </ul>
      </div>
    </ErrorBoundary>
  );
}
//for (let i = 0; i < data.length; i += 4) {
//  let x = (i / 4) % imageData.width;
//  let y = Math.floor((i / 4) / imageData.width);
//
//  data[i] = ((y == 5) && (x == 5)) ? 255 : 0 ;        //red
//  data[i+1] = 0; //green
//  data[i+2] = ((y == 5) && (x == 5)) ? 255 : 0; //blue
//  data[i+3] = 255;      //alpha
//}
//ctx.fillRect(15,30,1,2);
//ctx.fillRect(16,28,1,2);

export default App;
