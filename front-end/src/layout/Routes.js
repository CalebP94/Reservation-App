import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservation/CreateReservation";
import SeatReservation from "../reservation/SeatReservation";
import CreateTable from "../table/CreateTable";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import SearchReservation from "../reservation/SearchReservation";
import EditReservation from "../reservation/EditReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation/>
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation/>
      </Route>
      <Route exact={true} path="/search">
        <SearchReservation/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
