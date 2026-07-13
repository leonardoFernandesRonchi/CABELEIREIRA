import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Snackbar, BaseModal } from "@/components";

import {
  schedulingsService,
  schedulingServiceService,
  servicesService,
} from "@/services";

type SchedulingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type Scheduling = {
  id: number;
  userId: number;
  dateTime: string;
  status: SchedulingStatus;

  user?: {
    id: number;
    username: string;
  };

  services?: Service[];
};

const statusLabel = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Finalizado",
  CANCELLED: "Cancelado",
};
const Agenda = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    variant: "error" | "success" | "default";
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [editingScheduling, setEditingScheduling] = useState<Scheduling | null>(
    null,
  );

  const [loading, setLoading] = useState(false);

  const days = useMemo(() => {
    const generatedDays = [];

    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const day = new Date(today);

      day.setDate(today.getDate() + i);

      generatedDays.push(day);
    }

    return generatedDays;
  }, []);

  const hours = useMemo(() => {
    const generatedHours = [];

    for (let hour = 8; hour <= 18; hour++) {
      generatedHours.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    return generatedHours;
  }, []);

  const loadSchedulings = async () => {
    try {
      const response = await schedulingsService.index();

      setSchedulings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await servicesService.index();

      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSchedulings();
    loadServices();
  }, []);

  const getSchedulingBySlot = (day: Date, hour: string) => {
    return schedulings.find((scheduling) => {
      if (scheduling.status === "CANCELLED") {
        return false;
      }

      const schedulingDate = new Date(scheduling.dateTime);

      const sameDay =
        schedulingDate.getDate() === day.getDate() &&
        schedulingDate.getMonth() === day.getMonth() &&
        schedulingDate.getFullYear() === day.getFullYear();

      const schedulingHour =
        schedulingDate.getHours().toString().padStart(2, "0") + ":00";

      return sameDay && schedulingHour === hour;
    });
  };

  const createScheduling = async () => {
    if (!selectedDate || !selectedHour || selectedServices.length === 0) return;

    const [hour, minute] = selectedHour.split(":");

    const dateTime = new Date(selectedDate);

    dateTime.setHours(Number(hour));
    dateTime.setMinutes(Number(minute));
    dateTime.setSeconds(0);
    dateTime.setMilliseconds(0);

    const schedulingResponse = await schedulingsService.create({
      dateTime: dateTime.toISOString(),
    });

    await Promise.all(
      selectedServices.map((service) =>
        schedulingServiceService.create({
          schedulingId: schedulingResponse.data.id,
          serviceId: service.id,
        }),
      ),
    );

    setSnackbar({
      message: "Agendamento criado com sucesso",
      variant: "success",
    });

    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedServices([]);

    loadSchedulings();
  };

  const handleCreateScheduling = async () => {
    if (!selectedDate || !selectedHour) {
      setSnackbar({
        message: "Selecione uma data e horário",
        variant: "error",
      });
      return;
    }

    if (selectedServices.length === 0) {
      setSnackbar({
        message: "Selecione um ou mais serviços",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const [hour, minute] = selectedHour.split(":");

      const dateTime = new Date(selectedDate);

      dateTime.setHours(Number(hour));
      dateTime.setMinutes(Number(minute));
      dateTime.setSeconds(0);
      dateTime.setMilliseconds(0);

      const response = await schedulingsService.fetchSchedulingSuggestions(
        dateTime.toISOString(),
      );

      if (response.data.hasSuggestion) {
        setSuggestion(response.data);
        setShowSuggestionModal(true);
        return;
      }

      await createScheduling();
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data?.message || "Erro ao criar agendamento",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScheduling = async () => {
    if (!editingScheduling) return;

    try {
      setLoading(true);

      await schedulingsService.destroy(editingScheduling.id);

      setSnackbar({
        message: "Agendamento removido com sucesso",
        variant: "success",
      });

      setEditingScheduling(null);
      setSelectedDate(null);
      setSelectedHour(null);

      loadSchedulings();
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data?.message || "Erro ao remover agendamento",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateScheduling = async () => {
    if (!editingScheduling || !selectedDate || !selectedHour) {
      return;
    }

    try {
      setLoading(true);

      const [hour, minute] = selectedHour.split(":");

      const dateTime = new Date(selectedDate);

      dateTime.setHours(Number(hour));

      dateTime.setMinutes(Number(minute));

      await schedulingsService.update({
        schedulingId: editingScheduling.id,
        dateTime: dateTime.toISOString(),
        status: editingScheduling.status,
      });

      alert("Agendamento atualizado com sucesso");

      setEditingScheduling(null);

      setSelectedDate(null);
      setSelectedHour(null);

      loadSchedulings();
    } catch (error) {
      console.error(error);
      setSnackbar({
        message: error?.response?.data?.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <BaseModal
        open={showSuggestionModal}
        setOpen={setShowSuggestionModal}
        title="Sugestão de agendamento"
        text={`Você já possui um agendamento nesta semana (${new Date(
          suggestion?.suggestedDate,
        ).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        })}). Deseja continuar mesmo assim?`}
        confirmButton
        confirmButtonAction={async () => {
          setShowSuggestionModal(false);

          try {
            setLoading(true);

            await createScheduling();
          } finally {
            setLoading(false);
          }
        }}
      />
      <h1 className="text-3xl font-bold mb-8">Agendar horário</h1>
      <h2 className="text-xl font-semibold mb-4">Escolha uma data</h2>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {days.map((day) => {
          const selected = selectedDate?.toDateString() === day.toDateString();

          return (
            <button
              key={day.toISOString()}
              onClick={() => {
                setSelectedDate(day);
                setSelectedHour(null);
              }}
              className={`min-w-[110px] border rounded-lg p-4 transition ${
                selected
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <p className="text-sm">
                {day.toLocaleDateString("pt-BR", {
                  weekday: "short",
                })}
              </p>

              <p className="font-semibold">{day.toLocaleDateString("pt-BR")}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {snackbar && (
          <Snackbar message={snackbar.message} variant={snackbar.variant} />
        )}
      </div>
      {selectedDate && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Escolha um horário
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hours.map((hour) => {
              const scheduling = getSchedulingBySlot(selectedDate, hour);

              const occupied = !!scheduling;

              const isMine = scheduling?.userId === user?.id;

              const selected = selectedHour === hour;

              return (
                <button
                  key={hour}
                  disabled={occupied && !isMine && !isAdmin}
                  title={
                    isAdmin && occupied
                      ? `Agendado para ${scheduling?.user?.username}`
                      : undefined
                  }
                  onClick={() => {
                    if (occupied && (isMine || isAdmin)) {
                      setEditingScheduling(scheduling);
                    }

                    if (!occupied || isMine || isAdmin) {
                      setSelectedHour(hour);
                    }
                  }}
                  className={`rounded-lg p-4 border transition ${
                    occupied
                      ? isMine
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-red-100 border-red-500 text-red-700 cursor-not-allowed"
                      : selected
                        ? "bg-green-500 text-white"
                        : "bg-green-100 hover:bg-green-200"
                  }`}
                >
                  <div className="font-bold">{hour}</div>

                  <div className="text-sm mt-2">
                    {occupied ? (isMine ? null : "Ocupado") : "Disponível"}
                  </div>

                  {occupied && isMine && scheduling?.services?.length > 0 && (
                    <div className="text-xs mt-1 bg-amber-300">
                      {scheduling.services
                        .map((service) => service.name)
                        .join(", ")}
                    </div>
                  )}

                  {occupied && (
                    <div className="text-xs mt-1">
                      {statusLabel[scheduling.status]}
                    </div>
                  )}
                  {isAdmin && occupied && (
                    <div className="text-xs mt-1">
                      {scheduling?.user?.username}
                    </div>
                  )}
                </button>
              );
              ("");
            })}
          </div>
        </>
      )}
      {selectedHour && !editingScheduling && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Escolha um serviço
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const selected = selectedServices.some(
                (item) => item.id === service.id,
              );

              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={`border rounded-lg p-4 text-left transition ${
                    selected
                      ? "border-green-500 bg-green-100"
                      : "hover:border-gray-400"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{service.name}</h3>

                  <p className="text-gray-600 mt-2">{service.description}</p>

                  <p className="font-semibold mt-4">R$ {service.price}</p>
                </button>
              );
            })}
          </div>
        </>
      )}
      {(selectedServices.length > 0 || editingScheduling) && (
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resumo</h2>

          <p>
            <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
          </p>

          <p>
            <strong>Horário:</strong> {selectedHour}
          </p>

          {editingScheduling && (
            <button
              disabled={loading}
              onClick={handleDeleteScheduling}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              {loading ? "Removendo..." : "Excluir agendamento"}
            </button>
          )}
          {editingScheduling && isAdmin && (
            <select
              value={editingScheduling.status}
              onChange={(e) =>
                setEditingScheduling({
                  ...editingScheduling,
                  status: e.target.value as SchedulingStatus,
                })
              }
              className="border rounded p-2 mt-4"
            >
              <option value="PENDING">Pendente</option>

              <option value="CONFIRMED">Confirmado</option>

              <option value="COMPLETED">Finalizado</option>

              <option value="CANCELLED">Cancelado</option>
            </select>
          )}
          {!editingScheduling && selectedServices.length > 0 && (
            <>
              <p>
                <strong>Serviços:</strong>
              </p>

              <ul className="list-disc ml-6">
                {selectedServices.map((service) => (
                  <li key={service.id}>
                    {service.name} - R$ {service.price}
                  </li>
                ))}
              </ul>

              <p className="mt-2">
                <strong>Total:</strong> R${" "}
                {selectedServices
                  .reduce((total, service) => total + Number(service.price), 0)
                  .toFixed(2)}
              </p>
            </>
          )}

          <button
            disabled={loading}
            onClick={() =>
              editingScheduling
                ? handleUpdateScheduling()
                : handleCreateScheduling()
            }
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Salvando..."
              : editingScheduling
                ? "Atualizar horário"
                : "Confirmar agendamento"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Agenda;
