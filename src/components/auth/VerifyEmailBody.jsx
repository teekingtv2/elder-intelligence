import React, { useEffect, useState } from "react";
import InputField from "../forms/InputField";
import CustomFormik from "../../utils/CustomFormik";
import { validateOtp } from "../../utils/validate";
import { otpValues } from "../../utils/initialValues";
import SubmitButton from "../forms/SubmitButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { errorNotification, successNotification } from "../../utils/helpers";
import axios from "axios";

const VerifyEmailBody = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const initialValues = otpValues();
  const validationSchema = validateOtp();
  const history = useNavigate();
  const location = useLocation();
  const userId = location.state.userId;

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  const resendOTP = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user-auth/resend-verification-otp`,
      { userId }
    );
    console.log(response);
    try {
      if (response.status === 200) {
        const data = response.data;
        successNotification(data.message);
      } else {
        errorNotification(response?.data?.error);
      }
    } catch (error) {
      errorNotification(error?.response?.data?.error);
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    const payload = {
      otp: values.otp,
      userId,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user-auth/verify-email`,
      payload
    );
    console.log(response);
    try {
      if (response.status === 200) {
        const data = response.data;
        successNotification(data.message);
        setTimeout(() => history("/dashboard"), 3000);
      } else {
        errorNotification(response?.data?.error);
      }
    } catch (error) {
      errorNotification(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div className="w-[100wv] h-[100vh] bg-[#0A0D16]">
        <div className="max-w-[500px] h-full mx-auto px-10 md:px-7 flex flex-col items-center justify-center pt-[90px] pb-[150px] md:py-0">
          <div className="flex flex-col items-center gap-2 px-3 w-full">
            <Link to="/" className="flex flex-col gap-0">
              <p className="uppercase font-bold text-[22px] text-white tracking-[8px] leading-[15px] mb-0">
                Elder
              </p>
              <p className="lowercase text-[12px] text-white tracking-widest mt-0">
                Intelligence
              </p>
            </Link>

            <div className="text-[14px] mb-5 text-[#ffffffc9]">
              Provide the OTP earlier you received
            </div>
          </div>
          <div className="py-2 w-full">
            <CustomFormik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <div className="font-bold text-[14.5px] md:text-[18px] grid grid-cols-1 gap-8 md:grid-cols-1 w-[100%] mb-2">
                <InputField name="otp" placeholder="Enter OTP" />
              </div>
              <SubmitButton title="Verify Email" className="mt-6 w-[100%]" />
              <div className="text-[14px] md:text-[16px] text-center mt-[20px] flex justify-center gap-2">
                Didn't recive the OTP?
                <div
                  onClick={resendOTP}
                  className="text-[#fff] font-semibold cursor-pointer"
                >
                  Resend OTP
                </div>
              </div>
            </CustomFormik>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailBody;
