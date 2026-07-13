const { Op } = require("sequelize");
const { Scheduling, User, Service } = require("../models");

const {
  FieldRequiredError,
  AlreadyTakenError,
} = require("../helpers/customErrors");

const DEFAULT_DURATION_MINUTES = 60;

// Verifica conflito de horário considerando duração fixa de 1 hora
async function checkSchedulingConflict({ dateTime, schedulingId = null }) {
  const newStart = new Date(dateTime);

  const newEnd = new Date(
    newStart.getTime() + DEFAULT_DURATION_MINUTES * 60000,
  );

  const schedulings = await Scheduling.findAll({
    where: {
      status: {
        [Op.ne]: "CANCELLED",
      },
    },
  });

  const conflict = schedulings.some((scheduling) => {
    // Ignora o próprio agendamento no update
    if (scheduling.id === schedulingId) {
      return false;
    }

    const existingStart = new Date(scheduling.dateTime);

    const existingEnd = new Date(
      existingStart.getTime() + DEFAULT_DURATION_MINUTES * 60000,
    );

    return newStart < existingEnd && newEnd > existingStart;
  });

  return conflict;
}

// Criar agendamento
async function createScheduling({ userId, dateTime }) {
  if (!userId) {
    throw new FieldRequiredError("userId");
  }

  if (!dateTime) {
    throw new FieldRequiredError("dateTime");
  }

  const parsedDate = new Date(dateTime);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Data inválida");
  }

  if (parsedDate < new Date()) {
    throw new Error("Não é possível criar agendamento no passado");
  }

  const conflict = await checkSchedulingConflict({
    dateTime: parsedDate,
  });

  if (conflict) {
    throw new AlreadyTakenError(
      "Agendamento",
      "Esse horário entra em conflito com outro agendamento",
    );
  }

  const newScheduling = await Scheduling.create({
    userId,

    dateTime: parsedDate,

    totalDurationMinutes: DEFAULT_DURATION_MINUTES,

    status: "PENDING",
  });

  return newScheduling;
}

// Atualizar agendamento
async function updateScheduling({
  schedulingId,
  userId,
  role,
  dateTime,
  status,
}) {
  const schedulingExists = await Scheduling.findByPk(schedulingId);

  if (!schedulingExists) {
    throw new Error("Agendamento não encontrado");
  }

  if (role !== "ADMIN" && schedulingExists.userId !== userId) {
    throw new Error("Você não tem permissão para alterar esse agendamento");
  }

  // Cliente não pode alterar com menos de 2 dias
  if (role !== "ADMIN") {
    const now = new Date();

    const schedulingDate = new Date(schedulingExists.dateTime);

    const difference = schedulingDate.getTime() - now.getTime();

    const twoDays = 2 * 24 * 60 * 60 * 1000;

    if (difference < twoDays) {
      throw new Error(
        "Não é possível alterar o agendamento com menos de 2 dias de antecedência. Entre em contato com o administrador.",
      );
    }
  }

  const newDateTime =
    dateTime !== undefined ? new Date(dateTime) : schedulingExists.dateTime;

  if (isNaN(newDateTime.getTime())) {
    throw new Error("Data inválida");
  }

  if (newDateTime < new Date()) {
    throw new Error("Não é possível alterar para uma data passada");
  }

  if (dateTime !== undefined) {
    schedulingExists.dateTime = newDateTime;
  }

  schedulingExists.totalDurationMinutes = DEFAULT_DURATION_MINUTES;

  schedulingExists.status =
    status !== undefined ? status : schedulingExists.status;

  await schedulingExists.save();

  return schedulingExists;
}

// Cancelar agendamento
async function destroyScheduling(schedulingId, userId, role) {
  const schedulingExists = await Scheduling.findByPk(schedulingId);

  if (!schedulingExists) {
    throw new Error("Agendamento não encontrado");
  }

  if (role !== "ADMIN" && schedulingExists.userId !== userId) {
    throw new Error("Você não tem permissão para cancelar esse agendamento");
  }

  schedulingExists.status = "CANCELLED";

  await schedulingExists.save();

  return {
    message: "Agendamento cancelado com sucesso",
  };
}

// Buscar agendamentos do usuário
async function getMySchedulings(userId) {
  if (!userId) {
    throw new FieldRequiredError("userId");
  }

  return await Scheduling.findAll({
    where: {
      userId,
    },

    order: [["dateTime", "ASC"]],
  });
}

// Buscar todos os agendamentos
async function getAllSchedulings() {
  return await Scheduling.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
      },
      {
        model: Service,
        as: "services",
      },
    ],
    order: [["dateTime", "ASC"]],
  });
}

async function findSchedulingSuggestions(userId, dateTime) {
  const parsedDate = new Date(dateTime);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Data inválida");
  }

  const startOfWeek = new Date(parsedDate);
  startOfWeek.setDate(parsedDate.getDate() - parsedDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const existingScheduling = await Scheduling.findOne({
    where: {
      userId,
      dateTime: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  if (!existingScheduling) {
    return {
      hasSuggestion: false,
    };
  }

  return {
    hasSuggestion: true,
    suggestedDate: existingScheduling.dateTime,
    scheduling: existingScheduling,
  };
}
module.exports = {
  createScheduling,

  updateScheduling,

  destroyScheduling,

  getMySchedulings,

  getAllSchedulings,

  findSchedulingSuggestions,
};
