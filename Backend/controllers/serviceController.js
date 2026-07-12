const {
  createService,
  updateService,
  destroyService,
  getAllServices,
} = require("@services/serviceService");

const create = async (req, res, next) => {
  try {
    const { name, description, price, durationMinutes } = req.body;
    const newService = await createService({
      name,
      description,
      price,
    });
    res.status(201).json(newService);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { name, description, price, durationMinutes } = req.body;
    const updatedService = await updateService({
      serviceId,
      name,
      description,
      price,
    });
    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    console.log(serviceId);
    await destroyService(serviceId);
    res.status(200).json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, update, destroy, index };
