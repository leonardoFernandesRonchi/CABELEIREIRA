import { apiClient } from "./apiClient";

const create = async ({
  schedulingId,
  serviceId,
}: {
  schedulingId: number;
  serviceId: number;
}) => {
  const response = await apiClient.post("/schedulingServices", {
    schedulingId,
    serviceId,
  });

  return response;
};

const destroy = async (schedulingServiceId: number) => {
  const response = await apiClient.delete(
    `/schedulingServices/${schedulingServiceId}`,
  );

  return response;
};

export default {
  create,
  destroy,
};
