export function indicesOf(substring: string, string: string) {
    let a = [], i = -1
    while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i)
    return a
}

