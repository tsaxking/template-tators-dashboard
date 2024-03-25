SELECT ScoutingQuestions.*,
    ScoutingQuestionGroups.eventKey
FROM ScoutingQuestionGroups
INNER JOIN ScoutingQuestions
    ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
WHERE ScoutingQuestions.groupId = :groupId;