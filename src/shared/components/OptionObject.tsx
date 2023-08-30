import React from 'react';

interface Props<T> extends Omit<React.HTMLProps<HTMLOptionElement>, "value"> {
    value: T
}


/**
 * This is a normal option element, but it can take other values than strings (e.g. numbers, objects, enums).
 * Must be used with SelectObject instead of a select element.
 */
function OptionObject<T>({value, ...props}: Props<T>) {
    return (
        <option {...props} value={JSON.stringify(value)}></option>
    );
}

export default OptionObject;
