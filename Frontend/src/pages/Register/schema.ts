import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),

  password: yup
    .string()
    .min(6, "Senha precisa ter no mínimo 6 caracteres")
    .required("Senha obrigatória"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas precisam ser iguais")
    .required("Confirmação obrigatória"),

  username: yup
    .string()
    .min(3, "Nome de usuário precisa ter no mínimo 3 caracteres")
    .required("Nome de usuário é obrigatório"),
});

export default schema;
