const { Service } = require("../models");
const {
  FieldRequiredError,
  AlreadyTakenError,
} = require("../helpers/customErrors");

async function createService({ name, description, price }) {
  if (!name) throw new FieldRequiredError(`A name`);
  if (!description) throw new FieldRequiredError(`A description`);
  if (!price) throw new FieldRequiredError(`A price`);

  const serviceExists = await Service.findOne({ where: { name } });
  if (serviceExists)
    throw new AlreadyTakenError("Serviço", "Tente atualizar ao invés de criar");

  const newService = await Service.create({
    name,
    description,
    price,
  });

  return newService;
}

async function updateService({ serviceId, name, description, price }) {
  const serviceExists = await Service.findOne({ where: { id: serviceId } });

  if (!serviceExists) throw new Error("Serviço não encontrado");

  if (name == undefined) name = serviceExists.name;
  if (description == undefined) description = serviceExists.description;
  if (price == undefined) price = serviceExists.price;

  const updatedService = await serviceExists.update({
    name,
    description,
    price,
  });

  return updatedService;
}

const destroyService = async (serviceId) => {
  const serviceExists = await Service.findOne({ where: { id: serviceId } });

  serviceExists.destroy();
};

module.exports = { createService, updateService, destroyService };
