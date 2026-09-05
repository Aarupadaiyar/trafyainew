const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  
  if (data.user) {
    // create profile
    await supabase.from('profiles').insert([
      { id: data.user.id, email, display_name: displayName }
    ]);
  }

  res.json({ message: 'Signup successful', user: data.user });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  // Generate a custom JWT for our own backend use if needed, 
  // or just return the supabase session token.
  const token = data.session.access_token;
  res.json({ token, user: data.user });
});

module.exports = router;
