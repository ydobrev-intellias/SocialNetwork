import { Button } from '@/components/ui/button';
import UserProfileLink from '@/components/user/UserProfileLink';
import { deleteComment } from '@/redux/slices/postSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Comment } from '@/types/comment';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CommentListProps {
  comments: Comment[];
  getComments: Function;
  setEditingComment: Dispatch<SetStateAction<Partial<Comment> | undefined>>;
  setEditContent: Dispatch<SetStateAction<string>>;
  refreshData?: () => void;
}

export default function CommentList({
  comments,
  getComments,
  setEditingComment,
  setEditContent,
  refreshData,
}: CommentListProps) {
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const deleteCommentHandler = async (comment: Comment) => {
    await dispatch(deleteComment({ commentId: comment.id }));
    getComments();
    if (refreshData) refreshData();
  };
  return (
    <div className="max-h-60 overflow-y-auto mt-4 space-y-2">
      {comments?.length > 0 ? (
        comments.map((comment: Comment) => {
          const isOwner = comment.ownerId === user?.id;
          return (
            <div key={comment.id} className="flex items-start space-x-2 border-b pb-2">
              <UserProfileLink activity={comment} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{comment?.ownerProfile?.username}</p>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              {isAuthenticated && (isOwner || isAdmin) && (
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
  );
}
