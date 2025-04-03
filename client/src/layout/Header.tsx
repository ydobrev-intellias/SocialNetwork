import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare } from 'lucide-react';
import { AppDispatch, RootState } from '@/redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, signOut } from '@/redux/slices/authSlice';
import { API_SEARCH_URL, API_USERS_URL } from '@/config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import UserProfileLink from '@/components/user/UserProfileLink';
import { Post } from '@/types/post';
import { User } from '@/types/user';
import { format } from 'date-fns';

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
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
      const response = await axios.get(`${API_SEARCH_URL}?query=${value}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setQuery('');
    if (isAuthenticated) {
      dispatch(getProfile({}));
    }
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-gray-900">
            SocialNet
          </Link>
        </div>

        <div className="relative w-1/3">
          <Input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search..."
            className="pl-8 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 w-full"
          />

          {isLoading && (
            <div className="absolute w-full bg-white text-gray-500 text-sm p-2">Loading...</div>
          )}

          {query && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto">
              {results.users?.length > 0 && (
                <div className="p-2">
                  <h3 className="font-semibold text-gray-700">Users</h3>
                  <ul>
                    {results.users.map((user: User) => (
                      <li
                        key={user?.id}
                        className="py-1 px-2 text-gray-600 cursor-pointer hover:bg-gray-100"
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
                      >
                        <Link to={`/posts/${post.id}`}>
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <UserProfileLink activity={post} inSearch={true} />
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
