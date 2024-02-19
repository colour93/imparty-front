import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { ChangeEvent, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { idRegex, passwordRegex } from "../../utils/regex";
import _ from "lodash";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import { fetcher } from "../../utils/fetcher";
import { mutate } from "swr";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirectTarget = query.get("redirect");

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const formTypeLabel = useMemo(() => (isLogin ? "登录" : "注册"), [isLogin]);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const idError = useMemo(
    () => !isLogin && !idRegex.test(formData.id),
    [isLogin, formData]
  );
  const passwordError = useMemo(
    () => !isLogin && !passwordRegex.test(formData.password),
    [isLogin, formData]
  );
  const confirmPasswordError = useMemo(
    () => !isLogin && formData.password != formData.confirmPassword,
    [isLogin, formData]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      (!isLogin && (idError || passwordError || confirmPasswordError)) ||
      (isLogin && (formData.id === "" || formData.password === ""))
    ) {
      enqueueSnackbar("请检查表单", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    const data = isLogin
      ? _.pick(formData, ["id", "password"])
      : _.omit(formData, ["confirmPassword"]);

    const result = await fetcher(isLogin ? "/auth/login" : "/auth/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (result.code != 200) return;

    enqueueSnackbar(
      result.data.name
        ? "欢迎回来，".concat(result.data.name)
        : formTypeLabel.concat("成功"),
      {
        variant: "success",
      }
    );
    mutate("/user");
    navigate(redirectTarget ? decodeURI(redirectTarget) : "/");
  };

  return (
    <>
      <Helmet>
        <title>{formTypeLabel} - Imparty</title>
      </Helmet>

      <div className="h-screen w-screen w-auto flex justify-center items-center">
        <div className="max-w-md flex flex-col gap-4 flex-1">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {formTypeLabel}
          </h2>
          <TextField
            label="ID"
            name="id"
            fullWidth
            onChange={handleInputChange}
            error={idError}
            helperText={idError && "ID 应为 3-16 位英文字母、数字与下划线"}
            value={formData.id}
            required={!isLogin}
          />
          {!isLogin && (
            <TextField
              label="昵称"
              name="name"
              fullWidth
              onChange={handleInputChange}
              value={formData.name}
            />
          )}
          <TextField
            label="密码"
            name="password"
            type="password"
            fullWidth
            onChange={handleInputChange}
            error={passwordError}
            helperText={
              passwordError && "密码应为 8-24 位英文字母、数字与半角字符"
            }
            value={formData.password}
            required={!isLogin}
          />
          {!isLogin && (
            <TextField
              label="确认密码"
              name="confirmPassword"
              type="password"
              fullWidth
              onChange={handleInputChange}
              error={confirmPasswordError}
              value={formData.confirmPassword}
              required
            />
          )}
          <div className="flex gap-4">
            <LoadingButton
              className="flex-1"
              variant="contained"
              color="inherit"
              size="large"
              onClick={() => setIsLogin(!isLogin)}
              loading={isLoading}
            >
              <span>切换至{isLogin ? "注册" : "登录"}</span>
            </LoadingButton>
            <LoadingButton
              className="flex-1"
              variant="contained"
              size="large"
              onClick={handleSubmit}
              loading={isLoading}
            >
              <span>{formTypeLabel}</span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};
