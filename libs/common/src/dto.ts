export interface SearchResult {
	terms: number;
	results: LemmaDto[];
	lects: LectDto[];
}

export interface LemmaDto {
	lemma_name: string;
	word_forms: WordFormDto[];
	examples: ExampleDto[];
	definitions: DefinitionDto[];
	comments: CommentDto[];
	media: MediaDto[];
	parts_of_speech: PartOfSpeechDto[];
}


export interface LectDto {
	name: string;
	word_forms: WordFormDto[];
}

export interface WordFormDto {
	word_form_id: number;
	word_form: string;
	lemma: LemmaDto;
	lect: LectDto;
}

export interface ExampleDto {
	example_id: number;
	example_text: string;
	lemma: LemmaDto;
}

export interface MediaDto {
	media_id: number;
	media_url: string;
	lemma: LemmaDto;
}

export interface DefinitionDto {
	definition_id: number;
	definition_text: string;
	lemma: LemmaDto;
}

export interface CommentDto {
	comment_id: number;
	comment_text: string;
	lemma: LemmaDto;
}

export interface PartOfSpeechDto {
	long_form: string;
	short_form: string;
}
