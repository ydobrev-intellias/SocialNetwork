import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createComment, updateComment, deleteComment } from '@/redux/slices/postSlice';
import axios from 'axios';
import { API_POSTS_URL, API_USERS_URL } from '@/config';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import UserProfileLink from '@/components/user/UserProfileLink';

interface CommentSectionProps {
  postId: string;
  onClose: () => void;
  postOwnerId: string;
}

export default function CommentSection({ postId, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [originalPost, setOriginalPost] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [editingComment, setEditingComment] = useState<any>(null);
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
      setOriginalPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };
  useEffect(() => {
    getComments();
    getPost();
  }, [postId]);

  const createCommentHandler = async (e: any) => {
    if (!content.trim()) return;
    await dispatch(createComment({ content, postId }));
    setContent('');
    getComments();
  };

  const updateCommentHandler = async (e: any) => {
    if (!editContent.trim()) return;
    await dispatch(updateComment({ commentId: editingComment.id, content: editContent }));
    setEditingComment(null);
    setEditContent('');
    getComments();
  };

  const deleteCommentHandler = async (comment: any) => {
    await dispatch(deleteComment({ commentId: comment.id }));
    getComments();
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Comments</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {originalPost && (
          <div className="mt-4 p-3 border border-gray-300 bg-gray-100 rounded-md">
            <UserProfileLink activity={originalPost} />
            <CardContent>
              <p className="text-gray-700">{originalPost.content}</p>
              {originalPost.mediaPath && (
                <div className="mt-3">
                  {originalPost.mediaPath.endsWith('.mp4') ||
                  originalPost.mediaPath.endsWith('.webm') ? (
                    <video controls className="w-full max-h-80 object-contain rounded-lg">
                      <source src={`${API_POSTS_URL}${originalPost.mediaPath}`} type="video/mp4" />
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

        <div className="max-h-60 overflow-y-auto mt-4 space-y-2">
          {comments.length > 0 ? (
            comments.map((comment: any) => {
              const isOwner = comment.ownerId === user?.id;
              return (
                <div key={comment.id} className="flex items-start space-x-2 border-b pb-2">
                  <UserProfileLink activity={comment} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{comment?.ownerProfile?.username}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  {isAuthenticated && isOwner && (
                    <>
                      <Button size="sm" onClick={() => deleteCommentHandler(comment)}>
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingComment(comment);
                          setEditContent(comment.content);
                        }}
                      >
                        Update
                      </Button>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

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
        <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
          {editingComment && console.log('Editing Comment Modal Open')}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Comment</DialogTitle>
            </DialogHeader>
            <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setEditingComment(null)}>
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
