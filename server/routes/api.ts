import { Route } from '../structure/app/app.ts';

export const router = new Route();

import { router as events } from './api/events.ts';
router.route('/events', events);

import { router as matches } from './api/matches.ts';
router.route('/matches', matches);

import { router as teams } from './api/teams.ts';
router.route('/teams', teams);

import { router as strategy } from './api/strategy.ts';
router.route('/strategy', strategy);

import { router as discord } from './api/discord.ts';
router.route('/discord', discord);

import { router as eventServer } from './api/event-server.ts';
router.route('/event-server', eventServer);

import { router as webhook } from './api/webhooks.ts';
router.route('/webhook', webhook);