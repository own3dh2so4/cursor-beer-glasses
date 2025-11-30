// Country name mapping for common aliases
export const COUNTRY_ALIASES: Record<string, string> = {
    'usa': 'united states of america',
    'us': 'united states of america',
    'uk': 'united kingdom',
    'uae': 'united arab emirates',
    'russian federation': 'russia',
    'czech republic': 'czechia',
    'republic of korea': 'south korea',
    'dem. rep. korea': 'north korea'
}

/**
 * Normalize country name for matching with world map geography
 * @param name - Country name to normalize
 * @returns Normalized country name (lowercase, trimmed, with aliases applied)
 */
export function normalizeCountryName(name: string): string {
    const lower = name.toLowerCase().trim()
    return COUNTRY_ALIASES[lower] || lower
}
