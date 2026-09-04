import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { allQuestions } from '../questions';

// Generate 45 mixed MCQs
const generateMCQs = () => {
  // Shuffle allQuestions and pick 45
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 45).map((q, idx) => ({
    id: idx + 1,
    question: `Question ${idx + 1}: ${q.prompt}`,
    options: q.options,
    correct: q.options[q.correctIndex]
  }));
};

const allDsaQuestions = [
  {
    id: 1,
    title: 'Maximum Path Quality of a Graph',
    description: '<p>There is an undirected graph with <code>n</code> nodes numbered from <code>0</code> to <code>n - 1</code> (inclusive). You are given a 0-indexed integer array <code>values</code> where <code>values[i]</code> is the value of the <code>i<sup>th</sup></code> node. You are also given a 0-indexed 2D integer array <code>edges</code>, where each <code>edges[j] = [u<sub>j</sub>, v<sub>j</sub>, time<sub>j</sub>]</code> indicates that there is an undirected edge between the nodes <code>u<sub>j</sub></code> and <code>v<sub>j</sub></code>, and it takes <code>time<sub>j</sub></code> seconds to travel between the two nodes. Finally, you are given an integer <code>maxTime</code>.</p><p>A <strong>valid path</strong> in the graph is any path that starts at node <code>0</code>, ends at node <code>0</code>, and takes <strong>at most</strong> <code>maxTime</code> seconds to complete. You may visit the same node multiple times. The <strong>quality</strong> of a valid path is the <strong>sum</strong> of the values of the <strong>unique nodes</strong> visited in the path (each node\'s value is added <strong>at most once</strong> to the quality).</p><p>Return <em>the <strong>maximum</strong> quality of a valid path</em>.</p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> values = [0,32,10,43], edges = [[0,1,10],[1,2,15],[0,3,10]], maxTime = 49\n<strong>Output:</strong> 75\n<strong>Explanation:</strong>\nOne possible path is 0 -> 1 -> 0 -> 3 -> 0. The total time taken is 10 + 10 + 10 + 10 = 40 <= 49.\nThe nodes visited are 0, 1, and 3, giving a maximal path quality of 0 + 32 + 43 = 75.</pre><br><strong>Constraints:</strong><ul><li><code>n == values.length</code></li><li><code>1 <= n <= 1000</code></li><li><code>0 <= values[i] <= 10<sup>8</sup></code></li><li><code>0 <= edges.length <= 2000</code></li><li><code>edges[j].length == 3</code></li><li><code>0 <= u<sub>j</sub> < v<sub>j</sub> <= n - 1</code></li><li><code>10 <= time<sub>j</sub>, maxTime <= 100</code></li><li>All the pairs <code>[u<sub>j</sub>, v<sub>j</sub>]</code> are <strong>unique</strong>.</li><li>There are at most <strong>four</strong> edges connected to each node.</li><li>The graph may not be connected.</li></ul>',
    template: '/**\n * @param {number[]} values\n * @param {number[][]} edges\n * @param {number} maxTime\n * @return {number}\n */\nvar maximalPathQuality = function(values, edges, maxTime) {\n    \n};'
  },
  {
    id: 2,
    title: 'Palindrome Number',
    description: '<p>Given an integer <code>x</code>, return <code>true</code><em> if </em><code>x</code><em> is a </em><span data-keyword="palindrome-integer"><em><strong>palindrome</strong></em></span><em>, and </em><code>false</code><em> otherwise</em>.</p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> x = 121\n<strong>Output:</strong> true\n<strong>Explanation:</strong> 121 reads as 121 from left to right and from right to left.</pre><br><strong>Example 2:</strong><br><pre><strong>Input:</strong> x = -121\n<strong>Output:</strong> false\n<strong>Explanation:</strong> From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.</pre><br><strong>Example 3:</strong><br><pre><strong>Input:</strong> x = 10\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Reads 01 from right to left. Therefore it is not a palindrome.</pre><br><strong>Constraints:</strong><ul><li><code>-2<sup>31</sup> <= x <= 2<sup>31</sup> - 1</code></li></ul><p><strong>Follow up:</strong> Could you solve it without converting the integer to a string?</p>',
    template: '/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};'
  },
  {
    id: 3,
    title: 'Maximal Rectangle',
    description: '<p>Given a <code>rows x cols</code> binary <code>matrix</code> filled with <code>0</code>\'s and <code>1</code>\'s, find the largest rectangle containing only <code>1</code>\'s and return <em>its area</em>.</p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]\n<strong>Output:</strong> 6</pre><br><strong>Constraints:</strong><ul><li><code>rows == matrix.length</code></li><li><code>cols == matrix[i].length</code></li><li><code>1 <= row, cols <= 200</code></li><li><code>matrix[i][j]</code> is <code>\'0\'</code> or <code>\'1\'</code>.</li></ul>',
    template: '/**\n * @param {character[][]} matrix\n * @return {number}\n */\nvar maximalRectangle = function(matrix) {\n    \n};'
  },
  {
    id: 4,
    title: 'Generate Parentheses',
    description: '<p>Given <code>n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses</em>.</p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> n = 3\n<strong>Output:</strong> ["((()))","(()())","(())()","()(())","()()()"]</pre><br><strong>Example 2:</strong><br><pre><strong>Input:</strong> n = 1\n<strong>Output:</strong> ["()"]</pre><br><strong>Constraints:</strong><ul><li><code>1 <= n <= 8</code></li></ul>',
    template: '/**\n * @param {number} n\n * @return {string[]}\n */\nvar generateParenthesis = function(n) {\n    \n};'
  },
  {
    id: 5,
    title: 'Find Minimum in Rotated Sorted Array',
    description: '<p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,2,4,5,6,7]</code> might become:</p><ul><li><code>[4,5,6,7,0,1,2]</code> if it was rotated <code>4</code> times.</li><li><code>[0,1,2,4,5,6,7]</code> if it was rotated <code>7</code> times.</li></ul><p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p><p>Given the sorted rotated array <code>nums</code> of <strong>unique</strong> elements, return <em>the minimum element of this array</em>.</p><p>You must write an algorithm that runs in <code>O(log n) time.</code></p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> nums = [3,4,5,1,2]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The original array was [1,2,3,4,5] rotated 3 times.</pre><br><strong>Constraints:</strong><ul><li><code>n == nums.length</code></li><li><code>1 <= n <= 5000</code></li><li><code>-5000 <= nums[i] <= 5000</code></li><li>All the integers of <code>nums</code> are <strong>unique</strong>.</li><li><code>nums</code> is sorted and rotated between <code>1</code> and <code>n</code> times.</li></ul>',
    template: '/**\n * @param {number[]} nums\n * @return {number}\n */\nvar findMin = function(nums) {\n    \n};'
  },
  {
    id: 6,
    title: 'Next Greater Element I',
    description: '<p>The <strong>next greater element</strong> of some element <code>x</code> in an array is the <strong>first greater</strong> element that is <strong>to the right</strong> of <code>x</code> in the same array.</p><p>You are given two <strong>distinct 0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>.</p><p>For each <code>0 <= i < nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the <strong>next greater element</strong> of <code>nums2[j]</code> in <code>nums2</code>. If there is no next greater element, then the answer for this query is <code>-1</code>.</p><p>Return <em>an array </em><code>ans</code><em> of length </em><code>nums1.length</code><em> such that </em><code>ans[i]</code><em> is the <strong>next greater element</strong> as described above.</em></p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> nums1 = [4,1,2], nums2 = [1,3,4,2]\n<strong>Output:</strong> [-1,3,-1]\n<strong>Explanation:</strong> The next greater element for each value of nums1 is as follows:\n- 4 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.\n- 1 is underlined in nums2 = [1,3,4,2]. The next greater element is 3.\n- 2 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.</pre><br><strong>Constraints:</strong><ul><li><code>1 <= nums1.length <= nums2.length <= 1000</code></li><li><code>0 <= nums1[i], nums2[i] <= 10<sup>4</sup></code></li><li>All integers in <code>nums1</code> and <code>nums2</code> are <strong>unique</strong>.</li><li>All the integers of <code>nums1</code> also appear in <code>nums2</code>.</li></ul>',
    template: '/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number[]}\n */\nvar nextGreaterElement = function(nums1, nums2) {\n    \n};'
  },
  {
    id: 7,
    title: 'Path Sum II',
    description: '<p>Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return <em>all <strong>root-to-leaf</strong> paths where the sum of the node values in the path equals </em><code>targetSum</code><em>. Each path should be returned as a list of the node <strong>values</strong>, not node references</em>.</p><p>A <strong>root-to-leaf</strong> path is a path starting from the root and ending at any leaf node. A <strong>leaf</strong> is a node with no children.</p><br><strong>Example 1:</strong><br><pre><strong>Input:</strong> root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22\n<strong>Output:</strong> [[5,4,11,2],[5,8,4,5]]\n<strong>Explanation:</strong> There are two paths whose sum equals targetSum:\n5 + 4 + 11 + 2 = 22\n5 + 8 + 4 + 5 = 22</pre><br><strong>Constraints:</strong><ul><li>The number of nodes in the tree is in the range <code>[0, 5000]</code>.</li><li><code>-1000 <= Node.val <= 1000</code></li><li><code>-1000 <= targetSum <= 1000</code></li></ul>',
    template: '/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @param {number} targetSum\n * @return {number[][]}\n */\nvar pathSum = function(root, targetSum) {\n    \n};'
  }
];

export default function MasterAssessment() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
  const [mcqs, setMcqs] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
  // New status states
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isGridOpen, setIsGridOpen] = useState(true);
  
  const [isDsaPhase, setIsDsaPhase] = useState(false);
  const [dsaIndex, setDsaIndex] = useState(0);
  const [activeDsaQuestions, setActiveDsaQuestions] = useState([]);
  const [dsaCode, setDsaCode] = useState([]);

  useEffect(() => {
    // Select 2 random DSA questions on mount
    const shuffledDsa = [...allDsaQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffledDsa.slice(0, 2);
    setActiveDsaQuestions(selected);
    setDsaCode([selected[0].template, selected[1].template]);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/assessment/master');
        if (res.data.mcqs && res.data.mcqs.length > 0) {
          setMcqs(res.data.mcqs);
        } else {
          setMcqs(generateMCQs());
        }
      } catch (err) {
        setMcqs(generateMCQs());
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          submitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const submitAssessment = async () => {
    // For demo/UI consistency, calculate local score for MCQs
    let localMcqScore = 0;
    mcqs.forEach(q => {
      if (answers[q.id] === q.correct) localMcqScore += 10;
    });

    try {
      const payload = {
        userId: 'e82b7db3-6627-46dc-a070-5b1288c3a9d3', 
        assessmentId: 1,
        mcqAnswers: Object.keys(answers).map(k => ({ questionId: parseInt(k), answer: answers[k] })),
        dsaSubmissions: dsaCode.map((c, i) => ({ code: c, languageId: 63 })),
        localScore: localMcqScore // Sending this so backend can use it if we adapt backend
      };
      
      const response = await axios.post('http://localhost:3000/api/assessment/submit', payload);
      alert(`Assessment Submitted Successfully! Your Score: ${response.data.score}`);
      
    } catch(e) {
      console.error(e);
      alert("Assessment Submitted Successfully locally.");
    }
    // Redirect directly to results tab
    navigate('/results');
  };

  const toggleReview = (index, isDsa) => {
    const key = isDsa ? `dsa_${index}` : `mcq_${index}`;
    const newSet = new Set(markedForReview);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setMarkedForReview(newSet);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const totalQuestions = (mcqs.length || 45) + 2;
  const currentTotalIndex = isDsaPhase ? (mcqs.length || 45) + dsaIndex : currentQuestionIndex;
  const progressPercent = (currentTotalIndex / totalQuestions) * 100;

  if (mcqs.length === 0 || activeDsaQuestions.length === 0) return <div className="loader"></div>;

  // Grid Generation
  const renderGrid = () => {
    const cells = [];
    
    // MCQ Cells
    for (let i = 0; i < mcqs.length; i++) {
      let status = 'unanswered';
      if (answers[mcqs[i].id]) status = 'answered';
      if (markedForReview.has(`mcq_${i}`)) status = 'review';
      
      const isActive = !isDsaPhase && currentQuestionIndex === i;
      cells.push(
        <div 
          key={`mcq-${i}`} 
          className={`grid-cell ${status} ${isActive ? 'active' : ''}`}
          onClick={() => { setIsDsaPhase(false); setCurrentQuestionIndex(i); }}
        >
          {i + 1}
        </div>
      );
    }
    
    // DSA Cells
    for (let j = 0; j < 2; j++) {
      let status = 'unanswered';
      if (dsaCode[j] !== activeDsaQuestions[j].template) status = 'answered'; // simple heuristic
      if (markedForReview.has(`dsa_${j}`)) status = 'review';
      
      const isActive = isDsaPhase && dsaIndex === j;
      cells.push(
        <div 
          key={`dsa-${j}`} 
          className={`grid-cell ${status} ${isActive ? 'active' : ''}`}
          onClick={() => { setIsDsaPhase(true); setDsaIndex(j); }}
        >
          D{j + 1}
        </div>
      );
    }
    
    return cells;
  };

  const currentKey = isDsaPhase ? `dsa_${dsaIndex}` : `mcq_${currentQuestionIndex}`;
  const isMarked = markedForReview.has(currentKey);

  return (
    <section className="dashboard-section active">
      <header className="section-header assessment-header" style={{ marginBottom: '24px' }}>
        <div className="assessment-title">
          <h1>Assessment</h1>
          <span className="timer">{formatTime(timeLeft)}</span>
        </div>
        <div className="assessment-progress">
           <div className="progress-bar"><div className="progress-fill" style={{width: `${progressPercent}%`}}></div></div>
           <span>{currentTotalIndex} / {totalQuestions}</span>
        </div>
      </header>
      
      <div className="assessment-content" style={{ gridTemplateColumns: isGridOpen ? '1fr 320px' : '1fr' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {!isDsaPhase ? (
            <div className="question-area">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <h3 className="question-number" style={{marginBottom: 0}}>Question {currentQuestionIndex + 1} of {mcqs.length}</h3>
                 <div style={{ display: 'flex', gap: '12px' }}>
                   <button 
                     className={`btn btn--sm ${isMarked ? 'btn--primary' : 'btn--ghost'}`} 
                     onClick={() => toggleReview(currentQuestionIndex, false)}
                   >
                     {isMarked ? 'Unmark Review' : 'Mark for Review'}
                   </button>
                   {!isGridOpen && (
                     <button className="btn btn--ghost btn--sm" onClick={() => setIsGridOpen(true)}>
                       Show Navigation
                     </button>
                   )}
                 </div>
               </div>
               <p className="question-text">{mcqs[currentQuestionIndex].question}</p>
               <div className="options-grid">
                  {mcqs[currentQuestionIndex].options.map((opt, i) => (
                    <div 
                      key={i} 
                      className={`option-card ${answers[mcqs[currentQuestionIndex].id] === opt ? 'selected' : ''}`}
                      onClick={() => setAnswers({...answers, [mcqs[currentQuestionIndex].id]: opt})}
                    >
                      {opt}
                    </div>
                  ))}
               </div>
               <div className="question-actions" style={{ marginTop: 'auto', padding: '24px 0', gap: '16px' }}>
                 <button className="btn btn--ghost btn--lg" onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}>Previous</button>
                 <button className="btn btn--primary btn--lg" onClick={() => {
                   if (currentQuestionIndex < mcqs.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
                   else setIsDsaPhase(true);
                 }}>Next</button>
               </div>
            </div>
          ) : (
            <div className="question-area" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div className="dsa-layout" style={{ height: '500px' }}>
                  <div className="dsa-problem">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                       <h3 className="question-number" style={{marginBottom: 0}}>DSA Challenge {dsaIndex + 1} of 2</h3>
                       <div style={{ display: 'flex', gap: '12px' }}>
                         <button 
                           className={`btn btn--sm ${isMarked ? 'btn--primary' : 'btn--ghost'}`} 
                           onClick={() => toggleReview(dsaIndex, true)}
                         >
                           {isMarked ? 'Unmark' : 'Mark for Review'}
                         </button>
                         {!isGridOpen && (
                           <button className="btn btn--ghost btn--sm" onClick={() => setIsGridOpen(true)}>
                             Show Navigation
                           </button>
                         )}
                       </div>
                     </div>
                     <h2>{activeDsaQuestions[dsaIndex].title}</h2>
                     <div className="problem-description" dangerouslySetInnerHTML={{__html: activeDsaQuestions[dsaIndex].description}}></div>
                  </div>
                  <div className="dsa-editor-wrapper">
                     <div className="editor-header">
                        <select className="language-select"><option>JavaScript (Node.js)</option></select>
                     </div>
                     <div className="editor-container">
                       <Editor
                          height="100%"
                          defaultLanguage="javascript"
                          theme="vs-dark"
                          value={dsaCode[dsaIndex]}
                          onChange={(val) => {
                            const newCodes = [...dsaCode];
                            newCodes[dsaIndex] = val;
                            setDsaCode(newCodes);
                          }}
                          options={{ minimap: { enabled: false }, fontSize: 14 }}
                       />
                     </div>
                  </div>
               </div>
               <div className="question-actions" style={{ marginTop: 'auto', padding: '24px 0', gap: '16px' }}>
                 <button className="btn btn--ghost btn--lg" onClick={() => {
                   if (dsaIndex === 1) setDsaIndex(0);
                   else { setIsDsaPhase(false); setCurrentQuestionIndex(mcqs.length - 1); }
                 }}>Previous</button>
                 <button className="btn btn--primary btn--lg" onClick={() => {
                   if (dsaIndex === 0) setDsaIndex(1);
                   else submitAssessment();
                 }}>{dsaIndex === 0 ? 'Next' : 'Submit'}</button>
               </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar Grid */}
        {isGridOpen && (
          <div className="assessment-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h3 style={{ margin: 0, fontSize: '18px' }}>Navigation</h3>
               <button className="btn btn--ghost btn--sm" onClick={() => setIsGridOpen(false)}>Minimize</button>
            </div>
            <div className="grid-legend">
             <div className="legend-item"><div className="legend-box" style={{background: 'var(--accent-green)'}}></div> Answered</div>
             <div className="legend-item"><div className="legend-box" style={{background: '#FFD166'}}></div> Marked for Review</div>
             <div className="legend-item"><div className="legend-box" style={{background: 'rgba(255,255,255,0.05)'}}></div> Not Answered</div>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            <div className="question-grid">
              {renderGrid()}
            </div>
          </div>
          
          <button className="btn btn--primary btn--lg mt-4" style={{width: '100%', padding: '20px', fontSize: '18px'}} onClick={submitAssessment}>
            Finish & Submit
          </button>
        </div>
        )}
      </div>
    </section>
  );
}
