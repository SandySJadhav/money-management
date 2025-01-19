'use client'

import React, { useState } from "react";
import { Button, Flex, Form, FormControl, Spinner, TextInput } from "@contentful/f36-components";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { DoneIcon } from "@contentful/f36-icons";
import { useRouter } from "next/navigation";
import {
  LOGIN,
  LOGIN_TO_MONEY_MANAGEMENT_APP,
  NEW_USER_SIGNUP_MESSAGE,
  PASSWORD,
  REQUIRED, SIGN_UP,
  SUCCESS,
  USER_DOES_NOT_EXIST,
  USERNAME,
  WELCOME_BACK,
  WRONG_PASSWORD
} from "@/constants";

const Login = () => {
  const [userName, setUserName] = useState({ value: "", isValid: false, error: REQUIRED });
  const [password, setPassword] = useState({ value: "", isValid: false, error: REQUIRED });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleLoginResponse = ({ status, error }) => {
    if (status === 200) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setSuccess(false);
      if (error === '401') {
        setPassword({
          isValid: false,
          error: WRONG_PASSWORD,
        });
      } else if (error === '404') {
        setUserName({
          isValid: false,
          error: USER_DOES_NOT_EXIST,
        });
      } else {
        setPassword({
          isValid: false,
          error,
        });
      }
    }
  }

  const submitForm = async () => {
    setSubmitted(true);
    setIsLoading(true);
    if (userName.isValid && password.isValid) {
      const res = await signIn("credentials", {
        redirect: false,
        userName: userName.value,
        password: password.value,
      });
      handleLoginResponse(res);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const onChangeUsername = (e) => {
    setUserName({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : REQUIRED,
    });
  }

  const onChangePassword = (e) => {
    setPassword({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : REQUIRED,
    })
  }

  return (
    <>
      <div className="bg-light-gray overflow-auto w-full min-h-screen grid grid-cols-1 place-content-center">
        <div className="text-center mb-12">
          <h1>{WELCOME_BACK}</h1>
          <h4 className="text-light-gray mt-3">
            {LOGIN_TO_MONEY_MANAGEMENT_APP}
          </h4>
        </div>
        <div className="border-black rounded-lg bg-white border md:w-[490px] sm:w-full justify-self-center">
          <div className="flex p-10 flex-col space-6 my-0">
            <Form onSubmit={submitForm}>
              <FormControl isInvalid={submitted && !userName.isValid}>
                <FormControl.Label htmlFor="userName">{USERNAME}</FormControl.Label>
                <TextInput onChange={onChangeUsername} id="userName" />
                {
                  submitted && !userName.isValid && <FormControl.ValidationMessage>{userName.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !password.isValid}>
                <FormControl.Label htmlFor="password">{PASSWORD}</FormControl.Label>
                <TextInput maxLength={16} type="password" id="password" onChange={onChangePassword} />
                {
                  submitted && !password.isValid && <FormControl.ValidationMessage>{password.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <Flex justifyContent="center" marginTop="spacingXl">
                <Button variant={!success ? "primary" : "positive"} type="submit" isFullWidth isDisabled={isLoading || success}>
                  {!success ? <>{LOGIN} {isLoading && <Spinner variant="white" />}</> : <>{SUCCESS} <DoneIcon variant="white" /></>}
                </Button>
              </Flex>
            </Form>
            <hr />
            <div className="">
              {NEW_USER_SIGNUP_MESSAGE} <Link href="/signup">{SIGN_UP}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;