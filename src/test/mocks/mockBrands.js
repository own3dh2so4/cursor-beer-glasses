/**
 * Mock data for testing
 */

export const mockBrand1 = {
  name: 'Test Beer 1',
  id: 'test_beer_1',
  from_city: 'Madrid',
  from_country: 'Spain',
  website: 'https://testbeer1.com',
  logo: 'test_beer_1/logo200x200.png',
  name_image: 'test_beer_1/name.png',
  map: 'https://maps.google.com/embed?test1',
  glasses: [
    {
      name: 'Test Glass 1',
      id: 'test_glass_1',
      photo: 'test_beer_1/glass_0.jpg',
      bought_city: 'Barcelona',
      bought_country: 'Spain',
      got: 'buy',
      got_from: 'Test Store',
      map: 'https://maps.google.com/embed?glass1'
    }
  ]
}

export const mockBrand2 = {
  name: 'Test Beer 2',
  id: 'test_beer_2',
  from_city: 'Dublin',
  from_country: 'Ireland',
  website: 'https://testbeer2.com',
  logo: 'test_beer_2/logo200x200.png',
  name_image: 'test_beer_2/name.svg',
  map: 'https://maps.google.com/embed?test2',
  glasses: [
    {
      name: 'Test Glass 2A',
      id: 'test_glass_2a',
      photo: 'test_beer_2/glass_0.jpg',
      bought_city: 'Dublin',
      bought_country: 'Ireland',
      got: 'gift',
      got_from: 'Friend',
      map: 'https://maps.google.com/embed?glass2a'
    },
    {
      name: 'Test Glass 2B',
      id: 'test_glass_2b',
      photo: 'test_beer_2/glass_1.jpg',
      bought_city: 'Cork',
      bought_country: 'Ireland',
      got: 'buy',
      got_from: 'Test Pub',
      map: 'https://maps.google.com/embed?glass2b'
    }
  ]
}

export const mockBrands = [mockBrand1, mockBrand2]

