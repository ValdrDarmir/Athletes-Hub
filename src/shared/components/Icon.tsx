import React, {FunctionComponent, SVGProps} from 'react';
import {ReactComponent as BarChart} from "../assets/icons/bar-chart.svg";
import {ReactComponent as Book} from "../assets/icons/book.svg";
import {ReactComponent as Person} from "../assets/icons/person.svg";

const IconCodes = [
    "view_list",
    "add_circle",
    "logout",
    "person",
    "info",
    "trophy",
    "date_range",
    "delete",
    "barChart",
    "book",
    "person",
    "home",
] as const;

const AssetIcons: Partial<Record<typeof IconCodes[number], FunctionComponent<SVGProps<any>>>> = {
    barChart: BarChart,
    book: Book,
    person: Person,
}

interface Props {
    code: typeof IconCodes[number]
    size?: number
}

function Icon({code, size}: Props) {
    if (AssetIcons[code]) {
        const IconComponent = AssetIcons[code] as FunctionComponent<SVGProps<any>>
        return <span><IconComponent height={size || 20} width="auto"/></span>
    }

    return <span className="material-symbols-outlined">{code}</span>
}

export default Icon;
