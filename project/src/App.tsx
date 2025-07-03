import React, { useState, useEffect } from 'react';
import { Code2, Database } from 'lucide-react';
import Selector from './components/Selector';
import TagFilter from './components/TagFilter';
import ProblemTable from './components/ProblemTable';
import LoadingSpinner from './components/LoadingSpinner';
import { Problem, CompanyData, CompletedProblems } from './types/Problem';
import { parseCSV } from './utils/csvParser';
import { getCompletedProblems, toggleProblemCompletion, isProblemCompleted } from './utils/storageUtils';
import { getStoredSettings, saveSetting } from './utils/settingsUtils';

// All available tags for filtering
const ALL_TAGS = [
  'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math', 'Sorting', 'Greedy',
  'Depth-First Search', 'Binary Search', 'Database', 'Matrix', 'Tree', 'Breadth-First Search',
  'Bit Manipulation', 'Two Pointers', 'Prefix Sum', 'Heap (Priority Queue)', 'Simulation',
  'Binary Tree', 'Stack', 'Graph', 'Counting', 'Sliding Window', 'Design', 'Enumeration',
  'Backtracking', 'Union Find', 'Linked List', 'Number Theory', 'Ordered Set', 'Monotonic Stack',
  'Segment Tree', 'Trie', 'Combinatorics', 'Bitmask', 'Queue', 'Recursion', 'Divide and Conquer',
  'Binary Indexed Tree', 'Memoization', 'Geometry', 'Hash Function', 'Binary Search Tree',
  'String Matching', 'Topological Sort', 'Shortest Path', 'Rolling Hash', 'Game Theory',
  'Interactive', 'Data Stream', 'Monotonic Queue', 'Brainteaser', 'Doubly-Linked List',
  'Randomized', 'Merge Sort', 'Counting Sort', 'Iterator', 'Concurrency', 'Probability and Statistics',
  'Quickselect', 'Suffix Array', 'Line Sweep', 'Bucket Sort', 'Minimum Spanning Tree', 'Shell',
  'Reservoir Sampling', 'Strongly Connected Component', 'Eulerian Circuit', 'Radix Sort',
  'Rejection Sampling', 'Biconnected Component'
];

function App() {
  const [companies] = useState<CompanyData[]>([
    { name: 'Google', durations: ['30 Days', '3 Months', '6 Months', 'All'] },
    { name: 'Meta', durations: ['30 Days', '3 Months', '6 Months', 'All'] },
    { name: 'Amazon', durations: ['30 Days', '3 Months', '6 Months', 'All'] },
    { name: 'Microsoft', durations: ['30 Days', '3 Months', '6 Months', 'All'] },
    { name: 'Apple', durations: ['30 Days', '3 Months', '6 Months', 'All'] },
    { name: 'Fraz', durations: ['All'] }
  ]);
  
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showTags, setShowTags] = useState<boolean>(true);
  const [completedProblems, setCompletedProblems] = useState<CompletedProblems>({});

  const availableDurations = selectedCompany 
    ? companies.find(c => c.name === selectedCompany)?.durations || []
    : [];

  useEffect(() => {
    // Load completed problems and settings from localStorage on app start
    setCompletedProblems(getCompletedProblems());
    
    const storedSettings = getStoredSettings();
    if (storedSettings.selectedCompany) {
      setSelectedCompany(storedSettings.selectedCompany);
    }
    if (storedSettings.selectedDuration) {
      setSelectedDuration(storedSettings.selectedDuration);
    }
    if (storedSettings.selectedTags) {
      setSelectedTags(storedSettings.selectedTags);
    }
    if (typeof storedSettings.showTags === 'boolean') {
      setShowTags(storedSettings.showTags);
    }
  }, []);

  useEffect(() => {
    if (selectedCompany && selectedDuration) {
      loadProblems(selectedCompany, selectedDuration);
    } else {
      setProblems([]);
      setFilteredProblems([]);
    }
  }, [selectedCompany, selectedDuration]);

  // Filter problems based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredProblems(problems);
    } else {
      const filtered = problems.filter(problem => {
        const problemTags = problem.topics.split(',').map(tag => tag.trim());
        return selectedTags.some(selectedTag => 
          problemTags.some(problemTag => 
            problemTag.toLowerCase().includes(selectedTag.toLowerCase()) ||
            selectedTag.toLowerCase().includes(problemTag.toLowerCase())
          )
        );
      });
      setFilteredProblems(filtered);
    }
  }, [problems, selectedTags]);

  const generateProblemId = (company: string, duration: string, title: string): string => {
    return `${company}-${duration}-${title}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  };

  const getCSVFileName = (duration: string): string => {
    const fileMap: { [key: string]: string } = {
      '30 Days': '1. Thirty Days.csv',
      '3 Months': '2. Three Months.csv',
      '6 Months': '3. Six Months.csv',
      'All': '5. All.csv'
    };
    return fileMap[duration] || '';
  };

  const loadProblems = async (company: string, duration: string) => {
    setLoading(true);
    setError('');
    
    try {
      const fileName = getCSVFileName(duration);
      const csvPath = `/problems/${company}/${fileName}`;
      
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`Failed to load CSV file: ${csvPath}`);
      }
      
      const csvText = await response.text();
      const parsedProblems = parseCSV(csvText);
      
      // Add unique IDs to problems
      const problemsWithIds = parsedProblems.map(problem => ({
        ...problem,
        id: generateProblemId(company, duration, problem.title)
      }));
      
      setProblems(problemsWithIds);
    } catch (err) {
      console.error('Error loading problems:', err);
      setError(`Failed to load problems for ${company} - ${duration}. Please ensure the CSV file exists at the correct path.`);
      setProblems([]);
      
      // Fallback to sample data for demonstration
      const sampleProblems = generateSampleProblems(company, duration);
      setProblems(sampleProblems);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleProblems = (company: string, duration: string): Problem[] => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const topics = [
      'Array,Hash Table',
      'Dynamic Programming,String',
      'Tree,Depth-First Search',
      'Graph,Breadth-First Search',
      'Math,Binary Search',
      'Greedy,Two Pointers',
      'Stack,Queue',
      'Linked List,Recursion'
    ];

    const problemTitles = [
      'Two Sum',
      'Add Two Numbers',
      'Longest Substring Without Repeating Characters',
      'Median of Two Sorted Arrays',
      'Longest Palindromic Substring',
      'ZigZag Conversion',
      'Reverse Integer',
      'String to Integer (atoi)',
      'Palindrome Number',
      'Regular Expression Matching',
      'Container With Most Water',
      'Integer to Roman',
      'Roman to Integer',
      '3Sum',
      '3Sum Closest'
    ];

    const sampleCount = duration === '30 Days' ? 8 : duration === '3 Months' ? 12 : duration === '6 Months' ? 15 : 20;
    
    return Array.from({ length: sampleCount }, (_, index) => {
      const title = `${company} - ${problemTitles[index % problemTitles.length]}`;
      return {
        difficulty: difficulties[index % 3],
        title,
        frequency: `${Math.floor(Math.random() * 100) + 1}%`,
        acceptanceRate: `${Math.floor(Math.random() * 80) + 20}%`,
        link: 'https://leetcode.com/problems/two-sum/',
        topics: topics[index % topics.length],
        id: generateProblemId(company, duration, title)
      };
    });
  };

  const handleToggleCompletion = (problemTitle: string) => {
    const updatedCompleted = toggleProblemCompletion(problemTitle);
    setCompletedProblems(updatedCompleted);
  };

  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    setSelectedDuration('');
    saveSetting('selectedCompany', company);
    saveSetting('selectedDuration', '');
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
    saveSetting('selectedDuration', duration);
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    saveSetting('selectedTags', tags);
  };

  const handleToggleTags = () => {
    const newShowTags = !showTags;
    setShowTags(newShowTags);
    saveSetting('showTags', newShowTags);
  };

  const completedCount = filteredProblems.filter(problem => 
    isProblemCompleted(problem.title, completedProblems)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 size={40} className="text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Coding Problems Dashboard</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Browse coding problems by company and time period
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Selector
              label="Company"
              value={selectedCompany}
              options={companies.map(c => c.name)}
              onChange={handleCompanyChange}
              placeholder="Choose a company"
            />
            
            <Selector
              label="Duration"
              value={selectedDuration}
              options={availableDurations}
              onChange={handleDurationChange}
              placeholder="Choose duration"
            />

            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              availableTags={ALL_TAGS}
            />
          </div>
          
          {selectedCompany && selectedDuration && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300">
                  <Database size={16} />
                  <span className="text-sm">
                    Showing problems for <strong>{selectedCompany}</strong> - <strong>{selectedDuration}</strong>
                    {selectedTags.length > 0 && (
                      <span className="ml-2">
                        filtered by <strong>{selectedTags.length}</strong> tag{selectedTags.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                </div>
                {filteredProblems.length > 0 && (
                  <div className="text-sm text-blue-300">
                    <span className="font-medium">{completedCount}</span> of <span className="font-medium">{filteredProblems.length}</span> completed
                    {completedCount > 0 && (
                      <span className="ml-2 text-green-400">
                        ({Math.round((completedCount / filteredProblems.length) * 100)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : (
            <ProblemTable
              problems={filteredProblems}
              showTags={showTags}
              onToggleTags={handleToggleTags}
              completedProblems={completedProblems}
              onToggleCompletion={handleToggleCompletion}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-medium text-white mb-3">Setup Instructions</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>To use with your actual CSV files:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a <code className="bg-gray-700 px-2 py-1 rounded">public/problems</code> folder</li>
              <li>Add your company folders (e.g., <code className="bg-gray-700 px-2 py-1 rounded">public/problems/Google</code>)</li>
              <li>Place your CSV files in each company folder:</li>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><code className="bg-gray-700 px-1 rounded">1. Thirty Days.csv</code></li>
                <li><code className="bg-gray-700 px-1 rounded">2. Three Months.csv</code></li>
                <li><code className="bg-gray-700 px-1 rounded">3. Six Months.csv</code></li>
                <li><code className="bg-gray-700 px-1 rounded">5. All.csv</code></li>
              </ul>
              <li>The application will automatically load from these files</li>
            </ol>
            <p className="mt-3 text-blue-300">
              <strong>Note:</strong> Your completion progress and settings (company, duration, tags, show/hide tags) are automatically saved in your browser's local storage and will be restored when you return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;