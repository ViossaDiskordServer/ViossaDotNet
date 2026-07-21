// script.js
document.addEventListener("alpine:init", () => {
	Alpine.store("dictionary", {
		search_results: {
			terms: 1,
			results: [
				{
					lemma_name: "wiigel",
					word_forms: [
						{
							word_form_id: 1262,
							word_form: "wijgeu",
							lect: { name: "ArekaDareka" },
						},
						{
							word_form_id: 1263,
							word_form: "wigl",
							lect: { name: "Anott" },
						},
						{
							word_form_id: 1264,
							word_form: "wijev",
							lect: { name: "Djin" },
						},
					],
				},
			],
		},

		prefs: {
			colorSidebarBg: "#000",
			colorMainBg: "#eee",
			colorCardBg: "#fff",
			colorPrimary: "#0bf",
			colorSecondary: "#08e",
			colorText: "#333",
			colorTextSecondary: "#555",
		},

		update_css_variables() {
			document.documentElement.style.setProperty(
				"--color-sidebar-bg",
				this.prefs.colorSidebarBg,
			);
			document.documentElement.style.setProperty(
				"--color-main-bg",
				this.prefs.colorMainBg,
			);
			document.documentElement.style.setProperty(
				"--color-card-bg",
				this.prefs.colorCardBg,
			);
			document.documentElement.style.setProperty(
				"--color-primary",
				this.prefs.colorPrimary,
			);
			document.documentElement.style.setProperty(
				"--color-secondary",
				this.prefs.colorSecondary,
			);
			document.documentElement.style.setProperty(
				"--color-text",
				this.prefs.colorText,
			);
			document.documentElement.style.setProperty(
				"--color-text-secondary",
				this.prefs.colorTextSecondary,
			);
		},

		load_preferences() {
			const saved_prefs = localStorage.getItem("prefs");
			if (saved_prefs) {
				this.prefs = { ...this.prefs, ...JSON.parse(saved_prefs) };
				this.update_css_variables();
			}
		},

		save_preferences() {
			localStorage.setItem("prefs", JSON.stringify(this.prefs));
			this.update_css_variables();
		},

		async fetch_all_lects() {
			try {
				const res = await axios.get("http://localhost:1225/lects");
				return res.data;
			} catch (e) {
				console.error(e);
			}
		},

		async post_lect(lect_name) {
			try {
				const res = await axios.post("http://localhost:1225/lect", {
					lect_name,
				});
				return res.data.lect;
			} catch (e) {
				console.error(e);
			}
		},

		async fetch_all_terms(search_term) {
			try {
				const res = await axios.get("http://localhost:1225/search", {
					params: { search_term: search_term },
				});
				this.search_results = res.data;
			} catch (e) {
				console.error(e);
			}
		},

		async fetch_one_lemma_detail(lemma_name) {
			try {
				const res = await axios.get(
					"http://localhost:1225/lemma-detail",
					{ params: { lemma_name } },
				);
				return res.data.lemma_detail;
			} catch (e) {
				console.error(e);
			}
		},

		async put_definition(definition_id, definition_text, lemma_name) {
			try {
				const res = await axios.put(
					"http://localhost:1225/definition",
					{ definition_id, definition_text, lemma_name },
				);
				return res.data.lemma_detail;
			} catch (e) {
				console.error(e);
			}
		},

		async delete_definition(definition_id, definition_text) {
			if (
				window.confirm(`Du keshite imi ${definition_id}.\nPravda?`)
			) {
				try {
					const res = await axios.delete(
						`http://localhost:1225/definition/${definition_id}`,
					);
				} catch (e) {
					console.error(e);
				}
			}
		},

		async put_example(example_id, example_text, lemma_name) {
			try {
				const res = await axios.put("http://localhost:1225/example", {
					example_id,
					example_text,
					lemma_name,
				});
				return res.data.lemma_detail;
			} catch (e) {
				console.error(e);
			}
		},

		async delete_example(example_id, example_text) {
			if (
				window.confirm(`Du keshite tato ${example_id}.\nPravda?`)
			) {
				try {
					const res = await axios.delete(
						`http://localhost:1225/example/${example_id}`,
					);
				} catch (e) {
					console.error(e);
				}
			}
		},

		async put_word_form_text(word_form_id, word_form_text) {
			try {
				const res = await axios.put("http://localhost:1225/word-form", {
					word_form_id,
					word_form_text,
				});
				return res.data.lemma_detail;
			} catch (e) {
				console.error(e);
			}
		},

		async post_new_word_form(lemma_name, lect_name, word_form_text) {
			if(!lemma_name || !lect_name || !word_form_text) {
				console.error(`Missing parameter:\n${JSON.stringify({
					lemma_name, lect_name, word_form_text
				})}`);
			}

			try {
				const res = await axios.post(
					"http://localhost:1225/word-form",
					{ lemma_name, lect_name, word_form_text },
				);
				return res.data.lemma_detail;
			} catch (e) {
				console.error(e);
			}
		},

		async delete_word_form(word_form_id, word_form_text) {
			if (
				window.confirm(`Du keshite kofal ${word_form_text}.\nPravda?`)
			) {
				try {
					const res = await axios.delete(
						`http://localhost:1225/word-form/${word_form_id}`,
					);
					return res.data.lemma_detail;
				} catch (e) {
					console.error(e);
				}
			}
		},

		filter_results(search_term) {
			if (!search_term) return this.search_results.results;
			return this.search_results.results.filter((item) =>
				item.word_forms
					.map((wf) => wf.word_form.toLowerCase())
					.join()
					.includes(search_term.toLowerCase()),
			);
		},

		md(text){
			console.debug(marked.parse(text));
			return DOMPurify.sanitize(marked.parse(text), {ALLOWED_TAGS: ['br', 'em', 'strong', 'code', '#text']});
		},
	});
});
