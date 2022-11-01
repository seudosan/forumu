import { useFormHandler } from "@sutiles/react-form-handler";
import { useEffect, useState } from "react";
import { Input } from "../Input";

enum Page {
  form = "form",
  completed = "completed",
}

type User = {
  user: {
    username: string;
    email: string;
    password: string;
  };
  country: string;
  gender: string;
  agree: boolean;
};

export const App = () => {
  const [page, setPage] = useState<Page>(Page.form);
  const [userData, setUserData] = useState<User>();
  const { setInput, errors, touched, values, submitHandler } = useFormHandler({
    initValues: userData,
    common: {
      filter: new RegExp("^[A-Za-z]*$"),
    },
  });

  const onSubmit = submitHandler(() => {
    setPage(Page.completed);
  });

  useEffect(() => {
    /* setTimeout(() => {
      setValue("username", "My");
    }, 1000); */
    setTimeout(() => {
      setUserData({
        user: {
          username: "Rodrx",
          email: "rdrx@gmail.com",
          password: "1234",
        },
        country: "argentina",
        gender: "male",
        agree: true,
      });

      setTimeout(() => {
        setUserData({
          user: {
            username: "Jnx",
            email: "juannx@gmail.com",
            password: "1234",
          },
          country: "argentina",
          gender: "male",
          agree: true,
        });
      }, 5000);
    }, 5000);
  }, []);

  console.log(values);
  /* console.info(userData, values, "VALUES"); */
  /*  const { fields, touched, errors, props } = useForumu({
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
  }); */

  errors.user;

  return (
    <main className=" bg-slate-100 h-screen w-full px-3 py-16">
      {page === Page.form && (
        <section className="container mx-auto max-w-xs">
          <h1 className="text-2xl text-center">Forumu Example</h1>
          <p className="mt-1 mb-16 text-center">Test of library</p>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Input label="Partner" name="partner" value="Seudosan" readOnly tabIndex={-1} />
            <Input
              isDangerous={!!(errors.user?.username && touched.user?.username)}
              label="Username"
              helper={touched.user?.username && errors.user?.username}
              {...setInput("user.username", { autoComplete: "username" })}
            />
            <Input
              isDangerous={!!(errors.user?.email && touched.user?.email)}
              label="Email"
              name="email"
              helper={touched.user?.email && errors.user?.email}
              {...setInput("user.email", { autoComplete: "email" })}
            />
            <Input
              isDangerous={!!(errors.user?.password && touched.user?.password)}
              label="Password"
              helper={touched.user?.password && errors.user?.password}
              {...setInput("user.username", {
                autoComplete: "new-password",
              })}
            />
            <label htmlFor="agree">
              <input
                {...setInput("agree", {
                  type: "checkbox",
                  name: "agree",
                  id: "agree",
                })}
              />
              I'm agree
              <span className="mt-1 block text-red-500">{errors.agree}</span>
            </label>
            <div className="flex space-x-4">
              <label>
                <input
                  {...setInput("gender", {
                    value: "male",
                    type: "radio",
                  })}
                />{" "}
                Male
              </label>
              <label>
                <input
                  {...setInput("gender", {
                    value: "female",
                    type: "radio",
                  })}
                />{" "}
                Female
              </label>
            </div>
            <Input label="Country" name="country" list="dwarf-country" multiple />
            <div>
              <datalist id="dwarf-country" onChange={console.log}>
                <option value="argentina">Argentina</option>
                <option value="brazil">Brazil</option>
                <option value="united-states">United States</option>
              </datalist>
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
              <span>Username:</span> <span>{values.user.username}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Genre:</span> <span>{values.gender}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Email:</span> <span>{values.user.email}</span>
            </p>
            <p className="flex justify-between gap-3"></p>
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
