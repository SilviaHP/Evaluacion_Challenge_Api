export interface ICharacter {
  characterName: string;
  homeworld: string;
}

export interface IHistoryCharacter {
  id: string;
  characterName: string;
  planetName: string;
  planetImageUrl: string;
  timestamp: number;
}

export interface IHistoryCharacterFormatted {
  id: string;
  characterName: string;
  planetName: string;
  planetImageUrl: string;
  timestamp: string;
}
