import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "@/store/features/axios-instance";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { signupUserSchema } from "@/schemas/user.schema";
import { Link, Navigate, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const formSchema = signupUserSchema;

export default function SignupForm() {
  const user = useSelector((state: RootState) => state.auth.authData);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  // If user logged in, redirect to home page
  if (user) return <Navigate to="/" replace />;
  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      // Assuming an async registration function
      setIsLoading(true);
      const data = new FormData();
      data.append("username", formData.username);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      // 🕐 Simulate async API call (e.g. register user)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await api.post("/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // important if you're setting cookies (refresh-token)
      });
      if (res.data.success) {
        const accessToken = res.data.accessToken;
        const user = res.data.user;
        dispatch(setCredentials({ user, accessToken }));
        console.log("Response:", res.data);
        navigate("/");
      } // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
    } catch (error) {
      console.error("Form submission error", error);

      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
      formData = {
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    }
  }

  return (
    <div className="flex min-h-[60vh] h-full mx-auto min-w-[350] max-w-[600px]  items-center justify-center md:px-4">
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="md:text-2xl text-[18px]">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="johndoe56"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="******"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          placeholder="******"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link to={"/signin"} className="underline ml-1">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
