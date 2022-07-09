const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");



async function list(req, res) {
    const list = await service.list();
    res.status(200).json({ data: list });
}

async function reservationExists(req, res, next){
  const found = await reservationsService.read(req.body.data.reservation_id)
  if(found){
    res.locals.reservation = found;
    return next();
  }
  next({status:404, message:`Reservation not found ${req.body.data.reservation_id}!`});
}


async function tableExists(req, res, next){
  const tableId = req.params.table_id;
  const found = await service.read(tableId);
  if(found){
    res.locals.table = found;
    return next();
  }
  return next({status: 404, message: `table not found with id:${req.params.table_id}`});
}

async function read(req, res, next){
  res.status(200).json({data: res.locals.table});
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({
        status: 400,
        message: `New table must include a ${propertyName}.`,
      });
    };
}

function tableNameIsValid(req, res, next) {
  const { data: { table_name } = {} } = req.body;

  if (table_name.length > 1) {
    return next();
  }

  return next({
    status: 400,
    message: `table_name must be at least 2 characters.`,
  });
}

function tableCapacityIsValid(req, res, next) {
  const { data: { capacity } = {} } = req.body;
  
  if (typeof capacity === "number" && capacity > 0) {
    return next();
  }
  return next({ status: 400, message: `table capacity must be at least 1.` });
}

async function create(req, res, next) {
  const { data: { table_name, capacity, reservation_id = null } = {} } = req.body;
  const newTable = {
    table_name,
    capacity,
    reservation_id,
    status: reservation_id ? "occupied" : "Free"
    
  };
  
  const response = await service.create(newTable)
  res.status(201).json({ data: response });
}

function tableHasCapacity(req, res, next){
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if(table.capacity < reservation.people){
    return next({status:400, message: `Table does not have capacity for this reservation.`});
  }
  
  return next();
}

function tableIsNotOccupied(req, res, next){
  const table = res.locals.table;
  
  if(table.status == "Free"){
    
    return next();
  }
  
  return next({status:400, message:`Table is occupied by another party`});
}

function tableIsOccupied(req, res, next){
  if(res.locals.table.status == "occupied"){
    
    return next();
  }
  return next({status:400, message: `Table is not occupied`});
}

function reservationIsNotAlreadySeated(req, res, next){
  const reservation = res.locals.reservation;
  if(reservation.status == "seated") return next({status:400, message: `Reservation is already seated`});
  next();
}

async function seat(req, res, next){
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  const seated = await service.seatTable(table.table_id, reservation.reservation_id);
  res.status(200).json({data:{seated}});
}

async function unseat(req, res, next){
  const {table_id} = req.params;
   const table = res.locals.table
   
  const yep = await service.unseatTable(table_id, table.reservation_id);
  res.status(200).json({data: {message: `Seat freed`}});
}

module.exports = {
  list,

  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    tableNameIsValid,
    tableCapacityIsValid,
    create,
  ],

  read:[
    tableExists,
    read,
  ],

  seat: [
    bodyDataHas("reservation_id"),
    
    asyncErrorBoundary(reservationExists),
  
    asyncErrorBoundary(tableExists),
    
    tableHasCapacity,
    
    tableIsNotOccupied,
    
    reservationIsNotAlreadySeated,
    
    asyncErrorBoundary(seat),
  ],
  unseat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsOccupied),
    asyncErrorBoundary(unseat)
  ]
};
