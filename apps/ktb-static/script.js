// script.js
document.addEventListener("alpine:init", () => {
  Alpine.store("dictionary", {
    search_results: {
      terms: 0,
      results: [
        {
          lemma_name: "wiigel",
          word_forms: [
            { word_form_id: 1262, word_form: "wijgeu", lect: { name: "ArekaDareka" } },
            { word_form_id: 1263, word_form: "wigl", lect: { name: "Anott" } },
            { word_form_id: 1264, word_form: "wijev", lect: { name: "Djin" } }
          ]
        }
      ]
    },

    prefs: {
      colorSidebarBg: "#000",
      colorMainBg: "#eee",
      colorCardBg: "#fff",
      colorPrimary: "#0bf",
      colorSecondary: "#08e",
      colorText: "#333",
      colorTextSecondary: "#555",
      spaceMd: 1.5,
      shadowStrength: 0.1
    },

    updateCSSVariables() {
      document.documentElement.style.setProperty("--color-sidebar-bg", this.prefs.colorSidebarBg);
      document.documentElement.style.setProperty("--color-main-bg", this.prefs.colorMainBg);
      document.documentElement.style.setProperty("--color-card-bg", this.prefs.colorCardBg);
      document.documentElement.style.setProperty("--color-primary", this.prefs.colorPrimary);
      document.documentElement.style.setProperty("--color-secondary", this.prefs.colorSecondary);
      document.documentElement.style.setProperty("--color-text", this.prefs.colorText);
      document.documentElement.style.setProperty("--color-text-secondary", this.prefs.colorTextSecondary);
      document.documentElement.style.setProperty("--space-md", `${this.prefs.spaceMd}rem`);
      document.documentElement.style.setProperty("--color-shadow", `rgba(0, 0, 0, ${this.prefs.shadowStrength})`);
    },

    loadPreferences() {
      const saved_prefs = localStorage.getItem("prefs");
      if (saved_prefs) {
        this.prefs = { ...this.prefs, ...JSON.parse(saved_prefs) };
        this.updateCSSVariables();
      }
    },

    savePreferences() {
      localStorage.setItem("prefs", JSON.stringify(this.prefs));
      this.updateCSSVariables();
    },

    async fetchAllTerms(searchTerm) {
      try {
        const res = await axios.get('http://localhost:1225/search', {
          params: { search_term: searchTerm }
        });
        this.search_results = res.data;
      } catch (e) { console.error(e); }
    },

    async fetchOneLemmaDetail(lemma_name) {
      try {
        const res = await axios.get('http://localhost:1225/lemma-detail', {
          params: { lemma_name }
        });
        return res.data.lemma_detail;
      } catch (e) { console.error(e); }
    },

    async postDefinition(definition_id, definition_text, lemma_name) {
      try {
        const res = await axios.put('http://localhost:1225/definition', {
          definition_id, definition_text, lemma_name
        });
        return res.data.lemma_detail;
      } catch (e) { console.error(e); }
    },

    async postExample(example_id, example_text, lemma_name) {
      try {
        const res = await axios.put('http://localhost:1225/example', {
          example_id, example_text, lemma_name
        });
        return res.data.lemma_detail;
      } catch (e) { console.error(e); }
    },

    filterResults(searchTerm) {
      if (!searchTerm) return this.search_results.results;
      return this.search_results.results
      .filter( //item.lemma_name.toLowerCase().includes(searchTerm.toLowerCase())
        item => item.word_forms
          .map(wf => wf.word_form.toLowerCase())
          .join().includes(searchTerm.toLowerCase())
      );
    }
  });
});
