export const splitCommaSeparatedString = (commaSeparatedString: string): string[] => {
    return commaSeparatedString.split(',').filter(r => r.trim());
}