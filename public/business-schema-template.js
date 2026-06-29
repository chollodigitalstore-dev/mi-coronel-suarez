// Plantilla para fichas individuales de comercio.
// Uso futuro: completar con datos reales del comercio y renderizar dentro de:
// <script type="application/ld+json">...</script>

export function createLocalBusinessSchema(business) {
  return {
    "@context": "https://schema.org",
    "@type": business.type || "LocalBusiness",
    "@id": `https://guiasuarez.ar/comercios/${business.slug}#business`,
    "name": business.name,
    "description": business.description,
    "url": `https://guiasuarez.ar/comercios/${business.slug}`,
    "telephone": business.telephone,
    "image": business.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.streetAddress,
      "addressLocality": "Coronel Suárez",
      "addressRegion": "Buenos Aires",
      "postalCode": business.postalCode || "7540",
      "addressCountry": "AR"
    },
    "geo": business.latitude && business.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    } : undefined,
    "areaServed": {
      "@type": "City",
      "name": "Coronel Suárez"
    }
  };
}
