import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Background from "../../assets/login.png";
import Victory from "../../assets/victory.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


const Auth = () => {
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (response.data.user?.id) {
          setUserInfo(response.data.user)
          if (response.data.user.profileSetup) 
            navigate("/chat")
          else {
            navigate("/profile");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Username or password incorrect.");
        } else if (error.response && error.response.status === 404) {
          toast.error("Incorrect email.");
        } else {
          console.error("Login failed:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const handleSignup = async (e) => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        toast.success("Signup completed successfully!");

        if (response.status === 201) {
          setUserInfo(response.data.user)
          navigate("/profile");
        }
        console.log({ response });
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed, please try again.");
      }
    }
  };


  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Waving Icon" className="h-[5.625rem]" />
            </div>

            <p className="font-medium text-center mt-2">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="text-black text-opacity-90 w-full p-3 transition-all duration-300 border-b-2 border-transparent data-[state=active]:border-b-purple-500 data-[state=active]:font-semibold rounded-none"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-black text-opacity-90 w-full p-3 transition-all duration-300 border-b-2 border-transparent data-[state=active]:border-b-purple-500 data-[state=active]:font-semibold rounded-none"
                >
                  Create an account
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-4 mt-10" value="login"> 
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  className="rounded-full p-6 font-normal"
                  onClick={handleLogin}
                >
                  LOG IN WITH EMAIL
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 font-normal"
                  onClick={handleSignup}
                >
                  CREATE ACCOUNT
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="Background Login"
            className="h-[43.75rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
