import AuthForm from './components/AuthForm';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col-reverse lg:flex-row min-h-screen">
      {/* Left Column (CTA) */}
      <div
        className="lg:w-1/2 p-10"
        style={{ background: 'linear-gradient(45deg,rgb(211, 173, 207),rgb(58, 69, 196))' }}
      >
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold mb-2 text-center text-white">
            Welcome to SmartTrip!
          </h1>
          <p className="text-lg my-6 mx-auto text-center text-white">
            Group Travel Application
          </p>
          <p className="text-sm opacity-90 mx-auto text-center text-white">
            Enjoy hassle-free travel.
          </p>

        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="lg:w-1/2 bg-gray-100 p-10">
        <div className="sm:mx-auto flex flex-col justify-center h-full sm:w-full sm:max-w-md">


          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
            Join SmartTrip!
          </h2>

          {/* Auth Form */}
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
