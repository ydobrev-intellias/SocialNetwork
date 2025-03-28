import { API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const UserProfileLink = ({ activity, isPost = false }: { activity: any; isPost?: boolean }) => {
  return (
    <Link className="block" to={`/profile/${activity?.ownerProfile?.id}`}>
      <CardHeader className="flex flex-row items-center space-x-3">
        <Avatar>
          <AvatarImage
            src={
              activity?.ownerProfile?.avatarPath
                ? `${API_USERS_URL}${activity?.ownerProfile?.avatarPath}`
                : undefined
            }
          />
          <AvatarFallback>
            {activity?.ownerProfile?.username[0]?.toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-sm font-semibold">
            {activity?.ownerProfile?.username}
          </CardTitle>
          {isPost && (
            <p className="text-xs text-gray-500">
              {activity?.updatedAt
                ? `Last updated: ${format(new Date(activity.updatedAt), 'dd MMM yyyy, HH:mm')}`
                : `Posted on: ${format(new Date(activity.createdAt), 'dd MMM yyyy, HH:mm')}`}
            </p>
          )}
        </div>
      </CardHeader>
    </Link>
  );
};

export default UserProfileLink;
