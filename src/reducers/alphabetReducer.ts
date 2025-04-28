import { AlphabetState, AllAction } from "../types/AppState";
import { IAlphabet } from "../types/Lsystems";

export function initAlphabetState(alphabet:IAlphabet) {
  return { alphabet: alphabet };
}

export function alphabetReducer(state: AlphabetState, action: AllAction) {
  let na;
  switch(action.type) {
      case 'variable':
        console.log('var alphaReducer', action.payload);
        na = {
          alphabet: {
            ...state.alphabet,
            variables: {
              ...state.alphabet.variables,
              [action.payload.predecessor]: [action.payload.successor, action.payload.drawcmds]
            }
          }
        }
        return na;
      case 'constant':
        na = {
          alphabet: {
            ...state.alphabet,
            constants: {
              ...state.alphabet.constants,
              [action.payload.predecessor]: action.payload.drawcmds
            }
          }
        }
        return na;
      case 'name':
        return { alphabet:
          {...state.alphabet,
           name: action.payload.name} }
      case 'axiom':
        return { alphabet: {...state.alphabet,
          axiom: action.payload.axiom} }
      case 'load':
        na = action.payload;
        return na;
      case 'reset':
        na = initAlphabetState({...state.alphabet});
        console.log(526,na);
        return na;
  }
}