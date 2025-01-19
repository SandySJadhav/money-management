'use client'

import React, { useState } from "react";
import { Button, Flex, Form, FormControl, Spinner, TextInput } from "@contentful/f36-components";
import Link from "next/link";
import { postData } from "@/lib/http.interceptor";
import { DoneIcon } from "@contentful/f36-icons";
import { useRouter } from "next/navigation";

const Login = () => {
  const [userName, setUserName] = useState({ value: "", isValid: false, error: "Required" });
  const [password, setPassword] = useState({ value: "", isValid: false, error: "Required" });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const submitForm = async () => {
    setSubmitted(true);
    setIsLoading(true);
    if (userName.isValid && password.isValid) {
      const res = await postData("/login", {
        userName: userName.value,
        password: password.value,
      });
      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setSuccess(false);
        if (res.status === 401) {
          setPassword({
            isValid: false,
            error: "Wrong password!",
          });
        } else if (res.status === 404) {
          setUserName({
            isValid: false,
            error: "Username does not exist!",
          });
        } else {
          setPassword({
            isValid: false,
            error: "Internal Server Error!",
          });
        }
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const onChangeUsername = (e) => {
    setUserName({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
    });
  }

  const onChangePassword = (e) => {
    setPassword({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
    })
  }

  return (
    <>
      <div className="bg-light-gray overflow-auto w-full min-h-screen grid grid-cols-1 place-content-center">
        <div className="text-center mb-12">
          <h1>Welcome back</h1>
          <h4 className="text-light-gray mt-3">
            Login to your Money Management Account
          </h4>
        </div>
        <div className="border-black rounded-lg bg-white border md:w-[490px] sm:w-full justify-self-center">
          <div className="flex p-10 flex-col space-6 my-0">
            <Form onSubmit={submitForm}>
              <FormControl isInvalid={submitted && !userName.isValid}>
                <FormControl.Label htmlFor="userName">Username</FormControl.Label>
                <TextInput onChange={onChangeUsername} id="userName" />
                {
                  submitted && !userName.isValid && <FormControl.ValidationMessage>{userName.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !password.isValid}>
                <FormControl.Label htmlFor="password">Password</FormControl.Label>
                <TextInput maxLength={16} type="password" id="password" onChange={onChangePassword} />
                {
                  submitted && !password.isValid && <FormControl.ValidationMessage>{password.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <Flex justifyContent="center" marginTop="spacingXl">
                <Button variant={!success ? "primary" : "positive"} type="submit" isFullWidth isDisabled={isLoading || success}>
                  {!success ? <>Login {isLoading && <Spinner variant="white" />}</> : <>Success <DoneIcon variant="white" /></>}
                </Button>
              </Flex>
            </Form>
            <hr />
            <div className="">
              New to Money Management App? <Link href="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;