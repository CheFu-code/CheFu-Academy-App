export function firstRouteParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export function parseJsonRouteParam<T>(
    value: string | string[] | undefined,
    fallback: T,
) {
    const raw = firstRouteParam(value);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}
