import { Ghost } from 'lucide-react';
import { useSelector } from 'react-redux';
import Post from '../Post/Post';

import { useState } from 'react';
import { RootState } from '@/redux/store';

export default function PostsSection({ setPostToEdit, setModalOpen, setMode }: any) {
  const { status, posts } = useSelector((state: RootState) => state.post);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  if (status === 'pending') {
    return <h1>Loading ..</h1>;
  }
  console.log('posts section', posts);
  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post: any) => (
          <Post
            key={post.id}
            post={post}
            setCommentsOpen={setCommentsOpen}
            setModalOpen={setModalOpen}
            setMode={setMode}
            setPostToEdit={setPostToEdit}
            isCommentsOpen={isCommentsOpen}
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
