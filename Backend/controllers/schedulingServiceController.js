const {
  createSchedulingService,
  destroySchedulingService,
} = require("@services/schedulingServiceService");

const create = async (req, res, next) => {
  try {
    const { schedulingId, serviceId } = req.body;

    const { loggedUser } = req;

    console.log(schedulingId, serviceId, loggedUser.id, loggedUser.role);

    const newSchedulingService = await createSchedulingService({
      schedulingId,

      serviceId,

      userId: loggedUser.id,

      role: loggedUser.role,
    });

    res.status(201).json(newSchedulingService);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { schedulingServiceId } = req.params;

    const { loggedUser } = req;

    await destroySchedulingService({
      schedulingServiceId,

      userId: loggedUser.id,

      role: loggedUser.role,
    });

    res.status(200).json({
      message: "Serviço removido do agendamento com sucesso",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  destroy,
};
