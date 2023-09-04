import BaseDBModel from "../../shared/models/BaseDB.model";
import Disciplines from "./Disciplines";

interface ClubDisciplineModel extends BaseDBModel {
    userId: string
    club: string
    discipline: Disciplines
}

export default ClubDisciplineModel;
