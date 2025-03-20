
export function transformProductToDocument(product: any) {
    return `
      Product ID: ${product.id}
      Name: ${product.name}
      Description: ${product.description}
      Price Range: ${product.pricing.priceRange.start.gross.amount} ${product.pricing.priceRange.start.gross.currency} - ${product.pricing.priceRange.stop.gross.amount} ${product.pricing.priceRange.stop.gross.currency}
    `;
}