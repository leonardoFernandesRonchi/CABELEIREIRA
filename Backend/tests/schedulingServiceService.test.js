const {
  createSchedulingService,
  destroySchedulingService,
} = require("../services/schedulingServiceService");

const { SchedulingService, Scheduling, Service } = require("../models");

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },

  Service: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },

  Scheduling: {
    findOne: jest.fn(),
  },

  SchedulingService: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
beforeEach(() => {
  jest.clearAllMocks();
});

describe("createSchedulingService", () => {
  it("deve criar um serviço para um agendamento", async () => {
    Scheduling.findOne.mockResolvedValue({
      id: 1,
      userId: 1,
    });

    Service.findOne.mockResolvedValue({
      id: 1,
      name: "Corte",
    });

    SchedulingService.findOne.mockResolvedValue(null);

    SchedulingService.create.mockResolvedValue({
      id: 1,
      schedulingId: 1,
      serviceId: 1,
    });

    const result = await createSchedulingService({
      schedulingId: 1,
      serviceId: 1,
      userId: 1,
      role: "USER",
    });

    expect(Scheduling.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(Service.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(SchedulingService.findOne).toHaveBeenCalledWith({
      where: {
        schedulingId: 1,
        serviceId: 1,
      },
    });

    expect(SchedulingService.create).toHaveBeenCalledWith({
      schedulingId: 1,
      serviceId: 1,
    });

    expect(result).toEqual({
      id: 1,
      schedulingId: 1,
      serviceId: 1,
    });
  });

  it("Deve lançar erro se o schedulingId não for informado", async () => {
    await expect(
      createSchedulingService({
        serviceId: 1,
        userId: 1,
        role: "USER",
      }),
    ).rejects.toThrow("A schedulingId é obrigatório!");
  });

  it("Deve lançar erro se o serviceId não for informado", async () => {
    await expect(
      createSchedulingService({
        userId: 1,
        schedulingId: 1,
        role: "USER",
      }),
    ).rejects.toThrow("A serviceId é obrigatório!");
  });

  it("Deve lançar erro se o agendamento não existir", async () => {
    Scheduling.findOne.mockResolvedValue(null);
    await expect(
      createSchedulingService({
        schedulingId: 1,
        serviceId: 1,
        userId: 1,
      }),
    ).rejects.toThrow("Agendamento não encontrado");
  });

  it("deve permitir alteração quando o usuário for ADMIN", async () => {
    Scheduling.findOne.mockResolvedValue({
      id: 1,
      userId: 999,
    });

    Service.findOne.mockResolvedValue({
      id: 1,
    });

    SchedulingService.findOne.mockResolvedValue(null);

    SchedulingService.create.mockResolvedValue({
      id: 1,
      schedulingId: 1,
      serviceId: 1,
    });

    await expect(
      createSchedulingService({
        schedulingId: 1,
        serviceId: 1,
        userId: 1,
        role: "ADMIN",
      }),
    ).resolves.toBeDefined();
  });

  it("deve lançar erro quando o serviço não existir", async () => {
    Scheduling.findOne.mockResolvedValue({
      id: 1,
      userId: 1,
    });

    Service.findOne.mockResolvedValue(null);

    await expect(
      createSchedulingService({
        schedulingId: 1,
        serviceId: 1,
        userId: 1,
        role: "USER",
      }),
    ).rejects.toThrow("Serviço não encontrado");
  });

  it("deve lançar erro quando o serviço já estiver adicionado", async () => {
    Scheduling.findOne.mockResolvedValue({
      id: 1,
      userId: 1,
    });

    Service.findOne.mockResolvedValue({
      id: 1,
      name: "Corte",
    });

    SchedulingService.findOne.mockResolvedValue({
      id: 1,
      schedulingId: 1,
      serviceId: 1,
    });

    SchedulingService.create.mockResolvedValue({
      id: 1,
      schedulingId: 1,
      serviceId: 1,
    });

    await expect(
      createSchedulingService({
        schedulingId: 1,
        serviceId: 1,
        userId: 1,
        role: "USER",
      }),
    ).rejects.toThrow("Serviço");
  });

  describe("destroySchedulingService", () => {
    it("deve remover um serviço do agendamento", async () => {
      const schedulingService = {
        scheduling: {
          userId: 1,
        },
        destroy: jest.fn(),
      };

      SchedulingService.findOne.mockResolvedValue(schedulingService);

      await destroySchedulingService({
        schedulingServiceId: 1,
        userId: 1,
        role: "USER",
      });

      expect(schedulingService.destroy).toHaveBeenCalled();
    });
  });

  it("não deve encontrar o serviço de agendamento", async () => {
    SchedulingService.findOne.mockResolvedValue(null);

    await expect(
      destroySchedulingService({
        schedulingServiceId: 1,
        userId: 1,
        role: "USER",
      }),
    ).rejects.toThrow("Serviço");
  });
});
