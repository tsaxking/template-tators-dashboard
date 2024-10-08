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
    | 'account:settings-set'
    | 'account:unverified'
    | 'account:update-email'
    | 'account:update-first-name'
    | 'account:update-last-name'
    | 'account:update-phone-number'
    | 'account:update-picture'
    | 'account:update-username'
    | 'account:username-changed'
    | 'account:verified'
    | 'custom-match:created'
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
    | 'permissions:added'
    | 'permissions:removed'
    | 'pit-scouting:delete'
    | 'pit-scouting:new'
    | 'roles:added-permission'
    | 'roles:added'
    | 'roles:deleted'
    | 'roles:new'
    | 'roles:removed-permission'
    | 'roles:removed'
    | 'roles:updated'
    | 'scouting-question:answer-deleted'
    | 'scouting-question:group-deleted'
    | 'scouting-question:group-updated'
    | 'scouting-question:new-answer'
    | 'scouting-question:new-group'
    | 'scouting-question:new-question'
    | 'scouting-question:new-section'
    | 'scouting-question:question-deleted'
    | 'scouting-question:question-updated'
    | 'scouting-question:questions-copied'
    | 'scouting-question:section-deleted'
    | 'scouting-question:update-answer'
    | 'scouting-question:update-section'
    | 'scouting-question:updated-answer'
    | 'skills:added'
    | 'skills:removed'
    | 'strategy:delete'
    | 'strategy:new'
    | 'strategy:updated'
    | 'team-comment:new'
    | 'teams:pictures-uploaded'
    | 'test:success'
    | 'test:test'
    | 'whiteboard:created'
    | 'whiteboard:deleted'
    | 'whiteboard:update';
