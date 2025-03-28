import Header from './layout/Header';
import GuestRoute from './views/GuestRoute/GuestRoute';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
