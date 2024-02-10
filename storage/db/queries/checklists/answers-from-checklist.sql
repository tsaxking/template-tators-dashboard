SELECT 
    ChecklistAnswers.*
    Checklists.name as checklistName,
    Checklists.eventKey as eventKey,
    Checklists.description as checklistDescription

FROM ChecklistAnswers
INNER JOIN ChecklistQuestions ON ChecklistAnswers.questionId = ChecklistQuestions.id
INNER JOIN Checklists ON ChecklistQuestions.checklistId = Checklists.id
WHERE Checklists.id = :checklistId
    AND Checklists.eventKey = :eventKey;