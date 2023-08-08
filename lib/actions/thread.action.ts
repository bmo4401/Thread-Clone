'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import User from '../models/user.model';

interface Params {
   text: string;
   author: string;
   communityId: string | null;
   path: string;
}

export async function createThread({
   author,
   communityId,
   text,
   path,
}: Params) {
   try {
      connectToDB();
      const createdThread = await Thread.create({
         text,
         author,
         community: null,
      });
      /* update User model */
      await User.findByIdAndUpdate(author, {
         $push: { threads: createdThread._id },
      });

      revalidatePath(path);
   } catch (error: any) {
      throw new Error(`Failed to create thread: ${error.message}`);
   }
}

export async function fetchPosts({ pageNumber = 1, pageSize = 20 }) {
   try {
      connectToDB();
      const skipAmount = (pageNumber - 1) & pageSize;
      const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
         .sort({ createdAt: 'desc' })
         .limit(pageSize)
         .populate({ path: 'author', model: User })
         .populate({
            path: 'children',

            populate: {
               path: 'author',
               model: User,
               select: '_id name parentId, image',
            },
         });

      const totalPostsCount = await Thread.countDocuments({
         parentID: {
            $in: [null, undefined],
         },
      });

      const posts = await postsQuery.exec();

      const isNext = totalPostsCount > skipAmount + posts.length;

      return { posts, isNext };
   } catch (error: any) {
      throw new Error(`Fetching posts failed ${error.message}`);
   }
}

export async function fetchThreadById({ id }: { id: string }) {
   try {
      connectToDB();
      const threads = Thread.findById(id)
         .populate({
            path: 'author',
            model: User,
            select: '_id id name image',
         })
         .populate({
            path: 'children',
            populate: [
               {
                  path: 'author',
                  model: User,
                  select: '_id id name image parentId',
               },
               {
                  path: 'children',
                  model: Thread,
                  select: '_id id name image parentId',
               },
            ],
         })
         .exec();
      return threads;
   } catch (error: any) {
      throw new Error(`Fetching threads failed ${error.message}`);
   }
}

export async function addCommentToThread({
   threadId,
   commentText,
   userId,
   path,
}: {
   threadId: string;
   commentText: string;
   userId: string;
   path: string;
}) {
   connectToDB();
   try {
      /* Find the original thread by its Id */
      const originalThread = await Thread.findById(threadId);
      if (!originalThread) throw new Error('Thread not found');

      const commentThread = new Thread({
         text: commentText,
         author: userId,
         parentId: threadId,
      });

      /* save the new thread */
      const savedCommentThread = await commentThread.save();

      /* update the original thread to include the new comment */
      originalThread.children.push(savedCommentThread._id);
      /* save the original thread */
      await originalThread.save();
      revalidatePath(path);
   } catch (error: any) {
      throw new Error(`Add comment to thread failed ${error.message}`);
   }
}
