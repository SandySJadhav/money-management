'use client'

import React, { useState } from "react";
import { Button, Flex, Form, FormControl, Spinner, TextInput } from "@contentful/f36-components";
import Link from "next/link";
import { postData } from "@/lib/http.interceptor";
import { useRouter } from "next/navigation";

const Login = () => {
  const [userName, setUserName] = useState({ value: "", isValid: false, error: "Required" });
  const [password, setPassword] = useState({ value: "", isValid: false, error: "Required" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", isValid: false, error: "Required" });
  const [age, setAge] = useState({ value: 0, isValid: false, error: "Required" });
  const [firstName, setFirstName] = useState({ value: "", isValid: false, error: "Required" });
  const [lastName, setLastName] = useState({ value: "", isValid: false, error: "Required" });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const submitForm = async () => {
    setSubmitted(true);
    setIsLoading(true);
    if (userName.isValid && password.isValid && confirmPassword.isValid && age.isValid && firstName.isValid && lastName.isValid) {
      const res = await postData("/signup", {
        userName: userName.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        age: age.value,
        firstName: firstName.value,
        lastName: lastName.value
      });
      console.log("Response", res);
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

  const onChangeUserName = (e) => {
    setUserName({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
    });
  }

  const onChangeFirstName = (e) => {
    setFirstName({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
    });
  }

  const onChangeLastName = (e) => {
    setLastName({
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

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
    })
  }

  const onChangeAge = (e) => {
    console.log(e.target.value);
    setAge({
      value: e.target.value,
      isValid: e.target.value.length > 0,
      error: e.target.value.length > 0 ? "" : "Required",
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
              <FormControl isInvalid={submitted && !age.isValid}>
                <FormControl.Label htmlFor="age">Confirm You Age</FormControl.Label>
                <TextInput maxLength={16} type="number" min={1} max={75} onChange={onChangeAge} id="age" />
                {
                  submitted && !age.isValid && <FormControl.ValidationMessage>{age.error}</FormControl.ValidationMessage>
                }
              </FormControl>
              <Flex justifyContent="center" marginTop="spacingXl">
                <Button variant="primary" type="submit" isFullWidth isDisabled={isLoading}>
                  Sign Up {isLoading && <Spinner />}
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