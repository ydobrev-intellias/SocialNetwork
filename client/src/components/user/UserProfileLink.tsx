import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';

const UserProfileLink = ({ activity, user }: { activity?: Comment | Post; user?: any }) => {
  return (
    <Link className="block" to={`/profile/${activity ? activity?.ownerProfile?.id : user?.id}`}>
      <Avatar>
        <AvatarImage
          src={
            activity
              ? activity?.ownerProfile?.avatarPath
                ? `${API_USERS_URL}${activity?.ownerProfile?.avatarPath}`
                : undefined
              : (user?.avatarPath ?? undefined)
          }
        />
        <AvatarFallback>
          {activity
            ? (activity?.ownerProfile?.username[0]?.toLocaleUpperCase() ?? undefined)
            : (user?.username[0]?.toLocaleUpperCase() ?? undefined)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserProfileLink;
