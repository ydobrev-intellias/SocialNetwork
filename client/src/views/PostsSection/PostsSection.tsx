import { Ghost } from 'lucide-react';
import { useSelector } from 'react-redux';

import { Dispatch, SetStateAction, useState } from 'react';
import { RootState } from '@/redux/store';

import { Post } from '@/types/post';
import { Mode } from '@/types/common';
import PostCard from '../PostCard/PostCard';
interface PostsSectionProps {
  setPostToEdit: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setMode: Dispatch<SetStateAction<Mode>>;
  setIsRepost: Dispatch<SetStateAction<boolean>>;
  setOriginalPostId: Dispatch<SetStateAction<string>>;
}
export default function PostsSection({
  setPostToEdit,
  setModalOpen,
  setMode,
  setIsRepost,
  setOriginalPostId,
}: PostsSectionProps) {
  const { status, posts } = useSelector((state: RootState) => state.post);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  if (status === 'pending') {
    return <h1>Loading ..</h1>;
  }
  return (
    <>
      {posts && posts.length > 0 ? (
        posts
          .filter(Boolean)
          .map((post: Post) => (
            <PostCard
              key={post?.id}
              post={post}
              setCommentsOpen={setCommentsOpen}
              setModalOpen={setModalOpen}
              setMode={setMode}
              setPostToEdit={setPostToEdit}
              isCommentsOpen={isCommentsOpen}
              setIsRepost={setIsRepost}
              setOriginalPostId={setOriginalPostId}
              isWall={true}
            />
          ))
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-100 rounded-lg">
          <Ghost className="w-12 h-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-semibold text-gray-700">No posts yet</h2>
          <p className="text-gray-500 text-sm">
            It looks like your activity wall is empty. Start following people or create a post!
          </p>
        </div>
      )}
    </>
  );
}
