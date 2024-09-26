SELECT 
    ScoutingAnswers.*
FROM ScoutingAnswers
INNER JOIN ScoutingQuestions ON ScoutingQuestions.id = ScoutingAnswers.questionId
INNER JOIN ScoutingQuestionGroups ON ScoutingQuestionGroups.id = ScoutingQuestions.groupId
WHERE ScoutingQuestionGroups.eventKey = :eventKey
    AND ScoutingAnswers.archived = false;