// Tiny replacements for the handful of lodash helpers shframework used,
// so we don't ship all of lodash (~71 KB) for four functions.

// 'user_name' | 'userName' -> 'User Name'  (lodash startCase(camelCase(x)))
export const startCase = (value) =>
    String(value ?? '')
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

// 'formControl' -> 'form-control'  (lodash snakeCase(x).replace(/_/g,'-'))
export const kebabCase = (value) =>
    String(value ?? '')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()

// Incrementing unique id with a prefix  (lodash uniqueId)
let uid = 0
export const uniqueId = (prefix = '') => `${prefix}${++uid}`
