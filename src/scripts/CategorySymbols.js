export default {
  name: 'CategorySymbols',
  getCategorySymbol: (category) => {
    switch (category) {
      case 'Fundamentals':
        return require('../assets/category-fundamentals.svg')
      case 'Alchemy':
        return require('../assets/category-alchemy.svg')
      case 'Gemmology':
        return require('../assets/category-gemmology.svg')
      case 'Spellcasting':
        return require('../assets/category-spellcasting.svg')
      case 'Temporal manipulation':
        return require('../assets/category-temporal.svg')
      case 'Botany':
        return require('../assets/category-botany.svg')
      default:
        return require('../assets/category-unknown.svg')
    }
  },
  getCategorySymbolReverse: (category) => {
    switch (category) {
      case 'Fundamentals':
        return require('../assets/category-fundamentals-reverse.svg')
      case 'Alchemy':
        return require('../assets/category-alchemy-reverse.svg')
      case 'Gemmology':
        return require('../assets/category-gemmology-reverse.svg')
      case 'Spellcasting':
        return require('../assets/category-spellcasting-reverse.svg')
      case 'Temporal manipulation':
        return require('../assets/category-temporal-reverse.svg')
      case 'Botany':
        return require('../assets/category-botany-reverse.svg')
      default:
        return require('../assets/category-unknown-reverse.svg')
    }
  }
}
