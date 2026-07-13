const { SchedulingService, Scheduling, Service } = require("../models");

const {
  FieldRequiredError,
  AlreadyTakenError,
} = require("../helpers/customErrors");

// Adicionar serviço ao agendamento
async function createSchedulingService({
  schedulingId,
  serviceId,
  userId,
  role,
}) {
  if (!schedulingId) throw new FieldRequiredError("A schedulingId");

  if (!serviceId) throw new FieldRequiredError("A serviceId");

  const schedulingExists = await Scheduling.findOne({
    where: {
      id: schedulingId,
    },
  });

  if (!schedulingExists) throw new Error("Agendamento não encontrado");

  // Verifica se o usuário é dono do agendamento
  if (role !== "ADMIN" && schedulingExists.userId !== userId) {
    throw new Error("Você não tem permissão para alterar esse agendamento");
  }

  const serviceExists = await Service.findOne({
    where: {
      id: serviceId,
    },
  });

  if (!serviceExists) throw new Error("Serviço não encontrado");

  const schedulingServiceExists = await SchedulingService.findOne({
    where: {
      schedulingId,
      serviceId,
    },
  });

  if (schedulingServiceExists)
    throw new AlreadyTakenError(
      "Serviço",
      "Esse serviço já foi adicionado ao agendamento",
    );

  const newSchedulingService = await SchedulingService.create({
    schedulingId,

    serviceId,
  });

  return newSchedulingService;
}

// Remover serviço do agendamento
async function destroySchedulingService({ schedulingServiceId, userId, role }) {
  const schedulingServiceExists = await SchedulingService.findOne({
    where: {
      id: schedulingServiceId,
    },

    include: [
      {
        model: Scheduling,
        as: "scheduling",
      },
    ],
  });

  if (!schedulingServiceExists)
    throw new Error("Serviço do agendamento não encontrado");

  const scheduling = schedulingServiceExists.scheduling;

  if (role !== "ADMIN" && scheduling.userId !== userId) {
    throw new Error("Você não tem permissão para alterar esse agendamento");
  }

  await schedulingServiceExists.destroy();
}

module.exports = {
  createSchedulingService,
  destroySchedulingService,
};
