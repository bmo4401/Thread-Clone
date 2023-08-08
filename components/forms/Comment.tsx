'use client';
import { CommentValidation } from '@/lib/validation/thread';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { addCommentToThread, createThread } from '@/lib/actions/thread.action';
import { Input } from '../ui/input';
import Image from 'next/image';
interface Props {
   threadId: string;
   currentUserImg: string;
   currentUserId: string;
}
const Comment: React.FC<Props> = ({
   currentUserId,
   currentUserImg,
   threadId,
}) => {
   const pathname = usePathname();
   const router = useRouter();
   const form = useForm({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
         thread: '',
      },
   });

   const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
      await addCommentToThread({
         threadId: threadId,
         path: pathname,
         userId: JSON.parse(currentUserId),
         commentText: values.thread,
      });
      form.reset();
   };
   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="comment-form"
         >
            <FormField
               control={form.control}
               name="thread"
               render={({ field }) => (
                  <FormItem className="flex items-center w-full gap-3">
                     <FormLabel>
                        <Image
                           alt=""
                           src={currentUserImg}
                           height={48}
                           width={48}
                           className="rounded-full object-cover"
                        />
                     </FormLabel>
                     <FormControl className="border-none bg-transparent">
                        <Input
                           type="text"
                           placeholder="Comment..."
                           className="no-focus text-light-1 outline-none"
                           {...field}
                        />
                     </FormControl>
                  </FormItem>
               )}
            />
            <Button
               type="submit"
               className="comment-form_btn"
            >
               Reply
            </Button>
         </form>
      </Form>
   );
};
export default Comment;
