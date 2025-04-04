import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Search, Users, X } from 'lucide-react';
import { AppDispatch, RootState } from '@/redux/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProfile, signOut } from '@/redux/slices/authSlice';
import { API_SEARCH_URL } from '@/config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import UserProfileLink from '@/components/user/UserProfileLink';
import { Post } from '@/types/post';
import { User } from '@/types/user';
import { format } from 'date-fns';

export default function Sidebar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogOut() {
    await dispatch(signOut());
    navigate('/login');
  }

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults({ users: [], posts: [] });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_SEARCH_URL}?query=${value}`, {
        withCredentials: true,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery('');
    setResults({ users: [], posts: [] });
  };

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
    } else {
      closeSearch();
    }
  };

  useEffect(() => {
    closeSearch();
    if (isAuthenticated) {
      dispatch(getProfile({}));
    }
  }, [dispatch, isAuthenticated, navigate, location]);

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-gray-100 text-gray-700'
      : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <>
      {showSearch && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4">
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={closeSearch}>
                <span className="sr-only">Close</span>
                <X size={24} />
              </Button>

              <Input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search users and posts..."
                className="pl-8 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 w-full"
                autoFocus
              />
            </div>

            {isLoading && (
              <div className="absolute w-full bg-white text-gray-500 text-sm p-2 mt-1 rounded-lg shadow-lg">
                Loading...
              </div>
            )}

            {query && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto z-50">
                {results.users?.length > 0 && (
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-700">Users</h3>
                    <ul>
                      {results.users.map((user: User) => (
                        <li
                          key={user?.id}
                          className="py-1 px-2 text-gray-600 cursor-pointer hover:bg-gray-100"
                          onClick={closeSearch}
                        >
                          <UserProfileLink user={user} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.posts?.length > 0 && (
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-700">Posts</h3>
                    <ul>
                      {results.posts.map((post: Post) => (
                        <li
                          key={post?.id}
                          className="py-1 px-2 text-gray-600 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-0"
                          onClick={closeSearch}
                        >
                          <Link to={`/posts/${post.id}`}>
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2">
                                <UserProfileLink activity={post} withLink={false} />
                                <span className="text-xs text-gray-400">
                                  {post.updatedAt
                                    ? `Last updated: ${format(new Date(post.updatedAt), 'dd MMM yyyy, HH:mm')}`
                                    : `Posted on: ${format(new Date(post.createdAt), 'dd MMM yyyy, HH:mm')}`}
                                </span>
                              </div>

                              <span className="text-sm text-gray-600">
                                {post.content.length > 100
                                  ? `${post.content.slice(0, 100)}...`
                                  : post.content}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="text-xl font-bold text-gray-900 flex items-center justify-center">
            SocialNet
          </Link>
        </div>

        {isAuthenticated && (
          <div className="p-4 border-b">
            <Link to="/profile" className="flex items-center space-x-3">
              <UserProfileLink user={user} withLink={false} />
            </Link>
          </div>
        )}

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={toggleSearch}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </li>

            <li>
              <Link
                to="/"
                className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/')}`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>

            {isAuthenticated && (
              <>
                {/* <li>
                  <Link
                    to="/messages"
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/messages')}`}
                  >
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/notifications')}`}
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/profile')}`}
                  >
                    <Users size={20} />
                    <span>Profile</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={handleLogOut}
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </Button>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default" className="w-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
