import React from 'react';
import { Problem, CompletedProblems } from '../types/Problem';
import { ExternalLink, Eye, EyeOff, Check } from 'lucide-react';
import { isProblemCompleted } from '../utils/storageUtils';

interface ProblemTableProps {
  problems: Problem[];
  showTags: boolean;
  onToggleTags: () => void;
  completedProblems: CompletedProblems;
  onToggleCompletion: (problemTitle: string) => void;
}

const ProblemTable: React.FC<ProblemTableProps> = ({ 
  problems, 
  showTags, 
  onToggleTags, 
  completedProblems, 
  onToggleCompletion 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'hard':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const isCompleted = (problemTitle: string): boolean => {
    return isProblemCompleted(problemTitle, completedProblems);
  };

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No problems found</p>
        <p className="text-sm mt-2">Select a company and duration to view problems</p>
      </div>
    );
  }

  const completedCount = problems.filter(problem => isCompleted(problem.title)).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">
            Problems ({problems.length})
          </h2>
          {completedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
              <Check size={16} className="text-green-400" />
              <span className="text-sm text-green-300">
                {completedCount} completed ({Math.round((completedCount / problems.length) * 100)}%)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleTags}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showTags ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="text-sm">{showTags ? 'Hide' : 'Show'} Tags</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800/50 rounded-lg overflow-hidden">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Done
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Acceptance
              </th>
              {showTags && (
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Topics
                </th>
              )}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {problems.map((problem, index) => {
              const completed = isCompleted(problem.title);
              return (
                <tr
                  key={index}
                  className={`hover:bg-gray-700/30 transition-colors ${
                    completed ? 'bg-green-500/5 border-l-4 border-green-500/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleCompletion(problem.title)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
                        completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-500 hover:border-green-400'
                      }`}
                      title={completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {completed && <Check size={14} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        problem.difficulty
                      )} ${completed ? 'opacity-60' : ''}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {problem.title}
                  </td>
                  <td className={`px-6 py-4 ${completed ? 'text-gray-500' : 'text-gray-300'}`}>
                    {problem.frequency}
                  </td>
                  <td className={`px-6 py-4 ${completed ? 'text-gray-500' : 'text-gray-300'}`}>
                    {problem.acceptanceRate}
                  </td>
                  {showTags && (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {problem.topics.split(',').map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className={`px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded ${
                              completed ? 'opacity-50' : ''
                            }`}
                          >
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {problem.link && (
                      <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 transition-colors ${
                          completed 
                            ? 'text-gray-500 hover:text-gray-400' 
                            : 'text-blue-400 hover:text-blue-300'
                        }`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Progress Summary */}
      {problems.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">
              {completedCount} / {problems.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / problems.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0%</span>
            <span className="text-green-400 font-medium">
              {Math.round((completedCount / problems.length) * 100)}%
            </span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemTable;