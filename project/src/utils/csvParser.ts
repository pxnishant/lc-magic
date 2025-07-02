import { Problem } from '../types/Problem';

export function parseCSV(csvText: string): Problem[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    const values = parseCSVLine(line);
    return {
      difficulty: values[0] || '',
      title: values[1] || '',
      frequency: values[2] || '',
      acceptanceRate: values[3] || '',
      link: values[4] || '',
      topics: values[5] || ''
    };
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}