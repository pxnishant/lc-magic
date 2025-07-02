export interface Problem {
  difficulty: string;
  title: string;
  frequency: string;
  acceptanceRate: string;
  link: string;
  topics: string;
  id?: string; // Add unique identifier for tracking completion
}

export interface CompanyData {
  name: string;
  durations: string[];
}

export interface CompletedProblems {
  [problemTitle: string]: boolean; // Clean problem title -> completed status
}