import { Input } from "@/components/Input";

export const App = () => {
  return (
    <main className="bg-slate-100 h-screen w-full px-3 py-16">
      <h1 className="text-2xl text-center">Forumu Example</h1>
      <p className="mt-1 mb-16 text-center">Test of library</p>
      <form className="flex flex-col gap-4">
        <Input label="Username" name="username" />
        <Input label="Email" name="email" />
        <Input label="Password" name="password" helper="Secure password: " />
        <button type="submit" className="mt-4 bg-violet-600 p-2.5 text-slate-50 font-medium rounded-md">
          Submit
        </button>
        <button type="reset" className="text-violet-600 font-medium hover:underline">
          Reset
        </button>
      </form>
    </main>
  );
};
