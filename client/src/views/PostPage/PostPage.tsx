import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createComment, updateComment } from '@/redux/slices/postSlice';
import axios from 'axios';
import { API_POSTS_URL } from '@/config';

import { useParams, useNavigate } from 'react-router';

import { Mode } from '@/types/common';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import CreateRepostModal from '../CreateRepostModal/CreateRepostModal';
import PostCard from '../PostCard/PostCard';
import CommentList from '../CommentList/CommentList';

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [post, setPost] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [editingComment, setEditingComment] = useState<any>(null);
  const [editContent, setEditContent] = useState('');
  const [mode, setMode] = useState<Mode>(Mode.CREATE);
  const [postToEdit, setPostToEdit] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isRepost, setIsRepost] = useState(false);
  const [originalPostId, setOriginalPostId] = useState<string>('');
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getComments = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  const getPost = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}`, {
        withCredentials: true,
      });
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);

      navigate('/');
    }
  }, [postId, navigate]);

  const refreshData = useCallback(() => {
    getPost();
    getComments();
    setRefreshTrigger((prev) => prev + 1);
  }, [getPost, getComments]);

  useEffect(() => {
    if (postId) {
      getPost();
      getComments();
    }
  }, [postId, getPost, getComments, refreshTrigger, refreshData]);

  const createCommentHandler = async () => {
    if (!content.trim() || !postId) return;

    try {
      await dispatch(createComment({ content, postId }));
      setContent('');
      refreshData();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const updateCommentHandler = async () => {
    if (!editContent.trim() || !editingComment) return;

    try {
      await dispatch(updateComment({ commentId: editingComment.id, content: editContent }));
      setEditingComment(null);
      setEditContent('');
      refreshData();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCloseModal = useCallback(async () => {
    setModalOpen(false);
    setMode(Mode.CREATE);
    setPostToEdit(null);
    setIsRepost(false);
    setOriginalPostId('');
    refreshData();
  }, [refreshData]);

  return (
    <div className="container mx-auto p-4">
      {post && (
        <PostCard
          key={post.id}
          post={post}
          setCommentsOpen={setCommentsOpen}
          setModalOpen={setModalOpen}
          setMode={setMode}
          setPostToEdit={setPostToEdit}
          isCommentsOpen={isCommentsOpen}
          setIsRepost={setIsRepost}
          setOriginalPostId={setOriginalPostId}
          refreshData={refreshData}
        />
      )}

      {!post?.isRepost && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
          <div className="text-lg font-semibold mb-4">Comments</div>

          <CommentList
            comments={comments}
            getComments={getComments}
            setEditContent={setEditContent}
            setEditingComment={setEditingComment}
            refreshData={refreshData}
          />

          {isAuthenticated && (
            <div className="mt-4 flex items-center space-x-2">
              <Input
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button size="sm" onClick={createCommentHandler}>
                Post
              </Button>
            </div>
          )}
        </div>
      )}

      {!post?.isRepost && editingComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Comment</h3>
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setEditingComment(null)}>
                Cancel
              </Button>
              <Button onClick={updateCommentHandler}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {isRepost ? (
        <CreateRepostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreateOrUpdateRepost={handleCloseModal}
          originalPostId={originalPostId}
          mode={mode}
          postData={postToEdit}
        />
      ) : (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreateOrUpdatePost={handleCloseModal}
          mode={mode}
          postData={postToEdit}
        />
      )}
    </div>
  );
}
