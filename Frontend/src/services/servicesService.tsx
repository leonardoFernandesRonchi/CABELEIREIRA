import { apiClient } from "./apiClient";

type ServiceData = {
  name: string;
  description?: string;
  price: number;
};

const create = async ({ name, description, price }: ServiceData) => {
  const response = await apiClient.post("/services", {
    name,
    description,
    price,
  });

  return response;
};

const update = async ({
  serviceId,
  name,
  description,
  price,
}: ServiceData & {
  serviceId: number;
}) => {
  const response = await apiClient.put(`/services/${serviceId}`, {
    name,
    description,
    price,
  });

  return response;
};

const destroy = async (serviceId: number) => {
  const response = await apiClient.delete(`/services/${serviceId}`);

  return response;
};

const index = async () => {
  const response = await apiClient.get("/services");
  return response;
};

export default {
  create,
  update,
  destroy,
  index,
};
