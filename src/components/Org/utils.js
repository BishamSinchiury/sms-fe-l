// If your API serves media from a different host than the app itself,
// set VITE_MEDIA_BASE_URL in your .env file. Leave it empty if media
// paths are already absolute or served from the same origin.
export const MEDIA_BASE_URL = import.meta.env?.VITE_MEDIA_BASE_URL || "";

export const resolveMedia = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${MEDIA_BASE_URL}${path}`;
};

export const isEmpty = (value) => value === null || value === undefined || value === "";

// Fields counted toward the "profile completeness" percentage.
export const getCompletionFields = (basic, contact, address, documents) => ([
  basic.name,
  basic.motto,
  basic.logo,
  basic.cover_picture,
  basic.primary_color,
  basic.secondary_color,
  basic.domain_name,
  contact.phone_number,
  contact.phone_number2,
  contact.email,
  address.country,
  address.province,
  address.district,
  address.city,
  address.latitude,
  address.longitude,
  documents.id_registration,
  documents.tax_registration,
  documents.birth_certificate_registration,
]);

/**
 * Calculate completion percent for a set of profile sections.
 * Only counts fields from sections that are actually relevant.
 *
 * @param {object}  basic     – org-level basic info (optional for suborgs)
 * @param {object}  contact   – contact info
 * @param {object}  address   – address info
 * @param {object}  documents – org-level documents (optional for suborgs)
 * @param {object}  [options]
 * @param {boolean} [options.countBasic=false]    – count basic fields
 * @param {boolean} [options.countDocuments=false] – count document fields
 */
export const getCompletionPercent = (basic, contact, address, documents, options = {}) => {
  const { countBasic = true, countDocuments = true } = options;
  const fields = [];

  if (countBasic) {
    fields.push(
      basic.name,
      basic.motto,
      basic.logo,
      basic.cover_picture,
      basic.primary_color,
      basic.secondary_color,
      basic.domain_name,
    );
  } else {
    // For suborgs: name + description are the relevant basic fields
    fields.push(basic.name, basic.description);
  }

  fields.push(
    contact.phone_number,
    contact.phone_number2,
    contact.email,
    address.country,
    address.province,
    address.district,
    address.city,
    address.latitude,
    address.longitude,
  );

  if (countDocuments) {
    fields.push(
      documents.id_registration,
      documents.tax_registration,
      documents.birth_certificate_registration,
    );
  }

  const filled = fields.filter((v) => !isEmpty(v)).length;
  return Math.round((filled / fields.length) * 100);
};
