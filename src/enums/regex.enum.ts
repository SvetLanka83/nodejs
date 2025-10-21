export const RegexEnum = {
    PASSWORD: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
    NAME: /^[A-Z][a-z]{1,9}$/,
};
