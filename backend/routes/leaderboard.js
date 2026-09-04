const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Fetch Leaderboard
router.get('/', async (req, res) => {
  const { data: leaderboard, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_score', { ascending: false })
    .order('submitted_at', { ascending: true })
    .limit(50);
    
  if (error) return res.status(500).json({ error: error.message });
  
  res.json(leaderboard);
});

module.exports = router;
