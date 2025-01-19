'use client'

import React, { useState } from "react";
import { Button, Flex, Form, FormControl, Spinner, TextInput } from "@contentful/f36-components";
import Link from "next/link";
import { postData } from "@/lib/http.interceptor";
import { useRouter } from "next/navigation";
import { DoneIcon } from "@contentful/f36-icons";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/;

const Login = () => {
  const [userName, setUserName] = useState({ value: "", isValid: false, error: "Required" });
  const [password, setPassword] = useState({ value: "", isValid: false, error: "Required" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", isValid: false, error: "Required" });
  const [firstName, setFirstName] = useState({ value: "", isValid: false, error: "Required" });
  const [lastName, setLastName] = useState({ value: "", isValid: false, error: "Required" });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmitResponse = ({ status, error }) => {
    if (status === 200) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      setSuccess(false);
      if (status === 409) {
        setUserName({
          isValid: false,
          error,
        });
      } else {
        setConfirmPassword({
          isValid: false,
          error,
        });
      }
    }
  }

  const submitForm = async () => {
    setSubmitted(true);
    setIsLoading(true);
    if (
      userName.isValid &&
      password.isValid &&
      confirmPassword.isValid &&
      firstName.isValid &&
      lastName.isValid
    ) {
      const res = await postData("/signup", {
        userName: userName.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        firstName: firstName.value,
        lastName: lastName.value
      });
      console.log("Response", res);
      handleSubmitResponse(res);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const onChangeUserName = (e) => {
    const { value } = e.target;
    setUserName({
      value,
      isValid: value.length > 0,
      error: value.length > 0 ? "" : "Required",
    });
  }

  const onChangeFirstName = (e) => {
    const { value } = e.target;
    setFirstName({
      value,
      isValid: value.length > 0,
      error: value.length > 0 ? "" : "Required",
    });
  }

  const onChangeLastName = (e) => {
    const { value } = e.target;
    setLastName({
      value,
      isValid: value.length > 0,
      error: value.length > 0 ? "" : "Required",
    });
  }

  const onChangePassword = (e) => {
    const { value } = e.target;
    setPassword({
      value,
      isValid: passwordRegex.test(value),
      error: value.length > 0 ? passwordRegex.test(value) ? "" : "Password must be 4-12 characters long and include at least one letter and one number" : "Required",
    });
    if (confirmPassword.value.length > 0) {
      setConfirmPassword({
        value: confirmPassword.value,
        isValid: value === confirmPassword.value,
        error: value === confirmPassword.value ? "" : "Password & Confirm password should match!",
      });
    }
  }

  const onChangeConfirmPassword = (e) => {
    const { value } = e.target;
    setConfirmPassword({
      value,
      isValid: value.length > 0 && value === password.value,
      error: value.length > 0 ? value !== password.value ? "Password & Confirm password should match!" : "" : "Required",
    })
  }

  return (
    <>
      <div className="bg-light-gray overflow-auto w-full min-h-screen grid grid-cols-1 place-content-center">
        <div className="text-center mb-12">
          <h1>Welcome to Money Management</h1>
          <h4 className="text-light-gray mt-3">
            Create an Account
          </h4>
        </div>
        <div className="border-black rounded-lg bg-white border md:w-[490px] sm:w-full justify-self-center">
          <div className="flex p-10 flex-col space-6 my-0">
            <Form onSubmit={submitForm}>
              <FormControl isInvalid={submitted && !userName.isValid}>
                <FormControl.Label htmlFor="userName">Username</FormControl.Label>
                <TextInput onChange={onChangeUserName} id="userName" />
                {
                  submitted && !userName.isValid && <FormControl.ValidationMessage>{userName.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !firstName.isValid}>
                <FormControl.Label htmlFor="firstName">FistName</FormControl.Label>
                <TextInput onChange={onChangeFirstName} id="firstName" />
                {
                  submitted && !firstName.isValid && <FormControl.ValidationMessage>{firstName.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !lastName.isValid}>
                <FormControl.Label htmlFor="lastName">LastName</FormControl.Label>
                <TextInput onChange={onChangeLastName} id="lastName" />
                {
                  submitted && !lastName.isValid && <FormControl.ValidationMessage>{lastName.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !password.isValid}>
                <FormControl.Label htmlFor="password">Password</FormControl.Label>
                <TextInput maxLength={16} type="password" onChange={onChangePassword} id="password" />
                {
                  submitted && !password.isValid && <FormControl.ValidationMessage>{password.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <FormControl isInvalid={submitted && !confirmPassword.isValid}>
                <FormControl.Label htmlFor="confirmPassword">Confirm Password</FormControl.Label>
                <TextInput maxLength={16} type="password" onChange={onChangeConfirmPassword} id="confirmPassword" />
                {
                  submitted && !confirmPassword.isValid && <FormControl.ValidationMessage>{confirmPassword.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <Flex justifyContent="center" marginTop="spacingXl">
                <Button variant={!success ? "primary" : "positive"} type="submit" isFullWidth isDisabled={isLoading || success}>
                  {!success ? <>Sign Up {isLoading && <Spinner variant="white" />}</> : <>Success <DoneIcon variant="white" /></>}
                </Button>
              </Flex>
            </Form>
            <hr />
            <div className="">
              Already have an Account? <Link href="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;