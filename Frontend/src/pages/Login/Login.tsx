import { useState } from "react";
import { Shield, Lock, Mail } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "@/hooks/useAuth";

import { Spinning, Input } from "@/components";
import usersService from "@/services/usersService";
import schema from "./schema";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  type FormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await usersService.login({
        email: data.email,
        password: data.password,
      });
      login();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center bg-gradient-to-r from-[#F5F8F5] to-[#DDF8DD] min-h-screen">
          {loading && <Spinning />}

          <div className="max-w-sm flex items-center justify-center h-full">
            <div className="p-3 h-[80%] rounded-lg bg-white shadow-lg">
              <Shield size={48} className="mx-auto mt-8 text-green-500" />
              <h2 className="text-2xl font-bold text-center mt-1">
                Faça seu login!
              </h2>
              <p className="text-center text-gray-600 mt-1">
                Faça seu login para acessar a plataforma e aproveitar todos os
                recursos!
              </p>
              <div className="mt-2 p-1">
                <Input
                  placeholder="Digite seu e-mail"
                  label="E-mail"
                  error={errors.email?.message}
                  {...register("email")}
                  icon={<Mail size={18} />}
                />
              </div>
              <div className="mt-2 p-1">
                <Input
                  placeholder="Digite sua senha"
                  label="Senha"
                  type="password"
                  error={errors.password?.message}
                  {...register("password")}
                  icon={<Lock size={18} />}
                />
              </div>
              <div className="p-1 w-[90%] flex items-center justify-between mt-1 mx-auto">
                <button className="w-full mt-3 bg-green-400 p-2.5 rounded-2xl text-blacks">
                  Entrar na plataforma
                </button>
              </div>
              <div className="p-1 h-[5%] flex items-center justify-center mt-1">
                <p className="flex items-center text-sm text-gray-600">
                  Não tem uma conta?
                  {/* <a href="#" className="text-green-500 font-semibold ml-2">
                  Faça login
                </a> */}
                  <Link
                    to="/register"
                    className="text-green-500 font-semibold ml-2"
                  >
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
