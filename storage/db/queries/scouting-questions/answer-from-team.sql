SELECT 
    ScoutingAnswers.id as id,
    ScoutingAnswers.teamNumber as teamNumber,
    ScoutingAnswers.questionId as questionId,
    ScoutingAnswers.answer as answer,
    ScoutingAnswers.date as date,
    ScoutingQuestions.question as question,
    ScoutingQuestions.key as questionKey,
    ScoutingQuestions.description as questionDescription,
    ScoutingQuestions.type as questionType,
    ScoutingQuestionGroups.id as groupId,
    ScoutingQuestionGroups.eventKey as eventKey,
    ScoutingQuestionGroups.section as section,
    ScoutingQuestionGroups.name as groupName


FROM ScoutingAnswers
    INNER JOIN ScoutingQuestions
    ON ScoutingAnswers.questionId = ScoutingQuestions.id
    INNER JOIN ScoutingQuestionGroups
    ON ScoutingQuestions.groupId = ScoutingQuestionGroups.id
WHERE ScoutingAnswers.teamNumber = :teamNumber
    AND ScoutingQuestionGroups.eventKey = :eventKey
    AND ScoutingAnswers.archived = 0;