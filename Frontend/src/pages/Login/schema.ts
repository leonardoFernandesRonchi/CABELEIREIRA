import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(5, "Senha precisa ter no mínimo 5 caracteres")
    .required("Senha obrigatória"),
});

export default schema;
