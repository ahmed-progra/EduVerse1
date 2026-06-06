export type VariableState = {
  name: string;
  value: string;
  type: string;
  scope: "local" | "global" | "closure";
};

export type CallFrame = {
  functionName: string;
  line: number;
  variables: VariableState[];
  locals: Record<string, string>;
};

export type ExecutionStep = {
  line: number;
  column: number;
  event: "call" | "return" | "line" | "variable_change" | "exception";
  functionName: string;
  callStack: CallFrame[];
  globals: Record<string, string>;
  stdout: string;
};

export type TraceData = {
  language: string;
  code: string;
  steps: ExecutionStep[];
  totalSteps: number;
  duration: number;
};

export type VisualizationState = {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
};
