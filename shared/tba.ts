/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {YearTBAMatch}
 */
export type YearTBAMatch = {
    2024: TBAMatch;
    2023: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                activationBonusAchieved: boolean;
                adjustPoints: number;
                autoBridgeState: string;
                autoChargeStationPoints: number;
                autoChargeStationRobot1: string;
                autoChargeStationRobot2: string;
                autoChargeStationRobot3: string;
                autoCommunity: { B: (string)[]; M: (string)[]; T: (string)[] };
                autoDocked: boolean;
                autoGamePieceCount: number;
                autoGamePiecePoints: number;
                autoMobilityPoints: number;
                autoPoints: number;
                coopGamePieceCount: number;
                coopertitionCriteriaMet: boolean;
                endGameBridgeState: string;
                endGameChargeStationPoints: number;
                endGameChargeStationRobot1: string;
                endGameChargeStationRobot2: string;
                endGameChargeStationRobot3: string;
                endGameParkPoints: number;
                foulCount: number;
                foulPoints: number;
                linkPoints: number;
                links: ({ nodes: (number)[]; row: string })[];
                mobilityRobot1: string;
                mobilityRobot2: string;
                mobilityRobot3: string;
                rp: number;
                sustainabilityBonusAchieved: boolean;
                techFoulCount: number;
                teleopCommunity: {
                    B: (string)[];
                    M: (string)[];
                    T: (string)[];
                };
                teleopGamePieceCount: number;
                teleopGamePiecePoints: number;
                teleopPoints: number;
                totalChargeStationPoints: number;
                totalPoints: number;
            };
            red: {
                activationBonusAchieved: boolean;
                adjustPoints: number;
                autoBridgeState: string;
                autoChargeStationPoints: number;
                autoChargeStationRobot1: string;
                autoChargeStationRobot2: string;
                autoChargeStationRobot3: string;
                autoCommunity: { B: (string)[]; M: (string)[]; T: (string)[] };
                autoDocked: boolean;
                autoGamePieceCount: number;
                autoGamePiecePoints: number;
                autoMobilityPoints: number;
                autoPoints: number;
                coopGamePieceCount: number;
                coopertitionCriteriaMet: boolean;
                endGameBridgeState: string;
                endGameChargeStationPoints: number;
                endGameChargeStationRobot1: string;
                endGameChargeStationRobot2: string;
                endGameChargeStationRobot3: string;
                endGameParkPoints: number;
                foulCount: number;
                foulPoints: number;
                linkPoints: number;
                links: ({ nodes: (number)[]; row: string })[];
                mobilityRobot1: string;
                mobilityRobot2: string;
                mobilityRobot3: string;
                rp: number;
                sustainabilityBonusAchieved: boolean;
                techFoulCount: number;
                teleopCommunity: {
                    B: (string)[];
                    M: (string)[];
                    T: (string)[];
                };
                teleopGamePieceCount: number;
                teleopGamePiecePoints: number;
                teleopPoints: number;
                totalChargeStationPoints: number;
                totalPoints: number;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2022: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoCargoLowerBlue: number;
                autoCargoLowerFar: number;
                autoCargoLowerNear: number;
                autoCargoLowerRed: number;
                autoCargoPoints: number;
                autoCargoTotal: number;
                autoCargoUpperBlue: number;
                autoCargoUpperFar: number;
                autoCargoUpperNear: number;
                autoCargoUpperRed: number;
                autoPoints: number;
                autoTaxiPoints: number;
                cargoBonusRankingPoint: boolean;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                foulCount: number;
                foulPoints: number;
                hangarBonusRankingPoint: boolean;
                matchCargoTotal: number;
                quintetAchieved: boolean;
                rp: number;
                taxiRobot1: string;
                taxiRobot2: string;
                taxiRobot3: string;
                techFoulCount: number;
                teleopCargoLowerBlue: number;
                teleopCargoLowerFar: number;
                teleopCargoLowerNear: number;
                teleopCargoLowerRed: number;
                teleopCargoPoints: number;
                teleopCargoTotal: number;
                teleopCargoUpperBlue: number;
                teleopCargoUpperFar: number;
                teleopCargoUpperNear: number;
                teleopCargoUpperRed: number;
                teleopPoints: number;
                totalPoints: number;
            };
            red: {
                adjustPoints: number;
                autoCargoLowerBlue: number;
                autoCargoLowerFar: number;
                autoCargoLowerNear: number;
                autoCargoLowerRed: number;
                autoCargoPoints: number;
                autoCargoTotal: number;
                autoCargoUpperBlue: number;
                autoCargoUpperFar: number;
                autoCargoUpperNear: number;
                autoCargoUpperRed: number;
                autoPoints: number;
                autoTaxiPoints: number;
                cargoBonusRankingPoint: boolean;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                foulCount: number;
                foulPoints: number;
                hangarBonusRankingPoint: boolean;
                matchCargoTotal: number;
                quintetAchieved: boolean;
                rp: number;
                taxiRobot1: string;
                taxiRobot2: string;
                taxiRobot3: string;
                techFoulCount: number;
                teleopCargoLowerBlue: number;
                teleopCargoLowerFar: number;
                teleopCargoLowerNear: number;
                teleopCargoLowerRed: number;
                teleopCargoPoints: number;
                teleopCargoTotal: number;
                teleopCargoUpperBlue: number;
                teleopCargoUpperFar: number;
                teleopCargoUpperNear: number;
                teleopCargoUpperRed: number;
                teleopPoints: number;
                totalPoints: number;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2021: any;
    2020: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoCellPoints: number;
                autoCellsBottom: number;
                autoCellsInner: number;
                autoCellsOuter: number;
                autoInitLinePoints: number;
                autoPoints: number;
                controlPanelPoints: number;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                endgameRungIsLevel: string;
                foulCount: number;
                foulPoints: number;
                initLineRobot1: string;
                initLineRobot2: string;
                initLineRobot3: string;
                rp: number;
                shieldEnergizedRankingPoint: boolean;
                shieldOperationalRankingPoint: boolean;
                stage1Activated: boolean;
                stage2Activated: boolean;
                stage3Activated: boolean;
                stage3TargetColor: string;
                tba_numRobotsHanging: number;
                tba_shieldEnergizedRankingPointFromFoul: boolean;
                techFoulCount: number;
                teleopCellPoints: number;
                teleopCellsBottom: number;
                teleopCellsInner: number;
                teleopCellsOuter: number;
                teleopPoints: number;
                totalPoints: number;
            };
            red: {
                adjustPoints: number;
                autoCellPoints: number;
                autoCellsBottom: number;
                autoCellsInner: number;
                autoCellsOuter: number;
                autoInitLinePoints: number;
                autoPoints: number;
                controlPanelPoints: number;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                endgameRungIsLevel: string;
                foulCount: number;
                foulPoints: number;
                initLineRobot1: string;
                initLineRobot2: string;
                initLineRobot3: string;
                rp: number;
                shieldEnergizedRankingPoint: boolean;
                shieldOperationalRankingPoint: boolean;
                stage1Activated: boolean;
                stage2Activated: boolean;
                stage3Activated: boolean;
                stage3TargetColor: string;
                tba_numRobotsHanging: number;
                tba_shieldEnergizedRankingPointFromFoul: boolean;
                techFoulCount: number;
                teleopCellPoints: number;
                teleopCellsBottom: number;
                teleopCellsInner: number;
                teleopCellsOuter: number;
                teleopPoints: number;
                totalPoints: number;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2019: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoPoints: number;
                bay1: string;
                bay2: string;
                bay3: string;
                bay4: string;
                bay5: string;
                bay6: string;
                bay7: string;
                bay8: string;
                cargoPoints: number;
                completeRocketRankingPoint: boolean;
                completedRocketFar: boolean;
                completedRocketNear: boolean;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                foulCount: number;
                foulPoints: number;
                habClimbPoints: number;
                habDockingRankingPoint: boolean;
                habLineRobot1: string;
                habLineRobot2: string;
                habLineRobot3: string;
                hatchPanelPoints: number;
                lowLeftRocketFar: string;
                lowLeftRocketNear: string;
                lowRightRocketFar: string;
                lowRightRocketNear: string;
                midLeftRocketFar: string;
                midLeftRocketNear: string;
                midRightRocketFar: string;
                midRightRocketNear: string;
                preMatchBay1: string;
                preMatchBay2: string;
                preMatchBay3: string;
                preMatchBay6: string;
                preMatchBay7: string;
                preMatchBay8: string;
                preMatchLevelRobot1: string;
                preMatchLevelRobot2: string;
                preMatchLevelRobot3: string;
                rp: number;
                sandStormBonusPoints: number;
                techFoulCount: number;
                teleopPoints: number;
                topLeftRocketFar: string;
                topLeftRocketNear: string;
                topRightRocketFar: string;
                topRightRocketNear: string;
                totalPoints: number;
            };
            red: {
                adjustPoints: number;
                autoPoints: number;
                bay1: string;
                bay2: string;
                bay3: string;
                bay4: string;
                bay5: string;
                bay6: string;
                bay7: string;
                bay8: string;
                cargoPoints: number;
                completeRocketRankingPoint: boolean;
                completedRocketFar: boolean;
                completedRocketNear: boolean;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                foulCount: number;
                foulPoints: number;
                habClimbPoints: number;
                habDockingRankingPoint: boolean;
                habLineRobot1: string;
                habLineRobot2: string;
                habLineRobot3: string;
                hatchPanelPoints: number;
                lowLeftRocketFar: string;
                lowLeftRocketNear: string;
                lowRightRocketFar: string;
                lowRightRocketNear: string;
                midLeftRocketFar: string;
                midLeftRocketNear: string;
                midRightRocketFar: string;
                midRightRocketNear: string;
                preMatchBay1: string;
                preMatchBay2: string;
                preMatchBay3: string;
                preMatchBay6: string;
                preMatchBay7: string;
                preMatchBay8: string;
                preMatchLevelRobot1: string;
                preMatchLevelRobot2: string;
                preMatchLevelRobot3: string;
                rp: number;
                sandStormBonusPoints: number;
                techFoulCount: number;
                teleopPoints: number;
                topLeftRocketFar: string;
                topLeftRocketNear: string;
                topRightRocketFar: string;
                topRightRocketNear: string;
                totalPoints: number;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2018: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoOwnershipPoints: number;
                autoPoints: number;
                autoQuestRankingPoint: boolean;
                autoRobot1: string;
                autoRobot2: string;
                autoRobot3: string;
                autoRunPoints: number;
                autoScaleOwnershipSec: number;
                autoSwitchAtZero: boolean;
                autoSwitchOwnershipSec: number;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                faceTheBossRankingPoint: boolean;
                foulCount: number;
                foulPoints: number;
                rp: number;
                tba_gameData: string;
                techFoulCount: number;
                teleopOwnershipPoints: number;
                teleopPoints: number;
                teleopScaleBoostSec: number;
                teleopScaleForceSec: number;
                teleopScaleOwnershipSec: number;
                teleopSwitchBoostSec: number;
                teleopSwitchForceSec: number;
                teleopSwitchOwnershipSec: number;
                totalPoints: number;
                vaultBoostPlayed: number;
                vaultBoostTotal: number;
                vaultForcePlayed: number;
                vaultForceTotal: number;
                vaultLevitatePlayed: number;
                vaultLevitateTotal: number;
                vaultPoints: number;
            };
            red: {
                adjustPoints: number;
                autoOwnershipPoints: number;
                autoPoints: number;
                autoQuestRankingPoint: boolean;
                autoRobot1: string;
                autoRobot2: string;
                autoRobot3: string;
                autoRunPoints: number;
                autoScaleOwnershipSec: number;
                autoSwitchAtZero: boolean;
                autoSwitchOwnershipSec: number;
                endgamePoints: number;
                endgameRobot1: string;
                endgameRobot2: string;
                endgameRobot3: string;
                faceTheBossRankingPoint: boolean;
                foulCount: number;
                foulPoints: number;
                rp: number;
                tba_gameData: string;
                techFoulCount: number;
                teleopOwnershipPoints: number;
                teleopPoints: number;
                teleopScaleBoostSec: number;
                teleopScaleForceSec: number;
                teleopScaleOwnershipSec: number;
                teleopSwitchBoostSec: number;
                teleopSwitchForceSec: number;
                teleopSwitchOwnershipSec: number;
                totalPoints: number;
                vaultBoostPlayed: number;
                vaultBoostTotal: number;
                vaultForcePlayed: number;
                vaultForceTotal: number;
                vaultLevitatePlayed: number;
                vaultLevitateTotal: number;
                vaultPoints: number;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2017: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: number;
        predicted_time: number;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoFuelHigh: number;
                autoFuelLow: number;
                autoFuelPoints: number;
                autoMobilityPoints: number;
                autoPoints: number;
                autoRotorPoints: number;
                foulCount: number;
                foulPoints: number;
                kPaBonusPoints: number;
                kPaRankingPointAchieved: boolean;
                robot1Auto: string;
                robot2Auto: string;
                robot3Auto: string;
                rotor1Auto: boolean;
                rotor1Engaged: boolean;
                rotor2Auto: boolean;
                rotor2Engaged: boolean;
                rotor3Engaged: boolean;
                rotor4Engaged: boolean;
                rotorBonusPoints: number;
                rotorRankingPointAchieved: boolean;
                tba_rpEarned: null;
                techFoulCount: number;
                teleopFuelHigh: number;
                teleopFuelLow: number;
                teleopFuelPoints: number;
                teleopPoints: number;
                teleopRotorPoints: number;
                teleopTakeoffPoints: number;
                totalPoints: number;
                touchpadFar: string;
                touchpadMiddle: string;
                touchpadNear: string;
            };
            red: {
                adjustPoints: number;
                autoFuelHigh: number;
                autoFuelLow: number;
                autoFuelPoints: number;
                autoMobilityPoints: number;
                autoPoints: number;
                autoRotorPoints: number;
                foulCount: number;
                foulPoints: number;
                kPaBonusPoints: number;
                kPaRankingPointAchieved: boolean;
                robot1Auto: string;
                robot2Auto: string;
                robot3Auto: string;
                rotor1Auto: boolean;
                rotor1Engaged: boolean;
                rotor2Auto: boolean;
                rotor2Engaged: boolean;
                rotor3Engaged: boolean;
                rotor4Engaged: boolean;
                rotorBonusPoints: number;
                rotorRankingPointAchieved: boolean;
                tba_rpEarned: null;
                techFoulCount: number;
                teleopFuelHigh: number;
                teleopFuelLow: number;
                teleopFuelPoints: number;
                teleopPoints: number;
                teleopRotorPoints: number;
                teleopTakeoffPoints: number;
                totalPoints: number;
                touchpadFar: string;
                touchpadMiddle: string;
                touchpadNear: string;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2016: {
        actual_time: number;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: null;
        predicted_time: null;
        score_breakdown: {
            blue: {
                adjustPoints: number;
                autoBoulderPoints: number;
                autoBouldersHigh: number;
                autoBouldersLow: number;
                autoCrossingPoints: number;
                autoPoints: number;
                autoReachPoints: number;
                breachPoints: number;
                capturePoints: number;
                foulCount: number;
                foulPoints: number;
                position1crossings: number;
                position2: string;
                position2crossings: number;
                position3: string;
                position3crossings: number;
                position4: string;
                position4crossings: number;
                position5: string;
                position5crossings: number;
                robot1Auto: string;
                robot2Auto: string;
                robot3Auto: string;
                tba_rpEarned: null;
                techFoulCount: number;
                teleopBoulderPoints: number;
                teleopBouldersHigh: number;
                teleopBouldersLow: number;
                teleopChallengePoints: number;
                teleopCrossingPoints: number;
                teleopDefensesBreached: boolean;
                teleopPoints: number;
                teleopScalePoints: number;
                teleopTowerCaptured: boolean;
                totalPoints: number;
                towerEndStrength: number;
                towerFaceA: string;
                towerFaceB: string;
                towerFaceC: string;
            };
            red: {
                adjustPoints: number;
                autoBoulderPoints: number;
                autoBouldersHigh: number;
                autoBouldersLow: number;
                autoCrossingPoints: number;
                autoPoints: number;
                autoReachPoints: number;
                breachPoints: number;
                capturePoints: number;
                foulCount: number;
                foulPoints: number;
                position1crossings: number;
                position2: string;
                position2crossings: number;
                position3: string;
                position3crossings: number;
                position4: string;
                position4crossings: number;
                position5: string;
                position5crossings: number;
                robot1Auto: string;
                robot2Auto: string;
                robot3Auto: string;
                tba_rpEarned: null;
                techFoulCount: number;
                teleopBoulderPoints: number;
                teleopBouldersHigh: number;
                teleopBouldersLow: number;
                teleopChallengePoints: number;
                teleopCrossingPoints: number;
                teleopDefensesBreached: boolean;
                teleopPoints: number;
                teleopScalePoints: number;
                teleopTowerCaptured: boolean;
                totalPoints: number;
                towerEndStrength: number;
                towerFaceA: string;
                towerFaceB: string;
                towerFaceC: string;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2015: {
        actual_time: null;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: null;
        predicted_time: null;
        score_breakdown: {
            blue: {
                adjust_points: number;
                auto_points: number;
                container_count_level1: number;
                container_count_level2: number;
                container_count_level3: number;
                container_count_level4: number;
                container_count_level5: number;
                container_count_level6: number;
                container_points: number;
                container_set: boolean;
                foul_count: number;
                foul_points: number;
                litter_count_container: number;
                litter_count_landfill: number;
                litter_count_unprocessed: number;
                litter_points: number;
                robot_set: boolean;
                teleop_points: number;
                total_points: number;
                tote_count_far: number;
                tote_count_near: number;
                tote_points: number;
                tote_set: boolean;
                tote_stack: boolean;
            };
            coopertition: string;
            coopertition_points: number;
            red: {
                adjust_points: number;
                auto_points: number;
                container_count_level1: number;
                container_count_level2: number;
                container_count_level3: number;
                container_count_level4: number;
                container_count_level5: number;
                container_count_level6: number;
                container_points: number;
                container_set: boolean;
                foul_count: number;
                foul_points: number;
                litter_count_container: number;
                litter_count_landfill: number;
                litter_count_unprocessed: number;
                litter_points: number;
                robot_set: boolean;
                teleop_points: number;
                total_points: number;
                tote_count_far: number;
                tote_count_near: number;
                tote_points: number;
                tote_set: boolean;
                tote_stack: boolean;
            };
        };
        set_number: number;
        time: number;
        videos: ({ key: string; type: string })[];
        winning_alliance: string;
    };
    2014: {
        actual_time: null;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: null;
        predicted_time: null;
        score_breakdown: null;
        set_number: number;
        time: number;
        videos: (undefined)[];
        winning_alliance: string;
    };
    2013: {
        actual_time: null;
        alliances: {
            blue: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
            red: {
                dq_team_keys: (undefined)[];
                score: number;
                surrogate_team_keys: (undefined)[];
                team_keys: (string)[];
            };
        };
        comp_level: string;
        event_key: string;
        key: string;
        match_number: number;
        post_result_time: null;
        predicted_time: null;
        score_breakdown: null;
        set_number: number;
        time: null;
        videos: (undefined)[];
        winning_alliance: string;
    };
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBAEvent}
 */
export type TBAEvent = {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBAEventSimple}
 */
export type TBAEventSimple = {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBAMatch}
 */
export type TBAMatch = {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
        red: {
            score: number;
            team_keys: string[];
        };
        blue: {
            score: number;
            team_keys: string[];
        };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    actual_time: number;
    predicted_time: number;
    post_result_time: number;
    score_breakdown: {
        red: any;
        blue: any;
    };
    videos: {
        key: string;
        type: string;
    }[];
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBAMatchSimple}
 */
export type TBAMatchSimple = {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
        red: {
            score: number;
            team_keys: string[];
        };
        blue: {
            score: number;
            team_keys: string[];
        };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    actual_time: number;
    predicted_time: number;
    post_result_time: number;
    score_breakdown: {
        red: any;
        blue: any;
    };
    videos: {
        key: string;
        type: string;
    }[];
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBATeam}
 */
export type TBATeam = {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
    address: string;
    postal_code: string;
    gmaps_place_id: string;
    gmaps_url: string;
    lat: number;
    lng: number;
    location_name: string;
    website: string;
    rookie_year: number;
    motto: string;
    home_championship: {
        key: string;
        year: number;
        event_code: string;
        division_keys: string[];
    };
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:40 AM
 *
 * @export
 * @typedef {TBATeamSimple}
 */
export type TBATeamSimple = {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
    address: string;
    postal_code: string;
    gmaps_place_id: string;
    gmaps_url: string;
    lat: number;
    lng: number;
    location_name: string;
    website: string;
    rookie_year: number;
    motto: string;
    home_championship: {
        key: string;
        year: number;
        event_code: string;
        division_keys: string[];
    };
};
