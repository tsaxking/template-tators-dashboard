SELECT
    ScoutingQuestions.*
FROM ScoutingQuestions
INNER JOIN ScoutingQuestionGroups ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
WHERE ScoutingQuestionGroups.eventKey = :eventKey;