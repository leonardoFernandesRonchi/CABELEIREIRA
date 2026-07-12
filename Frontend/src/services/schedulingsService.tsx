import { apiClient } from "./apiClient";

const create = async ({ dateTime }: { dateTime: string }) => {
  const response = await apiClient.post("/schedulings", {
    dateTime,
  });

  return response;
};

const update = async ({
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

const destroy = async (schedulingId: number) => {
  const response = await apiClient.delete(`/schedulings/${schedulingId}`);

  return response;
};

const fetchMySchedulings = async () => {
  const response = await apiClient.get("/schedulings/my");

  return response;
};

const index = async () => {
  const response = await apiClient.get("/schedulings");

  return response;
};

const fetchSchedulingSuggestions = async (dateTime: string) => {
  const response = await apiClient.post("/schedulings/suggestions", {
    dateTime,
  });
  return response;
};

export default {
  create,
  update,
  destroy,
  fetchMySchedulings,
  fetchSchedulingSuggestions,
  index,
};
