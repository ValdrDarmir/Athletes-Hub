import BaseDBModel from "../../shared/models/BaseDB.model";
import Disciplines from "../../User/models/Disciplines";

interface TrainingEntryModel extends BaseDBModel {
    userId: string                    // set at creation
    discipline: Disciplines           // set at creation
    startDate: Date                   // set at creation
    endDate: Date                     // set at creation
    notes: string | null              // set at creation
    series: number[]                  // set at creation
}

export default TrainingEntryModel
