import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../../../utils/login.validator";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { loginService } from "../../../services/user/userService";
import { useDispatch } from "react-redux";
import { employeeLogin } from "../../../store/slices/employeeSlice";


const EmployeeLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  useEffect(()=>{
    enqueueSnackbar("Please Login", { variant: "info" })
  },[])

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await loginService(values);
        dispatch(employeeLogin(response.user));
        enqueueSnackbar(response.message, { variant: "success" });
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          enqueueSnackbar(error.response?.data?.message || "An unexpected error occurred", { variant: "error" });
        } else {
          enqueueSnackbar("An unexpected error occurred", { variant: "error" });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-blue-200 p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1742613206/video-conference-theme-multiracial-business-600nw-1932607703_k7jyyg.webp"
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
              Welcome back 
            </h2>
            {/* Form with onSubmit handler to prevent default behavior */}
            <form
              className="w-full max-w-sm space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
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
                  {...formik.getFieldProps("password")}
                />
                
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-blue-600 text-white cursor-pointer"
              >
                {formik.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;