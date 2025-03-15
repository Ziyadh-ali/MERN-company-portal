import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-blue-200 p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1741277371/premium_vector-1726234498056-8a704b750025_qovekf.avif"  // Replace with actual illustration URL
              alt="Office illustration"
              className="object-cover"
            />
          </div>
        </div>

        
        <div className="w-full md:w-1/2 p-8">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <img
                src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1741307136/logo-transparent_gra32p.png"
                alt="HR Portal Logo"
                className="h-25"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Welcome back Admin
            </h2>
            <form className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" onClick={()=>navigate("/admin/dashboard")} className="w-full bg-blue-600 text-white cursor-pointer">
                Sign In
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <a  href="" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;