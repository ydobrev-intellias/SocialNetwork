import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getPosts } from '@/redux/slices/postSlice';

import CreatePostModal from '../CreatePostModal/CreatePostModal';

import PostsSection from '../PostsSection/PostsSection';

export default function ActivityWall() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [postToEdit, setPostToEdit] = useState<any | null>(null);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleCreatePost = () => {
    setMode('create');
    setModalOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {isAuthenticated && (
        <Button onClick={handleCreatePost} variant="default">
          Create Post
        </Button>
      )}
      <PostsSection setPostToEdit={setPostToEdit} setModalOpen={setModalOpen} setMode={setMode} />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreateOrUpdatePost={(post: any) => {
          if (mode === 'create') {
            console.log('Create Post:', post);
            dispatch(getPosts());
          } else if (mode === 'update' && postToEdit?.id) {
            console.log('Update Post:', post);
            dispatch(getPosts());
          }
          setModalOpen(false);
        }}
        mode={mode}
        postData={postToEdit}
      />
    </div>
  );
}
