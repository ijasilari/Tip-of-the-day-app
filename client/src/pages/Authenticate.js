import React, { useRef, useState, useContext } from "react";
import { useMutation } from "react-query";
import Input from "../components/Input";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { AuthContext } from "../components/auth-context";
import { signUpUser, loginUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import "./Authenticate.css";

import Joi from "joi";

const Authenticate = (props) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [isLoginMode, setLoginMode] = useState(true);
  const [inputError, setInputError] = useState();

  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string()
      .min(4)
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).required(),
  });

  const switchThemeHanlder = (errors) => {

    if (nameRef.current) {
      nameRef.current.style.backgroundColor = !errors
        ? backgroundColor
        : errors && errors.name
        ? "salmon"
        : "#d4edda";
    }
    if (emailRef.current) {
      emailRef.current.style.backgroundColor = !errors
        ? backgroundColor
        : errors && errors.email
        ? "salmon"
        : "#d4edda";
        if(errors && errors.signup) {
          emailRef.current.style.backgroundColor = 'salmon'
        }
        if (errors && errors.login) {
          emailRef.current.style.backgroundColor = "salmon";
        }
    }
    if (passwordRef.current) {
      passwordRef.current.style.backgroundColor = !errors
        ? backgroundColor
        : errors && errors.password
        ? "salmon"
        : "#d4edda";
        if (errors && errors.login) {
          passwordRef.current.style.backgroundColor = "salmon";
        }
    }
  };

  let backgroundColor = "";
  if (props.theme === "light") {
    backgroundColor = "white";
    switchThemeHanlder(inputError);
  } else {
    backgroundColor = "#1C1C1C";
    switchThemeHanlder(inputError);
  }

  const validateData = (user) => {
    const result = schema.validate(user, { abortEarly: false });

    if (result.error) {
      const errors = {};
      result.error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
        // errors[err.context.key] = err.message;
        console.log(errors);
      });

      nameRef.current.style.backgroundColor =
        user.name.length >= 3 ? "#d4edda" : user.name ? "salmon" : "salmon";
      emailRef.current.style.backgroundColor =
        user.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
          ? "#d4edda"
          : "salmon";
      passwordRef.current.style.backgroundColor =
        user.password.length >= 8
          ? "#d4edda"
          : user.password
          ? "salmon"
          : "salmon";

      setInputError(errors);
      return false;
    } else {
      nameRef.current.style.backgroundColor = "#d4edda";
      emailRef.current.style.backgroundColor = "#d4edda";
      passwordRef.current.style.backgroundColor = "#d4edda";
      setInputError();
      return true;
    }
  };
  const switchModeHanlder = () => {
    setLoginMode((prevMode) => !prevMode);
    setInputError();
    if (nameRef.current) {
      nameRef.current.style.backgroundColor = backgroundColor;
    }
    if (emailRef.current) {
      emailRef.current.style.backgroundColor = backgroundColor;
      emailRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.style.backgroundColor = backgroundColor;
      passwordRef.current.value = "";
    }
  };

  const auth = useContext(AuthContext);

  const signUpUserMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      // Will execute only once, for the last mutation,
      // regardless which mutation resolves first
      console.log(data);
      auth.login(data.id, data.token, data.role);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      setInputError({ signup: "Email exists" });
      // if (emailRef.current) {
      //  emailRef.current.style.backgroundColor = "salmon";
      // }
    },
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Will execute only once, for the last mutation,
      // regardless which mutation resolves first
      console.log(data);
      auth.login(data.id, data.token, data.role);
      navigate("/");
    },
    onError: (error) => {
      // An error happened!
      setInputError({ login: "Wrong credentials" });
      console.log(error);
    },
  });

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!isLoginMode) {
      if (
        !validateData({
          name: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        })
      ) {
        return;
      }
    }

    if (isLoginMode) {
      loginUserMutation.mutate({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
    } else {
      signUpUserMutation.mutate({
        username: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      className="background"
    >
      <Card
        style={{ padding: "20px", backgroundColor: backgroundColor, marginTop: '0'}}
        data-testid="authPage"
        className="authentication"
      >
        <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
        <form onSubmit={onSubmitHandler}>
          {" "}
          {!isLoginMode && (
            <Input id="name" ref={nameRef} type="text" label="Name" />
          )}
          <Input id="email" ref={emailRef} type="text" label="Email" />
          <Input
            id="password"
            ref={passwordRef}
            type="password"
            label="Password"
          />
          <Button variant="contained" type="submit" className="buttons">
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button
          variant="outlined"
          onClick={switchModeHanlder}
          className="signUp"
        >
          {isLoginMode ? "SignUp" : "Login"} instead?
        </Button>
        {inputError ? (
          <div style={{ color: "red" }}>{inputError.name}</div>
        ) : null}
        {inputError ? (
          <div style={{ color: "red" }}>{inputError.email}</div>
        ) : null}
        {inputError ? (
          <div style={{ color: "red" }}>{inputError.password}</div>
        ) : null}
        {inputError ? (
          <div style={{ color: "red" }}>{inputError.login}</div>
        ) : null}
        {inputError ? (
          <div style={{ color: "red" }}>{inputError.signup}</div>
        ) : null}
      </Card>
    </div>
  );
};

export default Authenticate;
