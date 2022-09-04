import { Input } from "@/components/Input";
import { useForumu } from "@sutiles/forumu";
import { useState } from "react";

enum Page {
  form = "form",
  completed = "completed",
}

const initValues = {
  username: "",
  email: "",
  password: "",
  agree: false,
  country: "",
};

export const App = () => {
  const [page, setPage] = useState<Page>(Page.form);
  const { fields, errors, props } = useForumu({
    initValues,
    onSubmit: () => setPage(Page.completed),
    validator: ({ agree }, errors) => {
      !agree && (errors.agree = "You need to accept before continue");
    },
  });

  return (
    <main className=" bg-slate-100 h-screen w-full px-3 py-16">
      {page === Page.form && (
        <section className="container mx-auto max-w-xs">
          <h1 className="text-2xl text-center">Forumu Example</h1>
          <p className="mt-1 mb-16 text-center">Test of library</p>
          <form className="flex flex-col gap-4" {...props.form}>
            <Input label="Partner" name="partner" value="Seudosan" readOnly />
            <Input label="Username" name="username" autoComplete="username" value={fields.username} {...props.input} />
            <Input label="Email" name="email" autoComplete="email" value={fields.email} {...props.input} />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              helper="Secure password:"
              value={fields.password}
              {...props.input}
            />
            <label htmlFor="agree">
              <input type="checkbox" name="agree" id="agree" checked={fields.agree} {...props.input} /> Estoy de acuerdo
              <span className="mt-1 block text-red-500">{errors.agree}</span>
            </label>
            <button type="submit" className="mt-4 bg-violet-600 p-2.5 text-slate-50 font-medium rounded-md">
              Submit
            </button>
            <button type="reset" className="text-violet-600 font-medium hover:underline">
              Reset
            </button>
          </form>
        </section>
      )}
      {page === Page.completed && (
        <section className="container mx-auto w-max mt-12 flex flex-col">
          <h2 className="text-xl text-center">Your values</h2>
          <div className="mt-4">
            <p className="flex justify-between gap-3">
              <span>Username:</span> <span>{fields.username}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Email:</span> <span>{fields.email}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Password:</span> <span>{[...fields.password].map(() => "*")}</span>
            </p>
          </div>
          <button
            className="text-violet-600 font-medium hover:underline"
            onClick={() => {
              setPage(Page.form);
            }}
          >
            Back
          </button>
        </section>
      )}
    </main>
  );
};
