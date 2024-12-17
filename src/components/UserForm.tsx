import { SigninPayload } from "@/interfaces/SigninPayload";
import { SignupPayload } from "@/interfaces/SignupPayload";
import { FormEvent, useState } from "react";
import { SIGNIN, SIGNUP } from "../constants";

type FormType = "SIGNIN" | "SIGNUP";

interface UserFormProps {
  formType: FormType;
  handleSignin?: (payload: SigninPayload) => Promise<void>;
  handleSignup?: (payload: SignupPayload) => Promise<void>;
}

export default function UserForm(props: UserFormProps) {
  const { formType, handleSignin, handleSignup } = props;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (formType === SIGNIN && handleSignin) {
      handleSignin({ email, password });
    }

    if (formType === SIGNUP && handleSignup) {
      handleSignup({ email, password, fullName, isAdmin });
    }
  }

  return (
    <div className="hero bg-base-200 min-h-[calc(100vh-4rem)]">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">
            {formType === SIGNIN ? "Welcome back👋" : "Join now🎉"}
          </h1>
          <p className="py-6">
            {formType === SIGNIN
              ? "Welcome back! Sign in to access a curated list of job opportunities, manage your favorite listings, and stay updated on the latest openings tailored to your needs."
              : "Join our platform today! Sign up to create and post job listings, manage applications, and connect with top talent looking for their next opportunity."}
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            {formType === SIGNUP ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full name</span>
                </label>
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="full name"
                  className="input input-bordered"
                  required
                />
              </div>
            ) : null}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
            </div>
            {formType === SIGNUP ? (
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Sign up as Admin?</span>
                  <input
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    type="checkbox"
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            ) : null}
            <div className="form-control mt-6">
              <button className="btn btn-primary">
                {formType === SIGNUP ? "Sign up" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
