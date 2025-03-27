import { IObjectKeys } from "./interfaces";

export function templateParser(expression: string, valueObj: IObjectKeys) {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    let text = expression.replace(templateMatcher, (substring: string, value: string, index: string) => {
        value = valueObj[value];
        return value;
    });
    return text
}