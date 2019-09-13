const hyperdom = require('hyperdom')
const styles = require('./styles.css')
const Note = require('./Note.jsx')
const org = require('org')
const urlParse = require('url-parse')

module.exports = class App {
    constructor () {
        this.notes = []
        this.newNoteText = ""
        this.activeTab = "today"

        this.orgParser = new org.Parser()
        this.editingToday = false
        this.todayContent = ""

        this.links = []
        this.newLinkText = ""
    }

    onload() {
        let notes = JSON.parse(localStorage["notes"] || "[]")
        this.notes = notes.map((note, i) => new Note({id: i, content: note}, this.updateNote))

        this.todayContent = localStorage["today"] || ""

        let links  = JSON.parse(localStorage["links"] || "[]")
        this.links = links.map((link, i) => new Note({id: i, content: link}, this.updateLink))

        let url = urlParse(location.href, true)
        if (url.query.link) {
            this.activeTab = "links"
            if (url.query.title) {
                this.newLinkText = `[${url.query.title}](${url.query.link})`
            }
            else {
                this.newLinkText = `<${url.query.link}>`
            }
        }
    }

    addNote() {
        let newNote = this.newNoteText
        this.newNoteText = ""
        this.notes.unshift(new Note({id: this.notes.length, content: newNote}, this.updateNote))

        let notes = JSON.parse(localStorage["notes"] || "[]")
        notes.unshift(newNote)
        localStorage["notes"] = JSON.stringify(notes)
    }

    updateNote(note) {
        let notes = JSON.parse(localStorage["notes"] || "[]")
        notes[note.id] = note.content
        localStorage["notes"] = JSON.stringify(notes)
    }

    renderNotes() {
        return (
            <div class={styles.content}>
                <form class="ui form">
                    <div class="field">
                        <textarea binding="this.newNoteText"></textarea>
                    </div>
                    <button class="ui primary button" type="button" onclick={() => this.addNote()}>Guardar</button>
                </form>
                {this.notes}
            </div>
        )
    }

    renderToday() {
        let content
        if (this.editingToday) {
            content = (
                <form class="ui form">
                    <div class="field">
                        <textarea binding="this.todayContent"></textarea>
                    </div>
                    <button class="ui primary button" type="button" onclick={() => this.saveToday()}>Guardar</button>
                </form>
            )
        }
        else {
            let todayParsedContent = ""
            if (this.todayContent.length > 0) {
                let orgDocument = this.orgParser.parse(this.todayContent)
                let orgHTMLDocument = orgDocument.convert(org.ConverterHTML, {
                    headerOffset: 1,
                    exportFromLineNumber: false,
                    suppressSubScriptHandling: false,
                    suppressAutoLink: false
                })
                todayParsedContent = orgHTMLDocument.contentHTML
            }
            content = hyperdom.rawHtml('div', todayParsedContent)
        }
        return (
            <div class={styles.content}>
                <h1 class="ui header">Today</h1>
                <div class="ui raised text container segment" ondblclick={() => this.editToday()}>
                    {content}
                </div>
            </div>
        )
    }

    editToday() {
        if (!this.editingToday) {
            this.editingToday = true
        }
    }

    saveToday() {
        localStorage["today"] = this.todayContent
        this.editingToday = false
    }

    addLink() {
        let newLink = this.newLinkText
        this.newLinkText = ""
        this.links.unshift(new Note({id: this.links.length, content: newLink}, this.updateLink))

        let links  = JSON.parse(localStorage["links"] || "[]")
        links.unshift(newLink)
        localStorage["links"] = JSON.stringify(links)
    }

    updateLink(link) {
        let links  = JSON.parse(localStorage["links"] || "[]")
        links[link.id] = link.content
        localStorage["links"] = JSON.stringify(links)
    }

    renderLinks() {
        return (
            <div class={styles.content}>
                <h1 class="ui header">Links</h1>
                <form class="ui form">
                    <div class="field">
                        <textarea binding="this.newLinkText"></textarea>
                    </div>
                    <button class="ui primary button" type="button" onclick={() => this.addLink()}>Guardar</button>
                </form>
                {this.links}
            </div>
        )
    }

    render() {
        let content
        switch (this.activeTab) {
            case "notes":
                content = this.renderNotes()
                break
            case "today":
                content = this.renderToday()
                break
            case "links":
                content = this.renderLinks()
                break
            default:
                content = <p class={styles.content}>empty</p>
        }

        return (
            <main>
                <div class="ui text container">
                    <div class="three ui buttons">
                        <button class={{"ui": true, "button": true, "active": this.activeTab == "today"}} onclick={() => this.activeTab = "today"}>Today</button>
                        <button class={{"ui": true, "button": true, "active": this.activeTab == "notes"}} onclick={() => this.activeTab = "notes"}>Notes</button>
                        <button class={{"ui": true, "button": true, "active": this.activeTab == "links"}} onclick={() => this.activeTab = "links"}>Links</button>
                    </div>
                    {content}
                </div>
            </main>
        )
    }
}
