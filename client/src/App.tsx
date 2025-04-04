import Sidebar from './layout/Sidebar';
import ActivityWall from './views/ActivityWall/ActivityWall';
import GuestRoute from './views/GuestRoute/GuestRoute';
import PostPage from './views/PostPage/PostPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import SignInForm from './views/SignInForm/SignInForm';
import SignUpForm from './views/SignUpForm/SignUpForm';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="max-w-2xl min-h-screen flex flex-col mx-auto items-center py-10">
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
