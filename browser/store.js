module.exports = {
    getNotes() {
        return new Promise((resolve, reject) => {
            let notes = JSON.parse(localStorage["notes"] || "[]").map((note, i) => {
                return {id: i, content: note};
            });
            resolve(notes);
        });
    },

    getLinks() {
        return new Promise((resolve, reject) => {
            let links = JSON.parse(localStorage["links"] || "[]").map((note, i) => {
                return {id: i, content: note};
            });
            resolve(links);
        });
    },

    getToday() {
        return new Promise((resolve, reject) => {
            resolve(localStorage["today"] || "");
        });
    },

    insertNote(noteContent) {
        return new Promise((resolve, reject) => {
            let notes = JSON.parse(localStorage["notes"] || "[]");
            notes.unshift(noteContent);
            localStorage["notes"] = JSON.stringify(notes);
            resolve({id: notes.length, content: noteContent});
        });
    },

    updateNote(note) {
        return new Promise((resolve, reject) => {
            let notes = JSON.parse(localStorage["notes"] || "[]");
            notes[note.id] = note.content;
            localStorage["notes"] = JSON.stringify(notes);
            resolve();
        });
    },

    updateToday(content) {
        return new Promise((resolve, reject) => {
            localStorage["today"] = content;
            resolve();
        });
    },

    insertLink(linkContent) {
        return new Promise((resolve, reject) => {
            let links  = JSON.parse(localStorage["links"] || "[]");
            links.unshift(linkContent);
            localStorage["links"] = JSON.stringify(links);
            resolve({id: links.length, content: linkContent});
        });
    },

    updateLink(link) {
        return new Promise((resolve, reject) => {
            let links  = JSON.parse(localStorage["links"] || "[]");
            links[link.id] = link.content;
            localStorage["links"] = JSON.stringify(links);
            resolve();
        });
    }
}
