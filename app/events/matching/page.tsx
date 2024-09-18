// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';

export default async function VolunteerMatching() {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect('/signin');
  // }

  return (
    <>
      <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
        <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
          <p>Hi Jorge, enter volunteer matching component here</p>
          <hr className="border-gray-300 w-full my-4 mb-6" />
        </div>
      </div>
    </>
  );
}
