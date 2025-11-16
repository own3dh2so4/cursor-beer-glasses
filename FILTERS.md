# Beer Collection Filters

## Overview

The gallery includes a comprehensive filtering system that allows you to explore your beer collection in multiple ways. All filters can be combined for precise searches.

## Available Filters

### 🔍 **Search**
- **Type**: Text input
- **Searches**: Beer brand names
- **Example**: Type "Guinness" to find all Guinness beers
- **Case insensitive**: Works with any capitalization

### 📍 **Origin Country**
- **Type**: Dropdown
- **Filters by**: Country where the beer is brewed
- **Available countries**: Belgium, Spain, Germany, Ireland, Holland, Poland, Czech Republic, Russia, Hungary, Portugal, UK, Italy, Greece, Luxembourg, South Korea, Japan, USA
- **Example**: Select "Belgium" to see all Belgian beers

### 🌍 **Continent**
- **Type**: Dropdown
- **Filters by**: Continental region
- **Available continents**: 
  - Western Europe
  - Southern Europe
  - Central Europe
  - Eastern Europe
  - Asia
  - North America
- **Example**: Select "Southern Europe" to see beers from Spain, Italy, Greece, Portugal

### 🍺 **Glasses Count**
- **Type**: Dropdown
- **Options**:
  - All: Shows all brands
  - Single Glass: Brands with only 1 glass in collection
  - Multiple Glasses: Brands with 2+ glasses in collection
- **Example**: Select "Multiple Glasses" to see brands where you have more than one type of glass

### 🎁 **How Acquired**
- **Type**: Dropdown
- **Options**:
  - All Methods
  - Bought: Glasses you purchased
  - Gift: Glasses received as presents
- **Example**: Select "Gift" to see all glasses that were gifted to you

### 🛍️ **Bought In**
- **Type**: Dropdown
- **Filters by**: Country where you purchased the glass
- **Available locations**: Based on your collection data
- **Example**: Select "Spain" to see all glasses bought in Spain (regardless of beer origin)

### 📊 **Sort By**
- **Type**: Dropdown
- **Options**:
  - A → Z (Name): Alphabetically ascending
  - Z → A (Name): Alphabetically descending
  - Country (A → Z): Sorted by origin country
  - Most Glasses: Brands with most glasses first
  - Fewest Glasses: Brands with fewest glasses first
- **Example**: Select "Most Glasses" to see which brands have the most variety in your collection

## Filter Combinations

All filters work together! Here are some example combinations:

### Example 1: Belgian Gifts
- **Origin Country**: Belgium
- **How Acquired**: Gift
- **Result**: All Belgian beers that were gifts

### Example 2: Spanish Beers Bought in Madrid
- **Search**: (leave empty)
- **Origin Country**: Spain
- **Bought In**: Spain
- **Result**: Spanish beers purchased in Spain

### Example 3: Western European Multi-Glass Brands
- **Continent**: Western Europe
- **Glasses Count**: Multiple Glasses
- **Sort By**: Most Glasses
- **Result**: Western European brands with 2+ glasses, sorted by collection size

### Example 4: Quick Search
- **Search**: "IPA"
- **Result**: All beers with "IPA" in their name

## Filter Stats

At the bottom of the filter bar, you'll see:
- **Total brands**: Number of brands matching your filters
- **Total glasses**: Total number of individual glasses matching your filters

## Reset Filters

Click the **↺ Reset** button at the top right of the filter bar to clear all filters and return to the full collection view.

## No Results

If no beers match your filter combination, you'll see a friendly message with a button to reset all filters.

## Responsive Design

The filter bar adapts to your screen size:
- **Mobile**: Single column layout
- **Tablet (768px+)**: 2 columns
- **Desktop (1024px+)**: 3 columns

## Technical Details

### Filter Logic

1. **Search**: Case-insensitive text matching on brand name
2. **Country**: Exact match on `from_country` field
3. **Continent**: Maps countries to continents, then filters
4. **Glass Count**: 
   - Single: `glasses.length === 1`
   - Multiple: `glasses.length > 1`
5. **How Acquired**: Checks if ANY glass in the brand matches the method
6. **Bought Country**: Checks if ANY glass was bought in that country
7. **Sort**: Applied after all filters

### Filter Execution Order

```
1. Load all brands
2. Apply search filter
3. Apply country filter
4. Apply continent filter
5. Apply glass count filter
6. Apply acquisition method filter
7. Apply bought country filter
8. Apply sorting
9. Display results
```

### Performance

- **Optimized**: Uses React `useMemo` to prevent unnecessary recalculations
- **Fast**: All filtering happens client-side (no server requests)
- **Smooth**: Instant updates as you change filters

## Future Enhancements

Possible additions:
- [ ] Filter by beer style/type
- [ ] Filter by acquisition year
- [ ] Multiple selection (OR logic)
- [ ] Save favorite filter combinations
- [ ] Export filtered results
- [ ] Filter history
- [ ] Advanced search with regex
- [ ] Filter by color/appearance

## Accessibility

All filter inputs include:
- ✅ Proper labels
- ✅ Focus states
- ✅ Keyboard navigation
- ✅ ARIA attributes (via semantic HTML)
- ✅ Clear visual feedback

## Tips

1. **Start broad, then narrow**: Begin with continent or country, then add more specific filters
2. **Use search for quick access**: If you know the beer name, search is fastest
3. **Explore with sort**: Try different sort options to discover patterns in your collection
4. **Check the stats**: The badge counters update as you filter, helping you understand your collection
5. **Don't forget reset**: If you get zero results, hit reset and try a different combination

Enjoy exploring your beer glass collection! 🍺

