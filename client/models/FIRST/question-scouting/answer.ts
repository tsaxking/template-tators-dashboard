import { ScoutingAnswer } from "../../../../shared/db-types-extended";
import { Cache } from "../../cache";





export class Answer extends Cache {




    readonly id: string;
    readonly questionId: string;
    $answer: string;
    $teamNumber: number;
    $dateAdded: string;
    $accountId: string;


    constructor(data: ScoutingAnswer) {
        super();

        this.id = data.id;
        this.questionId = data.questionId;
        this.$answer = data.answer;
        this.$teamNumber = data.teamNumber;
        this.$dateAdded = data.dateAdded;
        this.$accountId = data.accountId;
    }
}