export const SITE = {
  name: "built2host",
  domain: "built2host.in",
  url: "https://built2host.in",
  commonEmail: "build2host@gmail.com", // TODO(owner): confirm exact address
  websiteDivision: {
    phoneDisplay: "98402 64843",
    whatsapp: "919840264843",
    email: "naresh.kumar.g.2112@gmail.com",
  },
  automationDivision: {
    phoneDisplay: "72003 46975",
    whatsapp: "917200346975",
    email: "ajaysuryawork@gmail.com",
  },
};

export const GATE_CATALOG_DOWNLOAD = false;
export const SHOW_PROOF = false;

export function makeWhatsAppUrl(
  number: string,
  message: string
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
