/* eslint-disable */
export const WebsiteValidationTooltip = 'Please use proper URL formats with prefix \'http:\\\\\' or \'https:\\\\\'';

export const PhoneValidationTooltip = (
  <div>
    <p>Please use the following formats for input, depending on whether the number is in North America or elsewhere.</p>
    <span style={{ marginTop: '20px', marginBottom: '0px', fontWeight: 'bold' }}>North American phone numbers</span>
    <p>To format phone numbers in the US, Canada, and other NANP (North American Numbering Plan) countries, enclose the area code in parentheses followed by a space, and then hyphenate the three-digit exchange code with the four-digit number.</p>
    <p><span style={{ marginBottom: '0px', fontWeight: 'bold' }}>Recommended:</span> (415) 555-0132</p>
    <span style={{ marginTop: '20px', marginBottom: '0px', fontWeight: 'bold' }}>International phone numbers</span>
    <p style={{ marginBottom: '0px' }}>To format phone numbers in non-NANP countries, include the country and area codes. Separate the groups of numbers with spaces. Insert a plus sign immediately before the country code (no space); the plus sign stands in for a prefix known as an exit code, which lets you dial out of a country. Each country has a different exit code.</p>
    <p><span style={{ marginBottom: '0px', fontWeight: 'bold' }}>Recommended:</span> +1 415 555 0132</p>
  </div>
);

export const AssignedIDValidationTooltip = 'If you maintain your own numbering system you can add it here but it is not required and unnecessary. TYR assigns a number and it is this number that you should use. If you are adding historical animals you might want to use it.';

export const AnimalLocationTooltip = 'Kennel number, pen, field, pool, pet store, etc. where the animal is currently located.';