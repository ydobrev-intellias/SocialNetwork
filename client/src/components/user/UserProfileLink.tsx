import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';

const UserProfileLink = ({ activity }: { activity: Comment | Post; isPost?: boolean }) => {
  return (
    <Link className="block" to={`/profile/${activity?.ownerProfile?.id}`}>
      <Avatar>
        <AvatarImage
          src={
            activity?.ownerProfile?.avatarPath
              ? `${API_USERS_URL}${activity?.ownerProfile?.avatarPath}`
              : undefined
          }
        />
        <AvatarFallback>{activity?.ownerProfile?.username[0]?.toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserProfileLink;
