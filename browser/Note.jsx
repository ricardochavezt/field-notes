const marked = require('marked')
const hyperdom = require('hyperdom')

module.exports = class Note {
    constructor(note, saveHandler) {
        this.note = note
        this.saveHandler = saveHandler
    }

    onload() {
        this.editMode = false
    }

    render() {
        return <div class="ui raised text container segment" ondblclick={() => this.openEditMode()}>
            {this.editMode ? this.editNote() : this.displayNote()}
        </div>
    }

    openEditMode() {
        if (!this.editMode) {
            this.editMode = true
        }
    }

    displayNote() {
        return hyperdom.rawHtml('div', marked(this.note.content, {gfm: true}))
    }

    editNote() {
        return (
            <form class="ui form">
                <div class="field">
                    <textarea binding="this.note.content"></textarea>
                </div>
                <button class="ui primary button" type="button" onclick={() => this.saveNote()}>Guardar</button>
            </form>
        )
    }

    saveNote() {
        if (this.saveHandler) {
            this.saveHandler(this.note)
        }
        this.editMode = false
    }
}
