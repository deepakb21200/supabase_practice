import { useEffect, useState } from 'react'
import { supabase } from './supabase-client'    
import './App.css'
import TaskManage from './TaskManage'
import Auth from './Auth'

function App() {
const [userSession, setUserSession] = useState(null);

useEffect(() => {
  fetchUserSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUserSession(session);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);



const fetchUserSession = async () => {
  const currentSession = await supabase.auth.getSession();
  console.log(currentSession.data);
  console.log(currentSession.data.session);

  setUserSession(currentSession.data.session);
};

const logoutHandler = async () => {
  await supabase.auth.signOut();
};


  return (
    <>
   {
    userSession ? 
     <>
       <button onClick={logoutHandler}>Logout</button>
    <TaskManage  session={userSession}/>
    </>: <Auth/>
   }
    </>
  )
}

export default App
