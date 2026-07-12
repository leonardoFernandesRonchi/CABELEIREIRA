import { apiClient } from "./apiClient";

const createSchedulingService = async ({
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

const deleteSchedulingService = async (schedulingServiceId: number) => {
  const response = await apiClient.delete(
    `/schedulingServices/${schedulingServiceId}`,
  );

  return response;
};

export default {
  createSchedulingService,
  deleteSchedulingService,
};
