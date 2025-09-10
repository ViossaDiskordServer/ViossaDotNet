import "reflect-metadata"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  ColumnType
} from "typeorm";


@Entity()
export class Lemma extends BaseEntity {
  @PrimaryColumn({type: 'text'})
  lemma_name: string;

  @OneToMany(() => WordForm, (word_form) => word_form.lemma)
  word_forms: WordForm[];

  @OneToMany(() => Example, (example) => example.lemma)
  examples: Example[];

  @OneToMany(() => Definition, (definition) => definition.lemma)
  definitions: Definition[];

  @OneToMany(() => Comment, (comment) => comment.lemma)
  comments: Comment[];

  @OneToMany(() => Media, (media) => media.lemma)
  media: Media[];

  @ManyToMany(() => PartOfSpeech)
  @JoinTable()
  parts_of_speech: PartOfSpeech[];

}

@Entity()
export class Lect extends BaseEntity {
  @PrimaryColumn({type: 'text'})
  name: string;

  @OneToMany(() => WordForm, (w) => w.lect)
  word_forms: WordForm[];

}

@Entity()
export class WordForm extends BaseEntity {
  @PrimaryColumn({type: 'integer'})
  word_form_id: number
  
  @Column({type: 'text'})
  word_form: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.word_forms)
  lemma: Lemma;

  @ManyToOne(() => Lect, (lect) => lect.word_forms)
  lect: Lect;
}

@Entity()
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  example_id: number;

  @Column({ nullable: false, type: 'text' })
  example_text: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.examples)
  lemma: Lemma; 
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  media_id: number;

  @Column({ nullable: false, type: 'text'})
  media_url: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.media)
  lemma: Lemma;
}

@Entity()
export class Definition extends BaseEntity {
  @PrimaryGeneratedColumn()
  definition_id: number;

  @Column({ nullable: false, type: 'text' })
  definition_text: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.definitions)
  lemma: Lemma;
}

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column({ nullable: false, type: 'text' })
  comment_text: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.comments)
  lemma: Lemma;
}

@Entity()
export class PartOfSpeech extends BaseEntity {
  @PrimaryColumn({type: 'text'})
  long_form: string;

  @Column({ nullable: false, unique: true, type: 'text' })
  short_form: string;
}

