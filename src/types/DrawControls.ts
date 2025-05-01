export interface DrawSettings {
  width: number;
  height: number;
  scale: number;
  iters: number;
  count: number;
}

export interface DrawControlProps {
  settings: DrawSettings;
  setFn: (settings: DrawSettings) => void;
  dispatch: (action: { type: string }) => void;
}
