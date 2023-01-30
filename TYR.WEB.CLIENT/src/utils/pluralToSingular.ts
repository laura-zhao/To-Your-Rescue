export const pluralToSingular = (animalType: any) => {
  switch (animalType.toLowerCase()) {
    case 'geese':
      return 'Goose';
    case 'foxes':
      return 'Fox';
    case 'wolves':
      return 'Wolf';
    case 'sheep':
      return 'Sheep';
    case 'oxen':
      return 'Ox';
    case 'hippopotamuses':
      return 'Hippo';
    case 'hippopotami':
      return 'Hippo';
    case 'buffaloes':
      return 'Buffalo';
    case 'calves':
      return 'Calf';
    case 'mice':
      return 'Mouse';
    case 'butterflies':
      return 'Butterfly';
    case 'fish':
      return 'Fish';
    case 'puppies':
      return 'Puppy';
    case 'puppys':
      return 'Puppy';
    default:
      return (animalType.split('')[animalType.length - 1] === 's') ? animalType.split('').slice(0, [animalType.length - 1]) : animalType;
  }
};
