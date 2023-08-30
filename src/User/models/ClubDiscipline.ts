import BaseDBModel from "../../shared/models/BaseDBModel";
import Disciplines from "./Disciplines";

interface ClubDiscipline extends BaseDBModel {
    userId: string
    club: string
    discipline: Disciplines
}

export default ClubDiscipline;
