module.exports = {
    getNotes() {
        return JSON.parse(localStorage["notes"] || "[]");
    },

    getLinks() {
        return JSON.parse(localStorage["links"] || "[]");
    },

    getToday() {
        return localStorage["today"] || "";
    },

    insertNote(noteContent) {
        let notes = JSON.parse(localStorage["notes"] || "[]");
        notes.unshift(noteContent);
        localStorage["notes"] = JSON.stringify(notes);
        return {id: notes.length, content: noteContent};
    },

    updateNote(note) {
        let notes = JSON.parse(localStorage["notes"] || "[]");
        notes[note.id] = note.content;
        localStorage["notes"] = JSON.stringify(notes);
    },

    updateToday(content) {
        localStorage["today"] = this.todayContent;
    },

    insertLink(linkContent) {
        let links  = JSON.parse(localStorage["links"] || "[]");
        links.unshift(linkContent);
        localStorage["links"] = JSON.stringify(links);
        return {id: links.length, content: linkContent};
    },

    updateLink(link) {
        let links  = JSON.parse(localStorage["links"] || "[]");
        links[link.id] = link.content;
        localStorage["links"] = JSON.stringify(links);
    }
}
