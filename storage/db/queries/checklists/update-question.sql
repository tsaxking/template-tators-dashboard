UPDATE ChecklistQuestions
SET
    checklistId = :checklistId,
    question = :question,
    interval = :interval
WHERE id = :id;