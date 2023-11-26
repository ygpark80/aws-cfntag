export function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error)
}

export function parseTags(tags: string): Record<string, string> {
    // if tags is json, parse using JSON
    if (tags.startsWith("{")) return JSON.parse(tags)

    // otherwise, treat it as key1=value1,key2=value2,...
    const result: Record<string, string> = {}
    for (const tag of tags.split(",")) {
        const [key, value] = tag.split("=")
        result[key] = value
    }
    return result
}
