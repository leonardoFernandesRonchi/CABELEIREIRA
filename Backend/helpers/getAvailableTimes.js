async function getAvailableTimes(date) {
  const startHour = 8;
  const endHour = 18;
  const interval = 30;

  const startDate = new Date(`${date}T00:00:00`);

  const endDate = new Date(`${date}T23:59:59`);

  const schedulings = await Scheduling.findAll({
    where: {
      dateTime: {
        [Op.between]: [startDate, endDate],
      },

      status: {
        [Op.ne]: "CANCELLED",
      },
    },
  });

  const result = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += interval) {
      const time = new Date(date);

      time.setHours(hour, minutes, 0, 0);

      const occupied = schedulings.some(
        (s) => time.getTime() === new Date(s.dateTime).getTime(),
      );

      result.push({
        time,

        available: !occupied,
      });
    }
  }

  return result;
}
module.exports = {
  getAvailableTimes,
};
