const { signUpService, signInService } = require("../services/userService");
const { User } = require("../models");
const { bcryptHash, bcryptCompare } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");

jest.mock("../models");
jest.mock("../helpers/bcrypt");
jest.mock("../helpers/jwt");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("signUpService", () => {
  it("deve cadastrar um usuário", async () => {
    User.findOne.mockResolvedValue(null);

    bcryptHash.mockResolvedValue("senhaHash");

    User.create.mockResolvedValue({
      id: 1,
      email: "leo@email.com",
      username: "leo",
    });

    jwtSign.mockResolvedValue("token123");

    const result = await signUpService({
      username: "leo",
      email: "leo@email.com",
      password: "123456",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "leo@email.com",
      },
    });

    expect(bcryptHash).toHaveBeenCalledWith("123456");

    expect(User.create).toHaveBeenCalled();

    expect(jwtSign).toHaveBeenCalled();

    expect(result).toEqual({
      user: {
        id: 1,
        email: "leo@email.com",
        username: "leo",
      },
      token: "token123",
    });
  });

  it("deve lançar erro se username não for informado", async () => {
    await expect(
      signUpService({
        email: "leo@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("A username");

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro se email não for informado", async () => {
    await expect(
      signUpService({
        username: "leo",
        password: "123456",
      }),
    ).rejects.toThrow("An email");

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro se password não for informada", async () => {
    await expect(
      signUpService({
        username: "leo",
        email: "leo@email.com",
      }),
    ).rejects.toThrow("A password");

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando o email já estiver cadastrado", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "leo@email.com",
      username: "leo",
    });

    await expect(
      signUpService({
        username: "joao",
        email: "leo@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Email");
  });
});

describe("signInService", () => {
  it("deve realizar login com sucesso", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "leo@email.com",
      username: "leo",
      password: "senhaHash",
    });

    bcryptCompare.mockResolvedValue(true);

    jwtSign.mockResolvedValue("token123");

    const result = await signInService({
      email: "leo@email.com",
      password: "123456",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "leo@email.com",
      },
    });

    expect(bcryptCompare).toHaveBeenCalledWith("123456", "senhaHash");

    expect(jwtSign).toHaveBeenCalledWith({
      id: 1,
      email: "leo@email.com",
    });

    expect(result).toEqual({
      user: {
        id: 1,
        email: "leo@email.com",
        username: "leo",
      },
      token: "token123",
    });
  });

  it("deve lançar erro se email não for informado", async () => {
    await expect(
      signInService({
        password: "123456",
      }),
    ).rejects.toThrow("An email");

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro se password não for informada", async () => {
    await expect(
      signInService({
        email: "leo@email.com",
      }),
    ).rejects.toThrow("A password");

    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando o usuário não existir", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      signInService({
        email: "leo@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("deve lançar erro quando a senha estiver incorreta", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "leo@email.com",
      username: "leo",
      password: "senhaHash",
    });

    bcryptCompare.mockResolvedValue(false);

    await expect(
      signInService({
        email: "leo@email.com",
        password: "123456",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
