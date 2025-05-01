import { AppReducerProps } from "../../types/AppState";
import { Axiom } from "./Axiom";
import { Constants } from "./Constants";
import { Name } from "./Name";
import { Probs } from "./Probs";
import { Variables } from "./Variables";

export function Controls({ state, dispatch }: AppReducerProps) {
  //  console.log(alphabet);
  return (
    <div>
      <Name alphabet={state.alphabet} dispatch={dispatch} />
      <Axiom alphabet={state.alphabet} dispatch={dispatch} />
      <Variables state={state} dispatch={dispatch} />
      <Constants state={state} dispatch={dispatch} />
      <Probs state={state} dispatch={dispatch} />
    </div>
  );
}
