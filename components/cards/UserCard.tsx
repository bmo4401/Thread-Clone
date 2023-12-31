'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Props {
   id: string;
   name: string;
   username: string;
   imgUrl: string;
   personType: string;
}
const UserCard: React.FC<Props> = ({
   id,
   name,
   username,
   imgUrl,
   personType,
}) => {
   const router = useRouter();
   return (
      <article className="user-card">
         <div className="user-card_avatar">
            <Image
               alt=""
               src={imgUrl}
               width={48}
               height={48}
               className="rounded-full"
            />
            <div className="flex-1 text-ellipsis">
               <h4 className="text-base-semibold text-light-1">{name}</h4>
               <p className="text-small-medium text-gray-1">@{username}</p>
            </div>
         </div>
         <Button
            className="user-card_btn"
            onClick={() => router.push(`${id}`)}
         >
            view
         </Button>
      </article>
   );
};
export default UserCard;
