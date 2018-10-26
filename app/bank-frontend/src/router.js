import React from 'react';
import { connect } from 'react-redux';
import ParsableRoute from 'route-parser';
import { routes } from './routes';

import { selectOperation } from './state/actions/operations';

let routingService;

/* Routing service */

class RoutingService {
  constructor(reduxStore) {
    this.reduxStore = reduxStore;

    window.onpopstate = (event) => {
      this.handleRoute(window.location.pathname + window.location.search);
    }

    this.handleRoute(window.location.pathname + window.location.search);
  }

  applyRoute(id, params) {
    this.reduxStore.dispatch( selectOperation(id, params) );
  }

  handleRoute(urlPath) {
    const routeToUse = routes.map(route => {
            return {
              ...route,
              parsableHref: new ParsableRoute(route.href)
            }
          })
          .find(route => route.parsableHref.match(urlPath)),
          params = routeToUse ? routeToUse.parsableHref.match(urlPath) : {};

          // @TODO: check params extracting

    return this.applyRoute(routeToUse ? routeToUse.id : null, params);
  }

  goToRoute(id, params) {
    const route = routes.find(route => route.id === id),
          parsableRoute = new ParsableRoute(route.href);

    window.history.pushState(this.state, '', parsableRoute.reverse(params));
    this.applyRoute(route.id, params);
  }
}


/* React components, that connecting Application with RoutingService */

export const Router = ({children, store, ...props}) => {
  routingService = new RoutingService(store);

  return children;
};

export const NavLinkComponent = ({to, params, children, activeClassName,
  className, currentOperation, ...props}) => {

  let finalClassName = className;

  if (activeClassName && currentOperation === to) {
    finalClassName = className + ' ' + activeClassName;
  }

  return (<button onClick={ e => routingService.goToRoute(to, params) } className={finalClassName}>
    {children}
  </button>)
}

const RouteComponent = ({id, currentOperation, children, ...props}) =>
  ( currentOperation === id ) && children

const mapStateToProps = state => ({
  currentOperation: state.operations.operation
});

export const Route = connect(mapStateToProps)(RouteComponent);
export const NavLink = connect(mapStateToProps)(NavLinkComponent);
