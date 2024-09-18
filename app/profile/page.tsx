import Profile from './Profile';
// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';

export default async function Settings() {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect('/signin');
  // }

  return (
    <>
      <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
        <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
          {/* <Profile session={session} /> */}
          <Profile />

          {/* <h2 className="text-2xl font-semibold mt-16 text-black-text">
            Delete Account
          </h2>
          <h4 className="mt-2 text-base font-light text-darkgrey-text">
            If you no longer wish to use HelpingHand, you can permanently delete
            your account.
          </h4> */}
          <hr className="border-gray-300 w-full my-4 mb-6" />
        </div>
      </div>
    </>
  );
}
