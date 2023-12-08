const [eventKey, ...args] = Deno.args;

// events
// matches
// teams

export const saveEvent = (eventKey: string) => {}

export const saveMatches = (eventKey: string) => {}

export const saveTeams = (eventKey: string) => {}


if (eventKey) {
    if (args.includes('--events')) saveEvent(eventKey);
    if (args.includes('--matches')) saveMatches(eventKey);
    if (args.includes('--teams')) saveTeams(eventKey);
}