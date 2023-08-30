import React from 'react';

interface Props<T> extends Omit<React.HTMLProps<HTMLSelectElement>, "value" | "onChange"> {
    value: T

    onChange(value: T): void
}

/**
 * This is a normal select element, but it can take other values than strings (e.g. numbers, objects, enums).
 * Must be used with OptionObject instead of option elements.
 * @param value
 * @param onChange
 * @param props
 * @constructor
 */
function SelectObject<T>({value, onChange, ...props}: Props<T>) {
    const nativeValue = JSON.stringify(value)

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = JSON.parse(event.currentTarget.value)
        onChange(newValue)
    }

    return (
        <select {...props} onChange={handleChange} value={nativeValue}>
        </select>
    );
}

export default SelectObject;
