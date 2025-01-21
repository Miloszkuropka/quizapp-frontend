import { Toaster } from 'react-hot-toast';
import './App.css';
import { Fragment, useState, useEffect } from 'react';
import { LoginContext, LoginProvider } from './context/LoginContext';

import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home/Home.component';
import Login from './components/Login/Login.component';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.component';
import ResetPassword from './components/ForgotPassword/ResetPassword.component';
import AllUsers from './components/AllUsers/AllUsers.component';
import Quiz from './components/Quiz/Quiz.component';
import QuizAttempt from './components/QuizAttempt/QuizAttempt.component';
import AllQuizzes from './components/AllQuizzes/AllQuizzes.component';
import Register from './components/Register/Register.component';
import Authorized from './common/Authorized.component';
import Logout from './components/Logout/Logout.component';
import AppNavbar from './components/AppNavbar/AppNavbar.component';
import QuizResult from './components/QuizResult/QuizResult.component';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound/NotFound';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import QuizStatistics from './components/QuizStatistics/QuizStatistics.component';

//adminowe
import AdminDashboard from './components/AdminDasboard/AdminDashboard.componet';
import LogsTable from './components/SecurityLogs/LogsTable.component';
import UserDetails from './components/UserManagment/UserDetails.component';
import UserForm from './components/UserManagment/UserForm.component';
import UserList from './components/UserManagment/UserList.component';


function App() {
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN)); 

  useEffect(() => {
    const savedToken = localStorage.getItem(ACCESS_TOKEN);
    setToken(savedToken);
  }, []);

  return (
    <LoginProvider>
      <Fragment>
        <BrowserRouter>
          <AppNavbar />
          <Routes>
            {/* Trasy chronione */}
              <Route 
                path="/quiz" 
                element={<ProtectedRoute><Quiz /></ProtectedRoute>}/>
              <Route 
                path="/quiz/attempt/:id" 
                element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>}/>
              <Route 
                path="/quizzes" 
                element={<ProtectedRoute><AllQuizzes /></ProtectedRoute>}/>
              <Route 
                path="/quiz-result/:attemptId" 
                element={<ProtectedRoute><QuizResult /></ProtectedRoute>}/>
              <Route 
                path="/logout" 
                element={<ProtectedRoute><Logout /></ProtectedRoute>}/>
                <Route 
                path="/quiz/:id" 
                element={<ProtectedRoute><Quiz /></ProtectedRoute>}/>

              <Route 
                path="/admin/dashboard" 
                element={<ProtectedRoute adminOnly={true} ><AdminDashboard /></ProtectedRoute>}/>
                <Route 
                path="/admin/logstable" 
                element={<ProtectedRoute adminOnly={true}><LogsTable /></ProtectedRoute>}/>
                <Route 
                path="/admin/userdetails/:userId" 
                element={<ProtectedRoute adminOnly={true}><UserDetails /></ProtectedRoute>}/>
                <Route 
                path="/admin/userform" 
                element={<ProtectedRoute adminOnly={true}><UserForm /></ProtectedRoute>}/>
                <Route 
                path="/admin/userlist" 
                element={<ProtectedRoute adminOnly={true}><UserList /></ProtectedRoute>}/>

                <Route
                path="/statistics"
                element={<ProtectedRoute><QuizStatistics /></ProtectedRoute>}/>


              {/* Trasy publiczne */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset" element={<ResetPassword />} />

              {/* Strona 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        <Toaster />
      </Fragment>
    </LoginProvider>
  );
}

export default App;