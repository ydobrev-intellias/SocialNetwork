import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { API_USERS_URL, API_POSTS_URL } from '@/config';
import { AppDispatch, RootState } from '@/redux/store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Forward } from 'lucide-react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import CommentSection from '../CommentSection/CommentSection';
import { createRepost, deletePost, getPosts, toggleLike } from '@/redux/slices/postSlice';
import { useMemo, useState } from 'react';
import UserProfileLink from '@/components/user/UserProfileLink';

export default function Post({ post, setMode, setModalOpen, setPostToEdit }: any) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const userLike = post?.likes?.find((like: any) => like.userId === user?.id);
  const isLiked = !!userLike;
  const isOwner = isAuthenticated && post.ownerId === user?.id;
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const originalPost = useMemo(() => (post.isRepost ? post.originalPost : null), [post]);

  const handleLike = async (postId: string, isLiked: boolean, likeId?: string) => {
    await dispatch(toggleLike({ postId, isLiked, likeId }));
  };
  const handleDelete = async (postId: string) => {
    await dispatch(deletePost({ postId }));
    dispatch(getPosts());
  };

  const handleEditPost = (post: any) => {
    setMode('update');
    setPostToEdit(post);
    setModalOpen(true);
  };

  const handleCreateRepost = (postId: string) => {
    dispatch(createRepost({ postId }));
  };
  return (
    <Card key={post.id}>
      {/* <CardHeader className="flex flex-row items-center space-x-3">
        <Avatar>
          <AvatarImage
            src={
              post?.ownerProfile?.avatarPath
                ? `${API_USERS_URL}${post?.ownerProfile?.avatarPath}`
                : undefined
            }
          />
          <AvatarFallback>{post?.ownerProfile?.username[0]?.toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-sm font-semibold">{post?.ownerProfile?.username}</CardTitle>
          <p className="text-xs text-gray-500">
            {post?.updatedAt
              ? `Last updated: ${format(new Date(post.updatedAt), 'dd MMM yyyy, HH:mm')}`
              : `Posted on: ${format(new Date(post.createdAt), 'dd MMM yyyy, HH:mm')}`}
          </p>
        </div>
      </CardHeader> */}
      <UserProfileLink activity={post} isPost={true} />

      <CardContent>
        <p className="text-gray-700">{post.content}</p>
        {originalPost && (
          <div className="mt-4 p-3 border-gray-400 bg-gray-100 rounded-md">
            <CardHeader className="flex flex-row items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={
                    originalPost?.ownerProfile?.avatarPath
                      ? `${API_USERS_URL}${originalPost?.ownerProfile?.avatarPath}`
                      : undefined
                  }
                />
                <AvatarFallback>
                  {originalPost?.ownerProfile?.username[0]?.toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {originalPost?.ownerProfile?.username}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  {originalPost?.updatedAt
                    ? `Last updated: ${format(new Date(originalPost.updatedAt), 'dd MMM yyyy, HH:mm')}`
                    : `Posted on: ${format(new Date(originalPost.createdAt), 'dd MMM yyyy, HH:mm')}`}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 italic">{originalPost.content}</p>
              {originalPost.mediaPath && (
                <div className="mt-3">
                  {originalPost.mediaPath.endsWith('.mp4') ||
                  originalPost.mediaPath.endsWith('.webm') ? (
                    <video controls className="w-full max-h-80 object-contain rounded-lg">
                      <source src={`${API_POSTS_URL}${originalPost.mediaPath}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${API_POSTS_URL}${originalPost.mediaPath}`}
                      alt="Post media"
                      className="w-full max-h-80 object-contain rounded-lg"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </div>
        )}

        {post.mediaPath && (
          <div className="mt-3">
            {post.mediaPath.endsWith('.mp4') || post.mediaPath.endsWith('.webm') ? (
              <video controls className="w-full max-h-80 object-contain rounded-lg">
                <source src={`${API_POSTS_URL}${post.mediaPath}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`${API_POSTS_URL}${post.mediaPath}`}
                alt="Post media"
                className="w-full max-h-80 object-contain rounded-lg"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(post.id, isLiked, userLike?.id)}
            disabled={!isAuthenticated || post.ownerId === user?.id}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
            />
          </Button>
          <span className="text-sm text-gray-600">{post?.likes?.length} Likes</span>
          <Button variant="ghost" size="sm" onClick={() => setCommentsOpen(true)}>
            <MessageCircle className="h-5 w-5 text-gray-600" />
          </Button>

          {isCommentsOpen && (
            <CommentSection
              postOwnerId={post.ownerId}
              postId={post.id}
              onClose={() => setCommentsOpen(false)}
            />
          )}
          {!post.isRepost && isAuthenticated && !isOwner && (
            <Button variant="ghost" size="sm" onClick={() => handleCreateRepost(post.id)}>
              <Forward className="h-5 w-5 text-gray-600" />
            </Button>
          )}

          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
              Update
            </Button>
          )}
          {isOwner && <button onClick={() => handleDelete(post.id)}>Delete post</button>}
        </div>
      </CardContent>
    </Card>
  );
}
