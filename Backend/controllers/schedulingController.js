const {
  createScheduling,
  updateScheduling,
  destroyScheduling,
  getMySchedulings,
  getAllSchedulings,
  findSchedulingSuggestions,
} = require("../services/schedulingService");

const create = async (req, res, next) => {
  try {
    const { dateTime } = req.body;
    const { loggedUser } = req;

    const scheduling = await createScheduling({
      userId: loggedUser.id,
      dateTime,
    });

    res.status(201).json(scheduling);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { schedulingId } = req.params;
    const { dateTime, totalDurationMinutes, status } = req.body;
    const { loggedUser } = req;

    const scheduling = await updateScheduling({
      schedulingId,
      userId: loggedUser.id,
      role: loggedUser.role,
      dateTime,
      status,
    });

    res.status(200).json(scheduling);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { schedulingId } = req.params;
    const { loggedUser } = req;

    const result = await destroyScheduling(
      schedulingId,
      loggedUser.id,
      loggedUser.role,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMy = async (req, res, next) => {
  try {
    const schedulings = await getMySchedulings(req.loggedUser.id);

    res.status(200).json(schedulings);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const schedulings = await getAllSchedulings();

    res.status(200).json(schedulings);
  } catch (error) {
    next(error);
  }
};

const getSuggestionsForScheduling = async (req, res, next) => {
  try {
    const { dateTime } = req.body;
    const { loggedUser } = req;

    const suggestions = await findSchedulingSuggestions(
      loggedUser.id,
      dateTime,
    );

    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  update,
  destroy,
  getMy,
  getAll,
  getSuggestionsForScheduling,
};
