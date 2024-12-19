export interface EvaluateResponse {
  total_score: number;
  evaluation: Evaluation;
  improvements: string[];
  status: string;
  error: any;
}

export interface Evaluation {
  logic_reasoning: LogicReasoning;
  evidence: Evidence;
  structure: Structure;
  language: Language;
  persuasiveness: Persuasiveness;
}

export interface LogicReasoning {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Evidence {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Structure {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Language {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Persuasiveness {
  score: number;
  strengths: any[];
  weaknesses: string[];
}
