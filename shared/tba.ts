export type TBAEvent = {
    key: string,
    name: string,
    event_code: string,
    event_type: number,
    district: {
        abbreviation: string,
        display_name: string,
        key: string,
        year: number
    },
    city: string,
    state_prov: string,
    country: string,
    start_date: string,
    end_date: string,
    year: number
};

export type TBAEventSimple = {
    key: string,
    name: string,
    event_code: string,
    event_type: number,
    district: {
        abbreviation: string,
        display_name: string,
        key: string,
        year: number
    },
    city: string,
    state_prov: string,
    country: string,
    start_date: string,
    end_date: string,
    year: number
};

export type TBAMatch = {
    key: string,
    comp_level: string,
    set_number: number,
    match_number: number,
    alliances: {
        red: {
            score: number,
            team_keys: string[]
        },
        blue: {
            score: number,
            team_keys: string[]
        }
    },
    winning_alliance: string,
    event_key: string,
    time: number,
    actual_time: number,
    predicted_time: number,
    post_result_time: number,
    score_breakdown: {
        red: {},
        blue: {}
    },
    videos: {
        key: string,
        type: string
    }[]
};

export type TBAMatchSimple = {
    key: string,
    comp_level: string,
    set_number: number,
    match_number: number,
    alliances: {
        red: {
            score: number,
            team_keys: string[]
        },
        blue: {
            score: number,
            team_keys: string[]
        }
    },
    winning_alliance: string,
    event_key: string,
    time: number,
    actual_time: number,
    predicted_time: number,
    post_result_time: number,
    score_breakdown: {
        red: {},
        blue: {}
    },
    videos: {
        key: string,
        type: string
    }[]
};

export type TBATeam = {
    key: string,
    team_number: number,
    nickname: string,
    name: string,
    city: string,
    state_prov: string,
    country: string,
    address: string,
    postal_code: string,
    gmaps_place_id: string,
    gmaps_url: string,
    lat: number,
    lng: number,
    location_name: string,
    website: string,
    rookie_year: number,
    motto: string,
    home_championship: {
        key: string,
        year: number,
        event_code: string,
        division_keys: string[]
    }
};

export type TBATeamSimple = {
    key: string,
    team_number: number,
    nickname: string,
    name: string,
    city: string,
    state_prov: string,
    country: string,
    address: string,
    postal_code: string,
    gmaps_place_id: string,
    gmaps_url: string,
    lat: number,
    lng: number,
    location_name: string,
    website: string,
    rookie_year: number,
    motto: string,
    home_championship: {
        key: string,
        year: number,
        event_code: string,
        division_keys: string[]
    }
};