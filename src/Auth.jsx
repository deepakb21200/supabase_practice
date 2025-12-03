import React, { useState } from 'react'
import { supabase } from './supabase-client'
function Auth() {
      const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(isSignIn){
        const { error } = await supabase.auth.signInWithPassword({email, password})
        if(error){
            console.error('Error while SignIn: ', error.message)
        }
    }else{
        const { error } = await supabase.auth.signUp({email, password})
        if(error){
            console.error('Error while SignUp: ', error.message)
        }
    }
  };

    return (
    <div className="auth-container">
      <h1 className="auth-title">{isSignIn ? "Sign In" : "Sign Up"}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="auth-button">
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="auth-toggle">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="auth-link"
          onClick={() => {
            setIsSignIn(!isSignIn);
            setEmail("");
            setPassword("");
          }}
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
}

export default Auth


//first time signup hone me supabase ek email bhejega means confirmation email ki
//password- deepakbisht@5678
