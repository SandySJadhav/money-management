'use client'

import React, { useState } from "react";
import { Button, Flex, Form, FormControl, Spinner, TextInput } from "@contentful/f36-components";
import Link from "next/link";
import { postData } from "@/lib/http.interceptor";
import { useRouter } from "next/navigation";
import { DoneIcon } from "@contentful/f36-icons";
import {
  ALREADY_HAVING_ACCOUNT,
  LOGIN,
  PASSWORD,
  PASSWORD_CRITERIA,
  PASSWORD_MISMATCH,
  REQUIRED,
  SIGN_UP,
  SUCCESS,
  USERNAME
} from "@/constants";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/;

const Login = () => {
  const [userName, setUserName] = useState({ value: "", isValid: false, error: REQUIRED });
  const [password, setPassword] = useState({ value: "", isValid: false, error: REQUIRED });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", isValid: false, error: REQUIRED });
  const [firstName, setFirstName] = useState({ value: "", isValid: false, error: REQUIRED });
  const [lastName, setLastName] = useState({ value: "", isValid: false, error: REQUIRED });
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
      error: value.length > 0 ? "" : REQUIRED,
    });
  }

  const onChangeFirstName = (e) => {
    const { value } = e.target;
    setFirstName({
      value,
      isValid: value.length > 0,
      error: value.length > 0 ? "" : REQUIRED,
    });
  }

  const onChangeLastName = (e) => {
    const { value } = e.target;
    setLastName({
      value,
      isValid: value.length > 0,
      error: value.length > 0 ? "" : REQUIRED,
    });
  }

  const onChangePassword = (e) => {
    const { value } = e.target;
    setPassword({
      value,
      isValid: passwordRegex.test(value),
      error: value.length > 0 ? passwordRegex.test(value) ? "" : PASSWORD_CRITERIA : REQUIRED,
    });
    if (confirmPassword.value.length > 0) {
      setConfirmPassword({
        value: confirmPassword.value,
        isValid: value === confirmPassword.value,
        error: value === confirmPassword.value ? "" : PASSWORD_MISMATCH,
      });
    }
  }

  const onChangeConfirmPassword = (e) => {
    const { value } = e.target;
    setConfirmPassword({
      value,
      isValid: value.length > 0 && value === password.value,
      error: value.length > 0 ? value !== password.value ? PASSWORD_MISMATCH : "" : REQUIRED,
    })
  }

  return (
    <>
      <div className="bg-light-gray overflow-auto w-full min-h-screen grid grid-cols-1 place-content-center">
        <div className="text-center mb-12">
          <h2 className="text-light-gray mt-3 text-2xl">
            Create a Money Management Account
          </h2>
        </div>
        <div className="border-gray-300 rounded-lg bg-white border md:w-[490px] sm:w-full justify-self-center">
          <div className="flex p-10 flex-col space-6 my-0">
            <Form onSubmit={submitForm}>
              <FormControl isInvalid={submitted && !userName.isValid}>
                <FormControl.Label htmlFor="userName">{USERNAME}</FormControl.Label>
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
                <FormControl.Label htmlFor="password">{PASSWORD}</FormControl.Label>
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
                  {!success ? <>{SIGN_UP} {isLoading && <Spinner variant="white" />}</> : <>{SUCCESS} <DoneIcon variant="white" /></>}
                </Button>
              </Flex>
            </Form>
            <hr />
            <div className="mt-3">
              {ALREADY_HAVING_ACCOUNT} <Link href="/login">{LOGIN}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;