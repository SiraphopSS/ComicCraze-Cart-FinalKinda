import {RatingInterface} from "./lRating"

export interface ReviewInterface {
  ID?: number;
  ComicID?: number;
  Comment?: string;
  NameComic?: string;
  RatingID?: RatingInterface;
}