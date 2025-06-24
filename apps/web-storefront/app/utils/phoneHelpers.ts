import {
  AsYouType,
  formatIncompletePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'

export function getPhoneNumberFormatter(countryCode?: 'RU') {
  return new AsYouType(countryCode)
}

export function formatPhoneNumber(value: string, countryCode?: 'RU') {
  if (value.length > 10) {
    try {
      const parsed = parsePhoneNumberWithError(value, countryCode)
      if (parsed) {
        return parsed.format('INTERNATIONAL', {
          humanReadable: true,
          fromCountry: countryCode,
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        return value
      }
    }
  }
  if (value.length > 6) {
    return formatIncompletePhoneNumber(value, countryCode) ?? ''
  }
  return value
}

export function checkPhoneNumberValidity(value: string, countryCode?: 'RU') {
  return isValidPhoneNumber(value, countryCode)
}
