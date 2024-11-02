// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';

import Match from "./Match";

export default async function VolunteerMatching() {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect('/signin');
  // }

  return (
    <>
      <div className="max-w-1170 w-full mx-auto flex justify-center h-full ">
      <img
          src="/images/help.png"
          alt="Background"
          style={{ width: '1100px', height: 'auto' }}
          className="absolute bottom-0 right-12 transform translate-y-16 z-0"
        />
        <img
          src="/images/tree.png"
          alt="Background"
          style={{ width: '1200px', height: 'auto' }}
          className="absolute bottom-0 left-0 transform translate-y-10 z-0"
        />
        
        <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5 z-10">
          {/* <VolunteerMatching session={session} /> */}
          <Match />
          <hr className="border-gray-300 w-full my-4 mb-6" />
        </div>
      </div>
    </>
  );
}
