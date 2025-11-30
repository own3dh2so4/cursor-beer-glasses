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

// ISO 3166-1 alpha-2 country codes
export const COUNTRY_CODES: Record<string, string> = {
    'united states of america': 'us',
    'united kingdom': 'gb',
    'united arab emirates': 'ae',
    'russia': 'ru',
    'czechia': 'cz',
    'south korea': 'kr',
    'north korea': 'kp',
    'spain': 'es',
    'germany': 'de',
    'belgium': 'be',
    'france': 'fr',
    'italy': 'it',
    'netherlands': 'nl',
    'ireland': 'ie',
    'japan': 'jp',
    'china': 'cn',
    'australia': 'au',
    'canada': 'ca',
    'mexico': 'mx',
    'brazil': 'br',
    'argentina': 'ar',
    'portugal': 'pt',
    'austria': 'at',
    'switzerland': 'ch',
    'sweden': 'se',
    'norway': 'no',
    'denmark': 'dk',
    'finland': 'fi',
    'poland': 'pl',
    'greece': 'gr',
    'turkey': 'tr',
    'india': 'in',
    'thailand': 'th',
    'vietnam': 'vn',
    'singapore': 'sg',
    'malaysia': 'my',
    'indonesia': 'id',
    'philippines': 'ph',
    'new zealand': 'nz',
    'south africa': 'za',
    'egypt': 'eg',
    'morocco': 'ma',
    'kenya': 'ke',
    'chile': 'cl',
    'colombia': 'co',
    'peru': 'pe',
    'venezuela': 've',
    'hungary': 'hu',
    'romania': 'ro',
    'bulgaria': 'bg',
    'croatia': 'hr',
    'serbia': 'rs',
    'slovenia': 'si',
    'slovakia': 'sk',
    'ukraine': 'ua',
    'belarus': 'by',
    'estonia': 'ee',
    'latvia': 'lv',
    'lithuania': 'lt',
    'luxembourg': 'lu',
    'iceland': 'is',
    'scotland': 'gb-sct', // Special case for Scotland if needed, though usually mapped to UK
    'wales': 'gb-wls',    // Special case
    'england': 'gb-eng'   // Special case
}

/**
 * Get ISO 2-letter country code for a given country name
 * @param name - Country name (will be normalized)
 * @returns ISO 2-letter code or undefined if not found
 */
export function getCountryCode(name: string): string | undefined {
    const normalized = normalizeCountryName(name)
    return COUNTRY_CODES[normalized]
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

/**
 * Convert ISO 2-letter country code to flag emoji
 * @param code - ISO 2-letter country code (e.g., 'es', 'us', 'gb')
 * @returns Flag emoji or empty string if code is invalid
 */
export function getCountryFlagEmoji(code: string | undefined): string {
    if (!code || code.length !== 2) {
        return ''
    }

    const upperCode = code.toUpperCase()
    const codePointA = 0x1f1e6 // Regional Indicator Symbol Letter A

    const firstChar = upperCode.charCodeAt(0)
    const secondChar = upperCode.charCodeAt(1)

    // Validate that both characters are letters A-Z
    if (
        firstChar < 65 || firstChar > 90 ||
        secondChar < 65 || secondChar > 90
    ) {
        return ''
    }

    // Convert to regional indicator symbols
    const firstSymbol = codePointA + (firstChar - 65)
    const secondSymbol = codePointA + (secondChar - 65)

    return String.fromCodePoint(firstSymbol, secondSymbol)
}

/**
 * Get flag emoji for a country name
 * @param countryName - Country name (will be normalized and converted to code)
 * @returns Flag emoji or empty string if country not found
 */
export function getCountryFlag(countryName: string): string {
    const code = getCountryCode(countryName)
    return getCountryFlagEmoji(code)
}
