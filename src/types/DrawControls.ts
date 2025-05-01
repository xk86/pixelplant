export interface DrawSettings {
  width: number;
  height: number;
  scale: number;
  iters: number;
  count: number;
}

export interface DrawControlDispatch {
  type: string;
}

export interface DrawControlProps {
  settings: DrawSettings;
  setFn: (settings: DrawSettings) => void;
  dispatch: (action: DrawControlDispatch) => void;
}
