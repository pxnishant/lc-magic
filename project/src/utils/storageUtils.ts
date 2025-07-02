import { CompletedProblems } from '../types/Problem';

const STORAGE_KEY = 'coding-problems-completed';

export const getCompletedProblems = (): CompletedProblems => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading completed problems from storage:', error);
    return {};
  }
};

export const saveCompletedProblems = (completed: CompletedProblems): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch (error) {
    console.error('Error saving completed problems to storage:', error);
  }
};

// Extract clean problem title from potentially prefixed titles
export const extractProblemTitle = (title: string): string => {
  // Remove company prefixes like "Google - ", "Meta - ", etc.
  const cleanTitle = title.replace(/^[A-Za-z]+ - /, '').trim();
  return cleanTitle;
};

export const toggleProblemCompletion = (problemTitle: string): CompletedProblems => {
  const completed = getCompletedProblems();
  const cleanTitle = extractProblemTitle(problemTitle);
  completed[cleanTitle] = !completed[cleanTitle];
  saveCompletedProblems(completed);
  return completed;
};

export const isProblemCompleted = (problemTitle: string, completed: CompletedProblems): boolean => {
  const cleanTitle = extractProblemTitle(problemTitle);
  return completed[cleanTitle] || false;
};