import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { API_POSTS_URL } from '@/config';
import { AppDispatch, RootState } from '@/redux/store';
import { Heart, MessageCircle, Forward } from 'lucide-react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import PostModal from '../PostModal/PostModal';
import { deletePost, getPosts, toggleLike } from '@/redux/slices/postSlice';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import UserProfileLink from '@/components/user/UserProfileLink';
import { Post, PostPrivacy } from '@/types/post';
import { Like } from '@/types/like';
import { Mode } from '@/types/common';
import { useNavigate } from 'react-router';

interface PostCardProps {
  post: Post;
  setMode: Dispatch<SetStateAction<Mode>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setPostToEdit: Dispatch<SetStateAction<Partial<Post>>>;
  setCommentsOpen: Dispatch<SetStateAction<boolean>>;
  isCommentsOpen: boolean;
  setIsRepost: Dispatch<SetStateAction<boolean>>;
  setOriginalPostId: Dispatch<SetStateAction<string>>;
  refreshData?: () => void;
  isWall?: boolean;
}

export default function PostCard({
  post,
  setMode,
  setModalOpen,
  setPostToEdit,
  setIsRepost,
  setOriginalPostId,
  refreshData,
  isWall,
}: PostCardProps) {
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const userLike = post?.likes?.find((like: Like) => like.userId === user?.id);
  const isLiked = !!userLike;
  const isOwner = isAuthenticated && post.ownerId === user?.id;
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const originalPost = useMemo(() => (post.isRepost ? post.originalPost : null), [post]);
  const navigate = useNavigate();

  const handleLike = async (postId: string, isLiked: boolean, likeId?: string) => {
    console.log('Handle like', { postId, isLiked, likeId });
    await dispatch(toggleLike({ postId, isLiked, likeId }));
    if (refreshData) refreshData();
  };
  const handleDelete = async (postId: string) => {
    await dispatch(deletePost({ postId }));
    dispatch(getPosts());
  };

  const handleEditPost = (post: Post) => {
    setMode(Mode.UPDATE);
    setPostToEdit(post);
    setModalOpen(true);
  };

  return (
    <Card
      key={post.id}
      onClick={() => {
        if (isWall) navigate(`/posts/${post.id}`);
      }}
      className={`mt-4 p-4 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${isWall ? 'cursor-pointer' : ''}`}
    >
      <CardHeader className="flex flex-row items-center space-x-3">
        <UserProfileLink activity={post} />
        <div>
          <CardTitle className="text-sm font-semibold">{post?.ownerProfile?.username}</CardTitle>
          <p className="text-xs text-gray-500">
            {post?.updatedAt
              ? `Last updated: ${format(new Date(post.updatedAt), 'dd MMM yyyy, HH:mm')}`
              : `${post.isRepost ? 'Reposted on' : 'Posted on'} ${format(new Date(post.createdAt), 'dd MMM yyyy, HH:mm')}`}
          </p>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {post?.privacy}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700">{post.content}</p>
        {originalPost && (
          <div
            className={`mt-4 p-4 bg-cyan-950100 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300  ${originalPost ? 'cursor-pointer' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${originalPost.id}`);
            }}
          >
            {isCommentsOpen && (
              <PostModal postId={originalPost?.id} onClose={() => setCommentsOpen(false)} />
            )}
            <CardHeader className="flex flex-row items-center space-x-3">
              <UserProfileLink activity={originalPost} />
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
                <div className="mt-3 relative">
                  {originalPost.mediaPath.endsWith('.mp4') ||
                  originalPost.mediaPath.endsWith('.webm') ? (
                    <video
                      controls
                      className="w-full max-h-[400px] object-cover rounded-lg shadow-lg"
                    >
                      <source src={`${API_POSTS_URL}${originalPost.mediaPath}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${API_POSTS_URL}${originalPost.mediaPath}`}
                      alt="Post media"
                      className="w-full max-h-[400px] object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </div>
        )}

        {post.mediaPath && (
          <div className="mt-3 relative">
            {post.mediaPath.endsWith('.mp4') || post.mediaPath.endsWith('.webm') ? (
              <video controls className="w-full max-h-[400px] object-cover rounded-lg shadow-lg">
                <source src={`${API_POSTS_URL}${post.mediaPath}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`${API_POSTS_URL}${post.mediaPath}`}
                alt="Post media"
                className="w-full max-h-[400px] object-cover rounded-lg shadow-lg"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(post.id, isLiked, userLike?.id);
              }}
              disabled={!isAuthenticated || post.ownerId === user?.id}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
              />
            </Button>
            <span className="text-sm text-gray-600">{post?.likes?.length}</span>
          </div>
          {!post.isRepost && (
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentsOpen(true);
                }}
              >
                <MessageCircle className="h-5 w-5 text-gray-600" />
              </Button>
              <span className="text-sm text-gray-600">{post?.comments?.length}</span>
              {isCommentsOpen && (
                <PostModal
                  postId={post.id}
                  onClose={async () => {
                    setCommentsOpen(false);
                    if (refreshData) refreshData();
                    else dispatch(getPosts());
                  }}
                />
              )}
            </div>
          )}

          {!post.isRepost && post.privacy == PostPrivacy.PUBLIC && isAuthenticated && !isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsRepost(true);
                setModalOpen(true);
                setOriginalPostId(post.id);
              }}
            >
              <Forward className="h-5 w-5 text-gray-600" />
            </Button>
          )}

          {(isOwner || isAdmin) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsRepost(post.isRepost);
                handleEditPost(post);
              }}
            >
              Update
            </Button>
          )}
          {(isOwner || isAdmin) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(post.id);
              }}
            >
              Delete post
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
