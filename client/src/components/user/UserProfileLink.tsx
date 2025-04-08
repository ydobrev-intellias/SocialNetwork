import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';

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
  const profileId = activity ? activity?.ownerProfile?.id : user?.id;
  const username = activity ? activity?.ownerProfile?.username : user?.username;
  const avatarPath = activity ? activity?.ownerProfile?.avatarPath : user?.avatarPath;

  const avatarSrc = avatarPath ? `${API_USERS_URL}${avatarPath}` : undefined;

  const content = (
    <div className="flex gap-4 items-center">
      <Avatar>
        <AvatarImage className="object-cover" src={avatarSrc} />
        <AvatarFallback>{username?.[0]?.toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
      {user && withName && <span>{username}</span>}
    </div>
  );

  if (!withLink) {
    return content;
  }

  return <Link to={`/profile/${profileId}`}>{content}</Link>;
};

export default UserProfileLink;
