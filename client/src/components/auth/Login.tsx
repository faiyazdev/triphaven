import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { signinUserSchema } from "@/schemas/user.schema";
import { Link, Navigate, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/api/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import { useLoginMutation } from "@/redux/api/services/authApi";

const formSchema = signinUserSchema;

export default function Login() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // If user logged in, redirect to home page
  if (token) return <Navigate to="/" replace />;

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const res = await login(formData).unwrap();
      if (res?.success) {
        const accessToken = res.accessToken;
        const user = res.user;
        dispatch(
          setCredentials({
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            accessToken,
          })
        );
        console.log("Response:", res);
        navigate("/");
      }
    } catch (error) {
      console.error("Form submission error", error);
      navigate("/signin");
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      formData = {
        email: "",
        password: "",
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Login...
                    </>
                  ) : (
                    "Login"
                  )}{" "}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Do you not have an account?
            <Link to={"/signup"} className="underline ml-1">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
