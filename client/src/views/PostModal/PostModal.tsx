import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createComment, updateComment } from '@/redux/slices/postSlice';
import axios from 'axios';
import { API_POSTS_URL } from '@/config';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import UserProfileLink from '@/components/user/UserProfileLink';
import { format } from 'date-fns';
import CommentList from '../CommentList/CommentList';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';

interface PostModalProps {
  postId: string;
  onClose: () => void;
}

export default function PostModal({ postId, onClose }: PostModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [originalPost, setOriginalPost] = useState<Post>();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [editingComment, setEditingComment] = useState<Partial<Comment>>();
  const [editContent, setEditContent] = useState('');
  const getComments = async () => {
    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}/comments`, {
        withCredentials: true,
      });
      console.log(response);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const getPost = async () => {
    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}`, {
        withCredentials: true,
      });
      console.log('PostModal post', response.data);
      setOriginalPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  useEffect(() => {
    getComments();
    getPost();
  }, [postId, setOriginalPost]);

  const createCommentHandler = async () => {
    if (!content.trim()) return;
    await dispatch(createComment({ content, postId }));
    setContent('');
    getComments();
  };

  const updateCommentHandler = async () => {
    if (!editContent.trim()) return;
    if (editingComment?.id) {
      await dispatch(updateComment({ commentId: editingComment?.id, content: editContent }));
      setEditingComment(undefined);
      setEditContent('');
      getComments();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[800px] max-h-[80vh] p-6 rounded-lg shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center">
          <button onClick={onClose} className="cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {originalPost && (
          <div className="mt-6 p-5 bg-white border border-gray-300 rounded-xl">
            <CardHeader className="flex items-center space-x-4">
              <UserProfileLink activity={originalPost} />
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {originalPost?.ownerProfile?.username}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {originalPost?.updatedAt
                    ? `Last updated: ${format(new Date(originalPost.updatedAt), 'dd MMM yyyy, HH:mm')}`
                    : `Posted on: ${format(new Date(originalPost.createdAt), 'dd MMM yyyy, HH:mm')}`}
                </p>
              </div>
            </CardHeader>

            <CardContent className="mt-4">
              <p className="text-gray-800 leading-relaxed">{originalPost.content}</p>

              {originalPost.mediaPath && (
                <div className="mt-4 relative overflow-hidden rounded-lg shadow-md">
                  {originalPost.mediaPath.endsWith('.mp4') ||
                  originalPost.mediaPath.endsWith('.webm') ? (
                    <video controls className="w-full max-h-[400px] object-cover rounded-lg">
                      <source src={`${API_POSTS_URL}${originalPost.mediaPath}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${API_POSTS_URL}${originalPost.mediaPath}`}
                      alt="Post media"
                      className="w-full max-h-[400px] object-cover rounded-lg"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </div>
        )}

        <CommentList
          comments={comments}
          getComments={getComments}
          setEditContent={setEditContent}
          setEditingComment={setEditingComment}
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
        <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Comment</DialogTitle>
            </DialogHeader>
            <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setEditingComment(undefined)}>
                Cancel
              </Button>
              <Button onClick={updateCommentHandler}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
