import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/connect.css";

import { axiosNew } from "../utils/axiosSetup.js";
import useAuth from "../hooks/useAuth.js";

const Connect = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleToggle = (isSignin = true) => {
    setErrors({});
    if (isSignin === toggle) return;
    setToggle((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
      confirm_password: e.target.elements?.confirm_password?.value || "",
    };

    let obj = {};
    if (!data?.email?.trim()) obj.email = "Email is required";
    if (!data?.password?.trim()) obj.password = "Password is required";
    if (!toggle && !data?.confirm_password?.trim())
      obj.confirm_password = "Confirm password is required";
    if (
      !toggle &&
      data.password?.trim() &&
      data?.confirm_password?.trim() &&
      data?.password?.trim() !== data?.confirm_password?.trim()
    )
      obj.confirm_password = "Password does not match";

    if (Object.values(obj).length > 0) return setErrors({ ...obj });
    else setErrors({});
    setLoading(true);

    if (toggle) {
      axiosNew
        .post("/auth/signin", data)
        .then((res) => {
          toast.success("Sign in successful!");
          const accessToken = res?.data?.accessToken;
          const _id = res?.data?.user_id;
          setAuth({ email: data.email, accessToken, _id });
          navigate(from, { replace: true });
        })
        .catch((err) => {
          console.log(err);
          if (!err?.response) return toast.error("No server response!");
          toast.error(err?.response?.data?.message || "Something went wrong!");
        })
        .finally(() => setLoading(false));
    } else {
      axiosNew
        .post("/auth/signup", data)
        .then((res) => {
          toast.success("Sign up successful!");
          setToggle((prev) => !prev);
          toast.success("Sign in to continue!");
        })
        .catch((err) => {
          if (!err?.response) return toast.error("No server response!");
          toast.error(err?.response?.data?.message || "Something went wrong!");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <section id='connect'>
      <form onSubmit={handleSubmit}>
        <div className='h4 text-center'>
          <p>{toggle ? "Sign In" : "Sign Up"} to ChatRoom</p>
        </div>

        <div className='mt-4'>
          <input placeholder='Email' name='email' type='email' />
          <div className='error'>{errors?.email}</div>
        </div>

        <div className='mt-2'>
          <input placeholder='Password' name='password' type='password' />
          <div className='error'>{errors?.password}</div>
        </div>

        {!toggle && (
          <div className='mt-2'>
            <input
              placeholder='Confirm Password'
              name='confirm_password'
              type='password'
            />
            <div className='error'>{errors?.confirm_password}</div>
          </div>
        )}

        <div className='text-center mt-3'>
          <button disabled={loading}>
            {loading ? "Loading..." : toggle ? "Sign In" : "Sign Up"}
          </button>
        </div>

        <hr />

        <div className='text-center'>
          <span onClick={handleToggle}>
            {toggle ? "Create new account" : "Already has an account"}
          </span>
        </div>
      </form>
    </section>
  );
};

export default Connect;
