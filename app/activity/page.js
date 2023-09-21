import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import {
  getAllComments,
  getAllCommentsWithUserInfo,
  getCommentsByPostId,
} from '../../database/comments';
import {
  getAllPosts,
  getAllPostsWithUserInfo,
  getCommentsWithUserInfo,
} from '../../database/posts';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken } from '../../database/users';
import CreateCommentForm from './comments/CreateCommentForm';
import styles from './page.module.scss';
import CreatePostForm from './posts/CreatePostForm';
import { DeletePostButton } from './posts/DeletePostButton';

export default async function ActivityPage() {
  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (!session) redirect('/?returnTo=/activity');

  const user = await getUserBySessionToken(session.token);
  console.log(user);

  if (!user) {
    notFound();
  }

  const posts = await getAllPosts();
  const comments = await getAllComments();
  const userPostsWithInfo = await getAllPostsWithUserInfo();
  const commentsWithInfo = await getAllCommentsWithUserInfo();
  // const commentsByPostId = await getCommentsByPostId();
  // console.log(userPostsWithInfo);
  // console.log(posts);
  // console.log(commentsWithInfo);

  return (
    <main className={styles.backgroundFeed}>
      <h4 className={styles.h4}>Feed</h4>
      <section className={styles.section}>
        <CreatePostForm userId={user.id} />

        {/* display all posts with user info */}
        {userPostsWithInfo.map((post) => (
          <div key={`post-content-${post.postId}`}>
            <div className={styles.postWithInfo}>
              <div className={styles.usernameInPost}>{post.username}</div>
              <div className={styles.postContent}>{post.content}</div>
              {post.imageUrl === '' ? null : (
                <Image
                  className={styles.uploadedImage}
                  src={post.imageUrl}
                  alt="Image from user"
                  width={300}
                  height={300}
                />
              )}
              <div className={styles.commentsArea}>
                {/* filter the comments based on postID and then map it over to display comments with user info */}
                {commentsWithInfo
                  .filter((comment) => comment.postId === post.postId)
                  .map((comment) => (
                    <li key={`comment-content-${comment.id}`}>
                      <div className={styles.usernameInComment}>
                        {comment.username}
                      </div>
                      <div className={styles.commentContent}>
                        {comment.content}
                      </div>
                    </li>
                  ))}

                <CreateCommentForm postId={post.postId} userId={user.id} />
              </div>
              <DeletePostButton postId={post.postId} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
