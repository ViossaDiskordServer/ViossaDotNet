import "reflect-metadata"
import { DataSource } from "typeorm"
import {Lemma, WordForm, Media, Example, Definition, Comment, PartOfSpeech, Lect} from "./dbmodel"

const persistent_path = process.env.PERSISTENT_STORAGE_DIR || "./res";

export const appDataSource = new DataSource({
  type: "sqlite",
  database:`${persistent_path}/dev.sqlite`,
  synchronize: true,
  logging: false,
  entities: [Lemma, WordForm, Example, Media, Definition, Comment, PartOfSpeech, Lect],
  migrations: [],
  subscribers: [],
})