import Header from './layout/Header';
import ActivityWall from './views/ActivityWall/ActivityWall';
import GuestRoute from './views/GuestRoute/GuestRoute';
import PostPage from './views/PostPage/PostPage';

import ProfilePage from './views/ProfilePage/ProfilePage';

import SignInForm from './views/SignInForm/SignInForm';
import SignUpForm from './views/SignUpForm/SignUpForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="max-w-2xl min-h-screen flex flex-col mx-auto items-center pt-24 pb-10">
        <Routes>
          <Route index element={<ActivityWall />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <SignInForm />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <SignUpForm />
              </GuestRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
