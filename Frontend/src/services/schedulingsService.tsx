import { apiClient } from "./apiClient";

const createScheduling = async ({ dateTime }: { dateTime: string }) => {
  const response = await apiClient.post("/schedulings", {
    dateTime,
  });

  return response;
};

const updateScheduling = async ({
  schedulingId,
  dateTime,
  status,
}: {
  schedulingId: number;
  dateTime: string;
  status: string;
}) => {
  const response = await apiClient.put(`/schedulings/${schedulingId}`, {
    dateTime,
    status,
  });

  return response;
};

const deleteScheduling = async (schedulingId: number) => {
  const response = await apiClient.delete(`/schedulings/${schedulingId}`);

  return response;
};

const fetchMySchedulings = async () => {
  const response = await apiClient.get("/schedulings/my");

  return response;
};

const fetchSchedulings = async () => {
  const response = await apiClient.get("/schedulings");

  return response;
};

export default {
  createScheduling,
  updateScheduling,
  deleteScheduling,
  fetchMySchedulings,
  fetchSchedulings,
};
