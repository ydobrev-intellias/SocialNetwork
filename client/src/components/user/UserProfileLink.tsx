import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const UserProfileLink = ({
  activity,
  user,
  withLink = true,
  withName = true,
}: {
  activity?: Comment | Post;
  user?: any;
  withLink?: boolean;
  withName?: boolean;
}) => {
  const { onlineUsers } = useSelector((state: RootState) => state.message);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const profileId = activity ? activity?.ownerProfile?.id : user?.id;
  const username = activity ? activity?.ownerProfile?.username : user?.username;
  const avatarPath = activity ? activity?.ownerProfile?.avatarPath : user?.avatarPath;

  const avatarSrc = avatarPath ? `${API_USERS_URL}${avatarPath}` : undefined;

  const isUserOnline = Boolean(
    onlineUsers.find((id) => id === user?.id || id === activity?.ownerId),
  );

  const content = (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Avatar>
          <AvatarImage className="object-cover" src={avatarSrc} />
          <AvatarFallback>{username?.[0]?.toLocaleUpperCase()}</AvatarFallback>
        </Avatar>

        {isAuthenticated && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isUserOnline ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={isUserOnline ? 'Online' : 'Offline'}
          />
        )}
      </div>
      {user && withName && <span>{username}</span>}
    </div>
  );

  if (!withLink) {
    return content;
  }

  return <Link to={`/profile/${profileId}`}>{content}</Link>;
};

export default UserProfileLink;
