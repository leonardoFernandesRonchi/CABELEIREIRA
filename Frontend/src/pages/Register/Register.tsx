import { Shield, Lock, Mail } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Input } from "../../components";
import { usersService } from "@/services";
import { useState } from "react";
import { Snackbar, Spinning } from "@/components";
import schema from "./schema";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    variant: "error" | "success" | "default";
  } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await usersService.register({
        email: data.email,
        password: data.password,
        username: data.username,
      });
      setSnackbar({
        message: "Cadastro realizado com sucesso!",
        variant: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        message:
          `${error?.response?.data?.message}` || "Erro ao realizar cadastro",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-[#F5F8F5] to-[#DDF8DD] min-h-screen">
      <div className="max-w-sm flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3 h-[80%] rounded-lg bg-white shadow-lg"
        >
          <Shield size={48} className="mx-auto mt-8 text-green-500" />

          <h2 className="text-2xl font-bold text-center mt-1">
            Faça seu cadastro!
          </h2>

          <p className="text-center text-gray-600 mt-1">
            Faça seu cadastro para acessar a plataforma e aproveitar todos os
            recursos
          </p>

          {loading && <Spinning />}
          <div className="mt-2 p-1">
            <Input
              label="Email"
              type="email"
              icon={<Mail size={18} />}
              {...register("email")}
              error={errors.email?.message}
              placeholder="Digite seu email"
            />
          </div>

          <div className="mt-2 p-1">
            <Input
              label="Nome de usuário"
              type="text"
              icon={<Mail size={18} />}
              {...register("username")}
              error={errors.username?.message}
              placeholder="Digite seu nome de usuário"
            />
          </div>

          <div className="mt-2 p-1">
            <Input
              label="Senha"
              type="password"
              icon={<Lock size={18} />}
              {...register("password")}
              error={errors.password?.message}
              placeholder="Digite sua senha"
            />
          </div>

          <div className="mt-2 p-1">
            <Input
              label="Confirmação de senha"
              type="password"
              icon={<Lock size={18} />}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              placeholder="Confirme sua senha"
            />
          </div>

          {snackbar && (
            <div className="p-2">
              <Snackbar message={snackbar.message} variant={snackbar.variant} />
            </div>
          )}

          <div className="p-1 w-[90%] flex items-center justify-between mt-1 mx-auto">
            <button
              type="submit"
              className="w-full mt-3 bg-green-400 p-2.5 rounded-2xl text-black"
            >
              Criar conta
            </button>
          </div>

          <div className="p-1 h-[5%] flex items-center justify-center mt-1">
            <p className="flex items-center text-sm text-gray-600">
              Já tem uma conta?
              <Link to="/login" className="text-green-500 font-semibold ml-2">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
