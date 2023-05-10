import "./App.css";
import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Category } from "./components/forumPage/forumPage";

import TopicPage from "./components/topicPage/topicPage";
import Header from "./components/header/header";
import ForumPage from "./components/forumPage/forumPage";
import LoginPage from "./components/loginPage/loginPage";
import SignupPage from "./components/signUp/signupPage";
import ForgotPasswordPage from "./components/loginPage/forgetPasswordPage/forgetPasswordPage";
import UserProfilePage from "./components/userProfile/userProfile";

function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  return (
    <Router>
      <div id="root">
        <Header />
        <div className="h-full mx-24">
          <Routes>
            <Route path="/" element={<ForumPage />} index />
            <Route path="/category/:name" element={<TopicPage />} />
            <Route
              path="/login"
              element={<LoginPage setUserEmail={setUserEmail} />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
