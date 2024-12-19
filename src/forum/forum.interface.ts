export interface IReason {
  content_type: string;
  keywords: string[];
  explanation: string;
}

export interface IDetecToxic {
  main_result: string;
  reason: IReason[];
}
