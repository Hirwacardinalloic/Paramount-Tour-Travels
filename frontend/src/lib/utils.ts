import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const countryKeywords: Record<string, string[]> = {
  rwanda: ['rwanda', 'kigali', 'volcanoes', 'musanze', 'nyungwe', 'akagera', 'rubavu', 'kayonza', 'western province', 'southern province', 'eastern province', 'northern province'],
  uganda: ['uganda', 'kampala', 'murchison', 'bwindi', 'queen elizabeth', 'jinja', 'lake victoria', 'lake albert', 'mabira', 'gulu'],
  kenya: ['kenya', 'nairobi', 'maasai mara', 'amboseli', 'tsavo', 'nakuru', 'mombasa', 'mbawa', 'lamu'],
  tanzania: ['tanzania', 'serengeti', 'ngorongoro', 'kilimanjaro', 'zanzibar', 'arusha', 'mbeya', 'dodoma', 'dar es salaam']
}

export type CountryCode = keyof typeof countryKeywords

export function getCountryFromLocation(location: string | undefined | null): CountryCode | '' {
  if (!location) return ''
  const normalized = location.toLowerCase()
  for (const country of Object.keys(countryKeywords) as CountryCode[]) {
    if (countryKeywords[country].some((keyword) => normalized.includes(keyword))) {
      return country
    }
  }
  return ''
}
