export interface TestStep {

  id: string;

  description: string;

  action: string;

  target: string;

  value?: string;

  expected?: string;
}