import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare } from 'lucide-react';
import { AppDispatch, RootState } from '@/redux/store';
import { Link, useNavigate } from 'react-router';
import { getProfile, signOut } from '@/redux/slices/authSlice';
import { API_USERS_URL } from '@/config';
import { useEffect } from 'react';

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function handleLogOut() {
    await dispatch(signOut());
    navigate('/login');
  }

  useEffect(() => {
    console.log('Header', user);
    dispatch(getProfile({}));
  }, [dispatch, isAuthenticated]);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-gray-900">
            SocialX
          </Link>
        </div>

        {/* <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div> */}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost">
                <MessageSquare className="h-6 w-6 text-gray-700" />
              </Button>
              <Button variant="ghost">
                <Bell className="h-6 w-6 text-gray-700" />
              </Button>
              <Link to="/profile">
                <Avatar className="border-4 border-white">
                  <AvatarImage
                    className="object-cover"
                    src={user?.avatarPath ? `${API_USERS_URL}${user.avatarPath}` : undefined}
                  />
                  <AvatarFallback>{user?.username[0].toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" onClick={handleLogOut}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
