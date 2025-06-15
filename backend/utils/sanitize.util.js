// Sanitize Product input data
exports.sanitizeProductInput = (data) => {
  const sanitized = {
    title: data.title?.trim(),
    description: data.description?.trim(),
    basePrice: Math.round(Number(data.basePrice)),
    currency: data.currency?.toUpperCase() || "INR",
    stock: data.stock !== undefined ? Math.floor(Number(data.stock)) : 0,
  };

  // Handle discount data
  if (
    data.discount &&
    (data.discount.amountOffPaise || data.discount.percentOff)
  ) {
    sanitized.discount = {
      amountOffPaise: data.discount.amountOffPaise
        ? Math.round(Number(data.discount.amountOffPaise))
        : 0,
      percentOff: data.discount.percentOff
        ? Math.floor(Number(data.discount.percentOff))
        : 0,
      validUntil: data.discount.validUntil
        ? new Date(data.discount.validUntil)
        : undefined,
      discountCode: data.discount.discountCode?.trim(),
    };
  }

  return sanitized;
};
