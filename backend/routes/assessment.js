const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const axios = require('axios'); // We need axios for Judge0 API calls

// Fetch Master Assessment
router.get('/master', async (req, res) => {
  // Fetch MCQ and DSA questions
  const { data: mcqs, error: error1 } = await supabase.from('questions').select('*').eq('type', 'mcq');
  const { data: dsa, error: error2 } = await supabase.from('questions').select('*').eq('type', 'dsa');
  
  if (error1 || error2) return res.status(500).json({ error: 'Failed to fetch assessment' });
  
  res.json({ mcqs, dsa });
});

// Submit Assessment
router.post('/submit', async (req, res) => {
  const { userId, assessmentId, mcqAnswers, dsaSubmissions, localScore } = req.body;
  let totalScore = localScore || 0; // Use frontend calculated score if present

  // Verify MCQs
  const { data: questions } = await supabase.from('questions').select('*').eq('type', 'mcq');
  if (questions) {
    mcqAnswers.forEach(ans => {
      const q = questions.find(q => q.id === ans.questionId);
      if (q && q.correct_answer === ans.answer) {
        totalScore += q.points;
      }
    });
  }

  // DSA evaluation via Judge0
  // Note: For a real app, you would submit to Judge0, poll for result, then calculate points.
  // We'll do a simple mock/synchronous approach here for MVP.
  for (const dsa of dsaSubmissions) {
     const sourceCode = dsa.code;
     const languageId = dsa.languageId || 63; // JavaScript (Node.js 12.14.0)

     try {
       // Submit to Judge0
       const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
         source_code: sourceCode,
         language_id: languageId,
         // test cases would be passed here in a real scenario
       }, {
         headers: {
           'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
           'x-rapidapi-key': process.env.JUDGE0_API_KEY || 'demo'
         }
       });
       
       // Here we would normally check the result. 
       // For demo purposes, we will just give points.
       totalScore += 10; 
     } catch (err) {
       console.error("Judge0 submission failed", err);
     }
  }

  // Record submission
  const { data, error } = await supabase.from('submissions').insert([
    { user_id: userId, assessment_id: assessmentId, total_score: totalScore }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  // Emit socket event to update leaderboard
  const io = req.app.get('io');
  io.emit('leaderboard_update', { message: 'Leaderboard updated' });

  res.json({ message: 'Submission successful', score: totalScore });
});

// Fetch User Results
router.get('/results/:userId', async (req, res) => {
  const { userId } = req.params;
  
  const { data: results, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  
  res.json(results);
});

module.exports = router;
