import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getPosts } from '@/redux/slices/postSlice';

import CreatePostModal from '../CreatePostModal/CreatePostModal';

import PostsSection from '../PostsSection/PostsSection';
import { Mode } from '@/types/common';
import CreateRepostModal from '../CreateRepostModal/CreateRepostModal';
import { PostData } from '@/types/post';

export default function ActivityWall() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(Mode.CREATE);
  const [postToEdit, setPostToEdit] = useState<PostData>();
  const [isRepost, setIsRepost] = useState(false);
  const [originalPostId, setOriginalPostId] = useState<string>('');

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleCreatePost = () => {
    setMode(Mode.CREATE);
    setModalOpen(true);
    setIsRepost(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {isAuthenticated && (
        <Button onClick={handleCreatePost} variant="default">
          Create Post
        </Button>
      )}
      <PostsSection
        setPostToEdit={setPostToEdit}
        setModalOpen={setModalOpen}
        setMode={setMode}
        setIsRepost={setIsRepost}
        setOriginalPostId={setOriginalPostId}
      />

      {isRepost ? (
        <CreateRepostModal
          isOpen={isModalOpen}
          onClose={async () => {
            await dispatch(getPosts());
            setModalOpen(false);
            setMode(Mode.CREATE);
            setPostToEdit(undefined);
          }}
          onCreateOrUpdateRepost={() => {
            if (mode === Mode.CREATE) {
              dispatch(getPosts());
            } else if (Mode.UPDATE && postToEdit?.id) {
              dispatch(getPosts());
            }
            setModalOpen(false);
            setPostToEdit(undefined);
          }}
          originalPostId={originalPostId}
          mode={mode}
          postData={postToEdit}
        />
      ) : (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={async () => {
            dispatch(getPosts());
            setModalOpen(false);
            setMode(Mode.CREATE);
            setPostToEdit(undefined);
          }}
          onCreateOrUpdatePost={() => {
            if (mode === Mode.CREATE) {
              dispatch(getPosts());
            } else if (Mode.UPDATE && postToEdit?.id) {
              dispatch(getPosts());
            }
            setModalOpen(false);
            setPostToEdit(undefined);
          }}
          mode={mode}
          postData={postToEdit}
        />
      )}
    </div>
  );
}
