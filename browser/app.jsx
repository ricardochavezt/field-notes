const hyperdom = require('hyperdom')
const styles = require('./styles.css')
const Note = require('./Note.jsx')
const org = require('org')
const urlParse = require('url-parse')
const store = require('./store')

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
        let getNotes = store.getNotes().then((notes) => {
            this.notes = notes.map(note => new Note(note , this.updateNote))
        });

        let getToday = store.getToday().then((todayContent) => {
            this.todayContent = todayContent
        });

        let getLinks = store.getLinks().then((links) => {
            this.links = links.map(link => new Note(link , this.updateLink))
        });

        return Promise.all([getNotes, getToday, getLinks]).then(values => {
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
        });
    }

    addNote() {
        store.insertNote(this.newNoteText).then((newNote) => {
            this.newNoteText = ""
            this.notes.unshift(new Note(newNote, this.updateNote))
        });
    }

    updateNote(note) {
        store.updateNote(note)
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
        return store.updateToday(this.todayContent).then(() => {
            this.editingToday = false
        });
    }

    addLink() {
        store.insertLink(this.newLinkText).then((newLink) => {
            this.newLinkText = ""
            this.links.unshift(new Note(newLink, this.updateLink))
        });
    }

    updateLink(link) {
        store.updateLink(link)
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
