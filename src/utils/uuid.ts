export function generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) =>
        (
            Number(c) ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
        ).toString(16)
        );
    }

    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}