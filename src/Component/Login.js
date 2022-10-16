import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
function LoginPage() {
  const [submit, setSubmit] = useState(false);
  const [loginError, setLoginError] = useState("");
  const onLogin = async (data) => {
    setSubmit(true); // 제출 버튼 눌렸다면 버튼 사용불가
    try {
      // auth 서버에 접근해서 이메일과 비밀번호를 확인 해당 정보를 loginUser에 넣어줌
      let loginUser = await signInWithEmailAndPassword(
        getAuth(),
        data.email,
        data.password
      );

      // 로그인 완료하면
      setSubmit(false);
    } catch (errors) {
      setSubmit(false); // 로그인 버튼 못눌리게
      setLoginError(errors.message); // 로그인 불가 에러
      setTimeout(() => {
        // 5초 후 에러메세지 제거
        setLoginError("");
      }, 5000);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: onchange });

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[440px]  bg-[#FCF7F3] flex flex-col items-center rounded-3xl drop-shadow-xl">
        <div className="text-[24px] font-bold text-[#979492] text-center mt-[17px] ">
          Register
        </div>
        <form
          onSubmit={handleSubmit(onLogin)}
          className="flex flex-col space-y-[10px] mt-[20px]"
        >
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              className="w-[285px] h-[34px] border-2 border-gray-500 pl-[5px] rounded-[5px] pl-[5px]"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
            {errors.email && errors.email.type === "required" && (
              <p className="text-[#bf1650] before:inline content-['⚠ ']">
                required email
              </p>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <p className="text-[#bf1650] before:inline content-['⚠ ']">
                check email pattern
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-[285px] h-[34px] border-2 border-gray-500 pl-[5px] rounded-[5px] pl-[5px]"
              disabled={submit}
              {...register("password", {
                required: true,
                maxLength: 10,
              })}
            />
            {errors.password && errors.password.type === "required" && (
              <p className="text-[#bf1650] before:inline content-['⚠ ']">
                check password
              </p>
            )}
            {errors.password && errors.password.type === "maxLength" && (
              <p className="text-[#bf1650] before:inline content-['⚠ ']">
                check password
              </p>
            )}
            <input
              type="submit"
              value={"로 그 인"}
              className="mt-[20px] mb-3 w-[200px] h-[40px] bg-[#CFC9C3] self-center text-white font-semibold rounded-[10px] "
            />
          </div>

          {/* <input type="submit" value={"SUBMIT"} disabled={submitStop} /> */}
          {loginError ? (
            <p className="text-[#bf1650] before:inline content-['⚠ ']">
              {loginError}
            </p>
          ) : null}
        </form>
        <Link to="/register">
          <div className="mb-4 text-[16px] text-[#979492] font-bold">
            회원 가입이 되지 않았다면...
          </div>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
