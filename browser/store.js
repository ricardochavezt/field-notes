const PouchDB = require('pouchdb').default;

let db;
function getDB() {
    if (!db) {
        db = new PouchDB("http://localhost:5984/field_notes");
    }
    return db;
}

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
        return getDB().get("today").then((doc) => {
            return doc.content;
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
        return getDB().get("today").then((doc) => {
            let newDoc = {...doc, content: content};
            return getDB().put(newDoc);
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
