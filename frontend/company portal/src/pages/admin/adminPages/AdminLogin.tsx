import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../../../utils/login.validator";
import { adminAxiosInstance } from "../../../api/admin.axios";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import { adminLogin } from "../../../store/slices/adminSlice";
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import LoginForm from "../../../components/LoginForm";


const AdminLoginPage = () => {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-blue-200 p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dr0iflvfs/image/upload/v1741277371/premium_vector-1726234498056-8a704b750025_qovekf.avif"
              alt="Office illustration"
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <LoginForm role="admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;