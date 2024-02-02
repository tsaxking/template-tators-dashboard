SELECT 
    ChecklistAnswers.id as id,
    ChecklistAnswers.accountId as accountId,
    ChecklistAnswers.questionId as questionId,
    ChecklistAnswers.matchId as matchId,
    ChecklistQuestions.question as question,
    ChecklistQuestions.interval as interval,
    ChecklistQuestions.checklistId as checklistId,
    Checklists.name as checklistName,
    Checklists.eventKey as eventKey,
    Checklists.description as checklistDescription

FROM ChecklistAnswers
INNER JOIN ChecklistQuestions ON ChecklistAnswers.questionId = ChecklistQuestions.id
INNER JOIN Checklists ON ChecklistQuestions.checklistId = Checklists.id
WHERE Checklists.id = :checklistId
    AND Checklists.eventKey = :eventKey;