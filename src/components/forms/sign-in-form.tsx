/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { SigninValidators } from "@/validators/admin";
import { Eye, EyeClosed, Loader2, Mail, Lock } from "lucide-react";
import { signIn } from "@/actions";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SigninValidators>>({
    resolver: zodResolver(SigninValidators),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting: isLoading } = form.formState;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: z.infer<typeof SigninValidators>) => {
    setIsRedirecting(true);
    try {
      const response = await signIn(values.email, values.password);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please check your credentials.";

      if (error.message.includes("Can't reach database server")) {
        errorMessage =
          "We're experiencing technical difficulties. Please try again later.";
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-none overflow-hidden">
        <CardHeader className="space-y-1 pb-8 pt-8 px-8">
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back, Admin
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          className="pl-11 h-12 border-gray-300 rounded-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          disabled={isLoading}
                          placeholder="Enter your email address"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          className="pl-11 pr-12 h-12 border-gray-300 rounded-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          onClick={handleShowPassword}
                          disabled={isLoading}
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          variant="ghost"
                          size="sm"
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeClosed className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-red-800 hover:from-primary hover:to-red-800 text-white font-semibold rounded-none shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] z-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default SignInForm;
