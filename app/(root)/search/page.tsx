import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
   const user = await currentUser();
   if (!user) return null;
   const userInfo = await fetchUser({ userId: user.id });
   console.log('❄️ ~ file: page.tsx:10 ~ userInfo:', userInfo);

   if (!userInfo?.onboarded) redirect('/onboarding');

   //Fetch users
   const result = await fetchUsers({
      userId: userInfo._id,
      pageNumber: 1,
      pageSize: 25,
      searchString: '',
   });

   return (
      <section>
         <h1 className="head-text mb-10">
            <div className="mt-14 flex flex-col gap-9">
               {result.users.length === 0 ? (
                  <p className="no-result">No users</p>
               ) : (
                  <>
                     {result.users.map((person) => (
                        <UserCard
                           key={person._id}
                           id={person.id}
                           name={person.name}
                           username={person.username}
                           imgUrl={person.image}
                           personType="User"
                        />
                     ))}
                  </>
               )}
            </div>
         </h1>
      </section>
   );
};
export default Page;
