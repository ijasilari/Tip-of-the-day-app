
import React, { useRef, useState, useContext } from "react";
import { useMutation } from "react-query";
import Input from "../components/Input";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { AuthContext } from "../components/auth-context";
import { signUpUser, loginUser } from "../api/users";
import './Authenticate.css';

const Authenticate = props => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoginMode, setLoginMode] = useState(true);

  const switchModeHanlder = () => {
    setLoginMode(prevMode => !prevMode);
  }

  const auth = useContext(AuthContext);

  const signUpUserMutation = useMutation({
    mutationFn: signUpUser, 
    onSuccess: (data) => {
      console.log(data);
      auth.login(data.id, data.token);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser, 
    onSuccess: (data) => {
      console.log(data);
      auth.login(data.id, data.token);
    },
    onError: (error) => {
      console.log(error);
    }
  });


  const onSubmitHandler = event => {
    event.preventDefault();
    if (isLoginMode) {
      loginUserMutation.mutate({
        email: emailRef.current.value,
        password: passwordRef.current.value
      })
    } else {
      signUpUserMutation.mutate({
        username: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
      })
    }
  }

  return(
    <Card className="authentication">
      <h2>{isLoginMode? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={onSubmitHandler}>
        {!isLoginMode && 
          <Input id="username" ref={nameRef} type="text" label="Username" 
        />}
        <Input id="email" ref={emailRef} type="text" label="Email" />
        <Input id="password" ref={passwordRef} type="password" label="Password" />

        <Button type="submit" disable={signUpUserMutation.isLoading}>
          {isLoginMode? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>

      <Button onClick={switchModeHanlder}>
        {isLoginMode? 'SignUp' : 'Login'} instead?
      </Button>

    </Card>
  )
};

export default Authenticate;