import { useForumu } from "@sutiles/forumu";
import { useState } from "react";
import { Input } from "../Input";

enum Page {
  form = "form",
  completed = "completed",
}

const initValues = {
  username: "",
  email: "",
  password: "",
  gender: "male",
  agree: false,
  country: "",
};

export const App = () => {
  const [page, setPage] = useState<Page>(Page.form);
  const { fields, touched, errors, props } = useForumu({
    initValues,
    onSubmit: () => setPage(Page.completed),
    validator: ({ agree, username, password, email }, errors) => {
      // Username validator
      if (!username) {
        errors.username = "Username is required";
      } else if (username.length <= 4) {
        errors.username = "Username too short";
      } else if (username.length >= 16) {
        errors.username = "Username too long";
      }

      // Email validator
      if (!email) {
        errors.email = "Email is required";
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.email = "Invalid email";
      }

      // Password validator
      if (!password) {
        errors.password = "Password is required";
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
        errors.password = "Invalid password";
      }
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
            <Input label="Partner" name="partner" value="Seudosan" readOnly tabIndex={-1} />
            <Input
              isDangerous={!!(errors.username && touched.username)}
              label="Username"
              name="username"
              autoComplete="username"
              helper={touched.username && errors.username}
              value={fields.username}
              {...props.input}
            />
            <Input
              isDangerous={!!(errors.email && touched.email)}
              label="Email"
              name="email"
              autoComplete="email"
              helper={touched.email && errors.email}
              value={fields.email}
              {...props.input}
            />
            <Input
              isDangerous={!!(errors.password && touched.password)}
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              helper={touched.password && errors.password}
              value={fields.password}
              {...props.input}
            />
            <label htmlFor="agree">
              <input type="checkbox" name="agree" id="agree" checked={fields.agree} {...props.input} /> I'm agree
              <span className="mt-1 block text-red-500">{errors.agree}</span>
            </label>
            <div className="flex space-x-4">
              <label>
                <input type="radio" name="gender" value="male" checked={fields.gender === "male"} {...props.input} /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={fields.gender === "female"} {...props.input} /> Female
              </label>
            </div>
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
              <span>Genre:</span> <span>{fields.gender}</span>
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
