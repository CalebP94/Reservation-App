const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const list = await service.list(date);
    res.status(200).json({ data: list });
  }
  else if(mobile_number){
    const list = await service.list(null, mobile_number)
    res.status(200).json({data: list});
  }
  else{
    const list = await service.list();
    res.status(200).json({data: list});
  }
}

async function reservationExists(req, res, next){
  const reservationId = req.params.reservation_id;
  const found = await service.read(reservationId);
  if(found){
    res.locals.reservation = found;
    return next();
  }
  next({status: 404, message: `Reservation not found with id:${reservationId}`});
}

function read(req, res, next){
  res.status(200).json({data: res.locals.reservation});
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `New reservation must include a ${propertyName}.`,
    });
  };
}

function dateTimeIsValid(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  
  
  const dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;
  const timeFormat = /\d\d:\d\d/;

  if (dateFormat.test(reservation_date) && timeFormat.test(reservation_time)) {
    return next();
  }
  return next({
    status: 400,
    message: `reservation_date / reservation_time is not correct.`,
  });
}

function dateIsFuture(req, res, next){
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const now = new Date();
  const resDate = new Date(`${reservation_date} ${reservation_time}`);
  if (resDate < now) {

    return next({
      status: 400,
      message: `reservation_date and reservation_time must be in the future`,
    });

  }else{
    return next();
  }
}

function dateisWorkingDay(req, res, next){
  const { data: { reservation_date} = {} } = req.body;
  const date = new Date(reservation_date);

      if (date.getDay() == 1) {
        return next({
          status: 400,
          message: `reservation_date is on a closed day (tuesday).`,
        });
      }else{
        return next();
      }
}

function timeIsDuringWorkingHours(req, res, next){
  const { data: { reservation_time} = {} } = req.body;

  if(reservation_time > "10:30" && reservation_time < "21:20"){
    return next();
  }

  return next({
    status: 400,
    message: `reservation_date or reservation_time is not during working hours.`,
  });
}

function peopleIsValid(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (typeof people === "number") {
    return next();
  }

  return next({ status: 400, message: `people must be a number!` });
}

function statusIsValid(req, res, next){
  const {data: {status} = {}} = req.body;
  if(status){
    if(status != "booked"){
      return next({status:400, message: `${status} is not a valid status for reserving`});
    }
  }
  // if(Object.keys(reservation).includes("status")){
  //   if(reservation.status != "booked")
  // }
  next();
}

function statusExists(req, res, next){
  const validStatuses = ["finished", "booked", "seated", "cancelled"];
  const reservation = res.locals.reservation;

  if(validStatuses.includes(req.body.data.status)) return next()

  next({status:400, message: `unknown status: ${reservation.status}`});
}

function statusIsNotFinished(req, res, next){
  const reservation = res.locals.reservation;

  if(reservation.status == "finished") return next({status:400, message:`A finished reservation cannot be updated`});
  next();
}

async function create(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
    } = {},
  } = req.body;

  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
  };

  const resp = await service.create(newReservation);
  res.status(201).json({ data: resp });
}

async function setStatus(req, res, next){
  const reservation = await service.setStatus(req.body.data.status, req.params.reservation_id);
  res.status(200).json({data: reservation})
}
async function update(req ,res, next){
  const updatedReservervation = {
    ...req.body.data
  }
  await service.update(updatedReservervation, res.locals.reservation.reservation_id);
  res.status(200).json({data: updatedReservervation});
}

module.exports = {
  list,
  reservationExists,
  bodyDataHas,

  read: [
    reservationExists,
    read
  ],
  
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("people"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    asyncErrorBoundary(peopleIsValid),
    asyncErrorBoundary(dateTimeIsValid),
    asyncErrorBoundary(dateIsFuture),
    asyncErrorBoundary(dateisWorkingDay),
    asyncErrorBoundary(timeIsDuringWorkingHours),
    statusIsValid,
    asyncErrorBoundary(create),
  ],

  setStatus: [
    bodyDataHas("status"),
    asyncErrorBoundary(reservationExists),
    statusExists,
    statusIsNotFinished,
    asyncErrorBoundary(setStatus)
  ],

  update: [
    asyncErrorBoundary(reservationExists),
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    peopleIsValid,
    dateTimeIsValid,
    dateIsFuture,
    dateisWorkingDay,
    timeIsDuringWorkingHours,
    asyncErrorBoundary(update),
  ]
};
