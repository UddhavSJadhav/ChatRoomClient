import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import { axiosNew } from "../utils/axiosSetup.js";
import useAuth from "../hooks/useAuth.js";

const Connect = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggle = (isSignin = true) => {
    if (isSignin === toggle) return;
    setToggle((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
      confirm_password: e.target.elements?.confirm_password?.value || "",
    };
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
    <div className='container'>
      <div className='row'>
        <div className='col-7 card mx-auto mt-5'>
          <div className='card-body'>
            <h3 className='text-center'>ChatRoom</h3>
            <hr />
            <div className='row justify-content-evenly'>
              <button
                className={
                  toggle ? "btn btn-primary col-5" : "btn btn-secondary col-5"
                }
                onClick={() => handleToggle()}
                disabled={loading}>
                Sign In
              </button>
              <button
                className={
                  !toggle ? "btn btn-primary col-5" : "btn btn-secondary col-5"
                }
                onClick={() => handleToggle(false)}
                disabled={loading}>
                Sign Up
              </button>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className='mt-1'>
                <label>Email :</label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  autoComplete='off'
                />
              </div>
              <div className='mt-1'>
                <label>Password :</label>
                <input
                  type='password'
                  className='form-control'
                  id='password'
                  autoComplete='off'
                />
              </div>
              {!toggle && (
                <div className='mt-1'>
                  <label>Confirm Password :</label>
                  <input
                    type='password'
                    className='form-control'
                    id='confirm_password'
                    autoComplete='off'
                  />
                </div>
              )}
              <div className='mt-3 d-grid'>
                <button
                  type='submit'
                  className='btn btn-success'
                  disabled={loading}>
                  {loading ? "Loading" : toggle ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
