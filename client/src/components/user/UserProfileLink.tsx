import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';
import { User } from '@/types/user';

const UserProfileLink = ({
  activity,
  user,
  inSearch,
}: {
  activity?: Comment | Post;
  user?: User;
  inSearch?: boolean;
}) => {
  const profileId = activity ? activity?.ownerProfile?.id : user?.id;
  const username = activity ? activity?.ownerProfile?.username : user?.username;
  const avatarPath = activity ? activity?.ownerProfile?.avatarPath : user?.avatarPath;

  const avatarSrc = avatarPath ? `${API_USERS_URL}${avatarPath}` : undefined;

  const content = (
    <div className="flex gap-4 items-center">
      <Avatar>
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{username?.[0]?.toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
      {user && <span>{username}</span>}
    </div>
  );

  if (inSearch) {
    return content;
  }

  return <Link to={`/profile/${profileId}`}>{content}</Link>;
};

export default UserProfileLink;
