SELECT
    ScoutingQuestions.*,
    ScoutingQuestionGroups.eventKey
FROM ScoutingQuestionGroups
INNER JOIN ScoutingQuestions ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
WHERE ScoutingQuestionGroups.eventKey = :eventKey
    AND ScoutingQuestions.archived = 0;