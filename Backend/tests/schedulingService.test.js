const {
  createScheduling,
  updateScheduling,
  destroyScheduling,
  getMySchedulings,
  findSchedulingSuggestions,
} = require("../services/schedulingService");

const { Scheduling, User, Service } = require("../models");
const { FieldRequiredError } = require("../helpers/customErrors");

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
    findByPk: jest.fn(),
  },
}));
beforeEach(() => {
  jest.clearAllMocks();
});

describe("getMySchedulings", () => {
  it("Deve lançar erro sem userId", async () => {
    await expect(getMySchedulings()).rejects.toBeInstanceOf(FieldRequiredError);
  });
});

describe("createScheduling", () => {
  it("Deve lançar erro sem userId", async () => {
    await expect(createScheduling()).rejects.toThrow("userId");
  });

  it("Deve lançar erro sem DateTime", async () => {
    await expect(
      createScheduling({
        userId: 1,
      }),
    ).rejects.toThrow("dateTime");
  });

  it("Deve lançar erro de data inválida", async () => {
    await expect(
      createScheduling({
        userId: 1,
        dateTime: "abc",
      }),
    ).rejects.toThrow("Data inválida");
  });

  it("Deve lançar erro ao criar agendamento no passado", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    await expect(
      createScheduling({
        userId: 1,
        dateTime: pastDate,
      }),
    ).rejects.toThrow("Não é possível criar agendamento no passado");
  });
});

describe("updateScheduling", () => {
  it("Não deve encontrar o agendamento", async () => {
    Scheduling.findByPk.mockResolvedValue(null);
    await expect(
      updateScheduling({
        schedulingId: 1,
        userId: 1,
        role: "ADMIN",
        dateTime: new Date(),
        status: "PENDING",
      }),
    ).rejects.toThrow("Agendamento não encontrado");
  });

  it("Sem permissão para usuário que não é dono do agendamento", async () => {
    Scheduling.findByPk.mockResolvedValue({
      schedulingId: 1,
      userId: 1,
      role: "ADMIN",
      dateTime: new Date(),
      status: "PENDING",
    });
    await expect(
      updateScheduling({
        schedulingId: 1,
        userId: 2,
        role: "CLIENT",
      }),
    ).rejects.toThrow("Você não tem permissão para alterar esse agendamento");
  });

  it("Admin pode alterar um agendamento de outro usuário", async () => {
    const scheduling = {
      id: 1,
      userId: 1,
      dateTime: new Date("2030-01-01T10:00:00"),
      status: "PENDING",
      totalDurationMinutes: 60,
      save: jest.fn(),
    };

    Scheduling.findByPk.mockResolvedValue(scheduling);

    const result = await updateScheduling({
      schedulingId: 1,
      userId: 2,
      role: "ADMIN",
    });

    expect(result).toBe(scheduling);
    expect(scheduling.save).toHaveBeenCalled();
  });

  it("Não é possível alterar com menos de 2 dias de antecedência", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    Scheduling.findByPk.mockResolvedValue({
      id: 1,
      userId: 1,
      dateTime: tomorrow,
      status: "PENDING",
      totalDurationMinutes: 60,
      save: jest.fn(),
    });

    await expect(
      updateScheduling({
        schedulingId: 1,
        userId: 1,
        role: "CLIENT",
      }),
    ).rejects.toThrow(
      "Não é possível alterar o agendamento com menos de 2 dias de antecedência. Entre em contato com o administrador.",
    );
  });

  it("Admin pode alterar um agendamento com menos de 2 dias de antecedência", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const scheduling = {
      id: 1,
      userId: 1,
      dateTime: tomorrow,
      status: "PENDING",
      totalDurationMinutes: 60,
      save: jest.fn(),
    };

    Scheduling.findByPk.mockResolvedValue(scheduling);

    const result = await updateScheduling({
      schedulingId: 1,
      userId: 999,
      role: "ADMIN",
    });

    expect(result).toBe(scheduling);
    expect(scheduling.save).toHaveBeenCalled();
  });

  it("Deve atualizar a data do agendamento quando dateTime for informado", async () => {
    const scheduling = {
      id: 1,
      userId: 1,
      dateTime: new Date("2030-01-01T10:00:00"),
      status: "PENDING",
      totalDurationMinutes: 60,
      save: jest.fn(),
    };

    Scheduling.findByPk.mockResolvedValue(scheduling);

    const newDate = new Date("2030-01-02T14:00:00");

    const result = await updateScheduling({
      schedulingId: 1,
      userId: 1,
      role: "CLIENT",
      dateTime: newDate,
    });

    expect(result.dateTime).toEqual(newDate);
    expect(scheduling.dateTime).toEqual(newDate);
    expect(scheduling.save).toHaveBeenCalled();
  });
});

describe("destroyScheduling", () => {
  it("Agendamento não encontrado sem id", async () => {
    Scheduling.findByPk.mockResolvedValue(null);

    await expect(
      destroyScheduling({
        userId: 1,
        role: "CLIENT",
      }),
    ).rejects.toThrow("Agendamento não encontrado");
  });

  it("Sem permissão para destruir um agendamento que não é seu", async () => {
    Scheduling.findByPk.mockResolvedValue({
      userId: 2,
    });

    await expect(
      destroyScheduling({
        userId: 1,
        role: "CLIENT",
      }),
    ).rejects.toThrow("Você não tem permissão para cancelar esse agendament");
  });

  it("Admin tem permissão para destruir um agendamento que não é dele", async () => {
    const scheduling = {
      id: 1,
      userId: 2,
      status: "PENDING",
      save: jest.fn(),
    };

    Scheduling.findByPk.mockResolvedValue(scheduling);

    const result = await destroyScheduling(1, 1, "ADMIN");

    expect(scheduling.status).toBe("CANCELLED");
    expect(scheduling.save).toHaveBeenCalled();

    expect(result).toEqual({
      message: "Agendamento cancelado com sucesso",
    });
  });
});
