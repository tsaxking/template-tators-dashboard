export type SocketEvent = 
	| 'disconnect'
	| 'account:created'
	| 'account:logged-in'
	| 'account:logged-out'
	| 'account:password-reset-success'
	| 'account:picture-updated'
	| 'account:removed'
	| 'account:role-added'
	| 'account:role-removed'
	| 'account:unverified'
	| 'account:update-email'
	| 'account:update-first-name'
	| 'account:update-last-name'
	| 'account:update-phone-number'
	| 'account:update-picture'
	| 'account:update-username'
	| 'account:username-changed'
	| 'account:verified'
	| 'discord:account-linked'
	| 'event:update-properties'
	| 'match-comments:delete'
	| 'match-comments:new'
	| 'match-scouting:delete'
	| 'match-scouting:new'
	| 'member:accepted'
	| 'member:add-skill'
	| 'member:rejected'
	| 'member:remove-skill'
	| 'member:request'
	| 'member:revoked'
	| 'member:status-updated'
	| 'member:update-bio'
	| 'member:update-resume'
	| 'member:update-title'
	| 'page:open'
	| 'pit-scouting:delete'
	| 'pit-scouting:new'
	| 'roles:added'
	| 'roles:removed'
	| 'scouting-question:new-answer'
	| 'scouting-question:new-group'
	| 'scouting-question:new-question'
	| 'scouting-question:new-section'
	| 'scouting-question:update-section'
	| 'scouting-question:updated-answer'
	| 'skills:added'
	| 'skills:removed'
	| 'strategy:delete'
	| 'strategy:new'
	| 'test:success'
	| 'test:test'
	| 'whiteboard:created'
	| 'whiteboard:deleted'
	| 'whiteboard:update'
;
