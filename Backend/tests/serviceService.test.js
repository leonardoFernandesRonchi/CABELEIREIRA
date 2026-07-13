const { createService, updateService } = require("../services/serviceService");
const { Service } = require("../models");

jest.mock("../models");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createService", () => {
  it("deve criar um serviço", async () => {
    Service.findOne.mockResolvedValue(null);

    Service.create.mockResolvedValue({
      id: 1,
      name: "Corte",
      description: "Corte masculino",
      price: 50,
    });

    const result = await createService({
      name: "Corte",
      description: "Corte masculino",
      price: 50,
    });

    expect(Service.findOne).toHaveBeenCalledWith({
      where: {
        name: "Corte",
      },
    });

    expect(Service.create).toHaveBeenCalledWith({
      name: "Corte",
      description: "Corte masculino",
      price: 50,
    });

    expect(result).toEqual({
      id: 1,
      name: "Corte",
      description: "Corte masculino",
      price: 50,
    });
  });

  it("deve lançar erro se o nome não for informado", async () => {
    await expect(
      createService({
        description: "Corte masculino",
        price: 50,
      }),
    ).rejects.toThrow("A name");

    expect(Service.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro se a descrição não for informada", async () => {
    await expect(
      createService({
        name: "Corte",
        price: 50,
      }),
    ).rejects.toThrow("A description");

    expect(Service.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro se o preço não for informado", async () => {
    await expect(
      createService({
        name: "Corte",
        description: "Corte masculino",
      }),
    ).rejects.toThrow("A price");

    expect(Service.findOne).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando o serviço já existir", async () => {
    Service.findOne.mockResolvedValue({
      id: 1,
      name: "Corte",
    });

    await expect(
      createService({
        name: "Corte",
        description: "Corte masculino",
        price: 50,
      }),
    ).rejects.toThrow("Serviço");
  });
});

describe("updateService", () => {
  it("deve atualizar um serviço", async () => {
    const service = {
      id: 1,
      name: "Corte",
      description: "Descrição antiga",
      price: 40,
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: "Corte Premium",
        description: "Nova descrição",
        price: 60,
      }),
    };

    Service.findOne.mockResolvedValue(service);

    const result = await updateService({
      serviceId: 1,
      name: "Corte Premium",
      description: "Nova descrição",
      price: 60,
    });

    expect(Service.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(service.update).toHaveBeenCalledWith({
      name: "Corte Premium",
      description: "Nova descrição",
      price: 60,
    });

    expect(result).toEqual({
      id: 1,
      name: "Corte Premium",
      description: "Nova descrição",
      price: 60,
    });
  });

  it("deve lançar erro quando o serviço não existir", async () => {
    Service.findOne.mockResolvedValue(null);

    await expect(
      updateService({
        serviceId: 1,
      }),
    ).rejects.toThrow("Serviço não encontrado");
  });

  it("deve manter os dados antigos quando nenhum campo for informado", async () => {
    const service = {
      id: 1,
      name: "Corte",
      description: "Descrição",
      price: 50,
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: "Corte",
        description: "Descrição",
        price: 50,
      }),
    };

    Service.findOne.mockResolvedValue(service);

    await updateService({
      serviceId: 1,
    });

    expect(service.update).toHaveBeenCalledWith({
      name: "Corte",
      description: "Descrição",
      price: 50,
    });
  });
});
