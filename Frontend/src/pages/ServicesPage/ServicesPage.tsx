import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Plus, Trash2 } from "react-feather";

import { BaseModal } from "@/components";
import { servicesService } from "@/services";
import { useAuth } from "@/hooks/useAuth";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type FormData = {
  serviceId?: number;
  name: string;
  description: string;
  price: number;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const { register, handleSubmit, reset } = useForm<FormData>();

  const loadServices = async () => {
    try {
      const response = await servicesService.getAllService();
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreate = async (data: FormData) => {
    try {
      await servicesService.createService(data);

      setCreateModal(false);
      reset();

      loadServices();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenUpdate = (service: Service) => {
    setSelectedService(service);

    reset({
      name: service.name,
      description: service.description,
      price: service.price,
    });

    setUpdateModal(true);
  };

  const handleUpdate = async (data: FormData) => {
    if (!selectedService) return;

    try {
      await servicesService.updateService({
        ...data,
        serviceId: selectedService.id,
      });

      setUpdateModal(false);
      setSelectedService(null);
      reset();

      loadServices();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await servicesService.deleteService(serviceToDelete.id);

      setDeleteModal(false);
      setServiceToDelete(null);

      loadServices();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Serviços</h1>

          {isAdmin && (
            <button
              onClick={() => {
                reset({
                  name: "",
                  description: "",
                  price: 0,
                });

                setCreateModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center"
            >
              <Plus size={18} />
              Criar Serviço
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold">{service.name}</h2>

              <p className="text-gray-600 mt-2">{service.description}</p>

              <p className="mt-3">
                <strong>Preço:</strong> R$ {service.price}
              </p>

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleOpenUpdate(service)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded flex justify-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>

                  <button
                    onClick={() => handleOpenDelete(service)}
                    className="flex-1 bg-red-500 text-white py-2 rounded flex justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de criação */}
      <BaseModal
        open={createModal}
        setOpen={setCreateModal}
        title="Criar Serviço"
        text="Preencha os dados do serviço."
        confirmButton
        form="create-service-form"
      >
        <form
          id="create-service-form"
          onSubmit={handleSubmit(handleCreate)}
          className="space-y-4"
        >
          <input
            {...register("name")}
            placeholder="Nome"
            className="w-full border p-2 rounded"
          />

          <textarea
            {...register("description")}
            placeholder="Descrição"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
            })}
            placeholder="Preço"
            className="w-full border p-2 rounded"
          />
        </form>
      </BaseModal>

      {/* Modal de edição */}
      <BaseModal
        open={updateModal}
        setOpen={setUpdateModal}
        title="Editar Serviço"
        text="Atualize os dados do serviço."
        confirmButton
        form="update-service-form"
      >
        <form
          id="update-service-form"
          onSubmit={handleSubmit(handleUpdate)}
          className="space-y-4"
        >
          <input
            {...register("name")}
            placeholder="Nome"
            className="w-full border p-2 rounded"
          />

          <textarea
            {...register("description")}
            placeholder="Descrição"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
            })}
            placeholder="Preço"
            className="w-full border p-2 rounded"
          />
        </form>
      </BaseModal>

      {/* Modal de exclusão */}
      <BaseModal
        open={deleteModal}
        setOpen={setDeleteModal}
        title="Excluir Serviço"
        text={`Tem certeza que deseja excluir o serviço "${serviceToDelete?.name}"?`}
        confirmButton
        confirmButtonAction={handleDelete}
      >
        <div className="text-sm text-gray-500">
          Esta ação não poderá ser desfeita.
        </div>
      </BaseModal>
    </>
  );
};

export default ServicesPage;
