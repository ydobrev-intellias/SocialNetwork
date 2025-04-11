import { useEffect } from 'react';
import Sidebar from './layout/Sidebar';
import ActivityWall from './views/ActivityWall/ActivityWall';
import GuestRoute from './views/GuestRoute/GuestRoute';
import Messages from './views/Messages/Messages';
import PostPage from './views/PostPage/PostPage';
import ProfilePage from './views/ProfilePage/ProfilePage';
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute';
import SignInForm from './views/SignInForm/SignInForm';
import SignUpForm from './views/SignUpForm/SignUpForm';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { messageActions } from './redux/slices/messageSlice';
import { notificationActions } from './redux/slices/notificationSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(messageActions.connect({ userId: user.id }));
      dispatch(notificationActions.connect({ userId: user.id }));
    }

    return () => {
      dispatch(messageActions.disconnect());
      dispatch(notificationActions.disconnect());
    };
  }, [isAuthenticated, dispatch]);
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-32 md:ml-64 flex-1 px-5">
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
              <Route element={<ProtectedRoute />}>
                <Route path="/messages" element={<Messages />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
