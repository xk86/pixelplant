import { AppReducerState } from "./AppState";

export interface CanvasProps {
  width: number;
  height: number;
  scale: number;
  iters: number;
  state: AppReducerState;
}
