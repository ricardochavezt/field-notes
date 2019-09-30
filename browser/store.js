const PouchDB = require('pouchdb').default;

let db;
function getDB() {
    if (!db) {
        //db = new PouchDB("https://fc8a73a8-0aef-40f2-833f-25e7a9c11376-bluemix:4c9d6c96cea509b8406d7f8a4b18616eb8db225376bfaaeff03aaa2aace24a9f@fc8a73a8-0aef-40f2-833f-25e7a9c11376-bluemix.cloudant.com/field_notes");
        db = new PouchDB("http://localhost:5984/field_notes");
    }
    return db;
}

module.exports = {
    getNotes() {
        return getDB().query('field_notes/notes', {include_docs: true, descending: true})
            .then(res => res.rows.map(row =>row.doc));
    },

    getLinks() {
        return getDB().query('field_notes/links', {include_docs: true, descending: true})
            .then(res => res.rows.map(row =>row.doc));
    },

    getToday() {
        return getDB().get("today").then((doc) => {
            return doc.content;
        });
    },

    insertNote(noteContent) {
        let newNote = {
            content: noteContent,
            created_at: new Date().toISOString(),
            kind: 'note'
        };
        return getDB().post(newNote).then((newDoc) => {
            return {...newNote, id: newDoc.id, _rev: newDoc.rev};
        });
    },

    updateNote(note) {
        note.updated_at = new Date().toISOString();
        return getDB().put(note).then((doc) => {
            return {...note, _rev: doc.rev};
        });
    },

    updateToday(content) {
        return getDB().get("today").then((doc) => {
            let newDoc = {...doc, content: content};
            return getDB().put(newDoc);
        });
    },

    insertLink(linkContent) {
        let newLink = {
            content: linkContent,
            created_at: new Date().toISOString(),
            kind: 'link'
        };
        return getDB().post(newLink).then((newDoc) => {
            return {...newLink, id: newDoc.id, _rev: newDoc.rev};
        });
    },

    updateLink(link) {
        link.updated_at = new Date().toISOString();
        return getDB().put(link).then((doc) => {
            return {...link, _rev: doc.rev};
        });
    }
}
