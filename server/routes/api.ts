import { Route } from '../structure/app/app';

export const router = new Route();

import { router as events } from './api/events';
router.route('/events', events);

import { router as matches } from './api/matches';
router.route('/matches', matches);

import { router as teams } from './api/teams';
router.route('/teams', teams);

import { router as strategy } from './api/strategy';
router.route('/strategy', strategy);

import { router as discord } from './api/discord';
router.route('/discord', discord);

import { router as eventServer } from './api/event-server';
router.route('/event-server', eventServer);

import { router as webhook } from './api/webhooks';
router.route('/webhooks', webhook);

import { router as scoutingQuestions } from './api/scouting-questions';
router.route('/scouting-questions', scoutingQuestions);

import { router as tba } from './api/tba';
router.route('/tba', tba);

import { router as matchScouting } from './api/match-scouting';
router.route('/match-scouting', matchScouting);

import { router as teamComments } from './api/team-comments';
router.route('/team-comments', teamComments);

import { router as potato } from './api/potato';
router.route('/potato', potato);