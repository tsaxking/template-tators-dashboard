SELECT 
    Checklists.id as checklistId,
    Checklists.name as checklistName,
    Checklists.eventKey as eventKey,
    Checklists.description as checklistDescription,
    ChecklistQuestions.id as questionId,
    ChecklistQuestions.question as question,
    ChecklistQuestions.interval as interval
FROM ChecklistQuestions
INNER JOIN Checklists ON ChecklistQuestions.checklistId = Checklists.id
INNER JOIN ChecklistAssignments ON ChecklistAssignments.checklistId = Checklists.id
WHERE ChecklistAssignments.accountId = :accountId AND Checklists.eventKey = :eventKey
    AND ChecklistQuestions.archived = 0
    AND Checklists.archived = 0
    AND ChecklistAssignments.archived = 0;