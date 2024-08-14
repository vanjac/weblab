'use strict'

const doctype = '<!DOCTYPE html>'

/** @type {HTMLIFrameElement} */
let iframe
/** @type {HTMLInputElement} */
let titleInput
/** @type {HTMLInputElement} */
let fileInput

/**
 * @typedef {object} KeyboardShortcut
 * @prop {string} key
 * @prop {string} command
 */

/** @type {KeyboardShortcut[]} */
const shortcuts = [
    // File
    { key: 'N', command: 'new' },
    { key: 'o', command: 'open' },
    { key: 's', command: 'save' },
    { key: 'p', command: 'print' },
    // Insert
    { key: 'L', command: 'insertUnorderedList' },
    { key: 'h', command: 'fromHTML' },
    // Format
    { key: 'b', command: 'bold' },
    { key: 'i', command: 'italic' },
    { key: 'u', command: 'underline' },
    { key: '=', command: 'subscript' },
    { key: '+', command: 'superscript' },
    { key: 'l', command: 'justifyLeft' },
    { key: 'e', command: 'justifyCenter' },
    { key: 'r', command: 'justifyRight' },
    { key: 'j', command: 'justifyFull' },
    { key: 'm', command: 'indent' },
    { key: 'M', command: 'outdent' },
    { key: 'q', command: 'removeFormat' },
    // Style
    { key: '1', command: 'H1' },
    { key: '2', command: 'H2' },
    { key: '3', command: 'H3' },
    { key: '4', command: 'H4' },
    { key: '5', command: 'H5' },
    { key: '6', command: 'H6' },
    { key: '0', command: 'DIV' },
    // Already handled by browser: undo, redo, cut, copy, paste, delete, selectAll, ...
]

/**
 * @param {string} command
 */
function handleCommand(command) {
    let simpleCommands = [
        // Edit
        'undo', 'redo', 'cut', 'copy', 'paste', 'delete', 'selectAll',
        // Insert
        'insertOrderedList', 'insertUnorderedList', 'insertHorizontalRule',
        // Format
        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
        'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
        'indent', 'outdent',
        'removeFormat',
        // Already handled by browser: forwardDelete, insertText, insertImage
    ]
    let blockTags = ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE']

    if (simpleCommands.indexOf(command) != -1) {
        iframe.contentDocument.execCommand(command)
    } else if (blockTags.indexOf(command) != -1) {
        iframe.contentDocument.execCommand('formatBlock', false, command)
    } else if (command == 'fromHTML') {
        let html = iframe.contentDocument.getSelection().toString()
        iframe.contentDocument.execCommand('insertHTML', false, html)
    } else if (command == 'insertTable') {
        let content = iframe.contentDocument.getSelection().toString()
        iframe.contentDocument.execCommand('insertHTML', false,
            `<table><tr><td>${content}</td></tr></table>`)
    } else if (command == 'fontName') {
        let fontName = prompt('Font name:')
        if (fontName != null) {
            iframe.contentDocument.execCommand('fontName', false, fontName)
        }
    } else if (command == 'new') {
        iframe.srcdoc = doctype
    } else if (command == 'open') {
        fileInput.value = null
        fileInput.click()
    } else if (command == 'save') {
        let blob = new Blob([documentHTML(iframe.contentDocument)], {type: 'text/plain'})
        saveFile(blob, 'untitled.html')
    } else if (command == 'print') {
        iframe.contentWindow.print()
    }

    iframe.focus()
}

/**
 * @param {HTMLSelectElement} menu
 * @param {(value: string) => void} listener
 */
function addMenuListener(menu, listener) {
    menu.addEventListener('change', () => {
        listener(menu.value)
        menu.selectedIndex = 0 // restore menu title
    })
}

/**
 * @param {KeyboardEvent} e
 */
function onKeyDown(e) {
    if (e.ctrlKey) {
        for (let shortcut of shortcuts) {
            if (e.key == shortcut.key) {
                handleCommand(shortcut.command)
                e.preventDefault()
                break
            }
        }
    } else if (e.key == 'Tab') {
        handleCommand(e.shiftKey ? 'outdent' : 'indent')
        e.preventDefault()
    }
}

/**
 * @param {Blob} blob
 */
function openFile(blob) {
    let reader = new FileReader()
    reader.onload = () => {
        if (typeof reader.result == 'string') {
            iframe.srcdoc = reader.result
        }
    }
    reader.readAsText(blob)
}

/**
 * @param {Blob} blob
 * @param {string} name
 */
function saveFile(blob, name) {
    /** @type {HTMLAnchorElement} */
    let downloadLink = document.querySelector('#download')
    let url = URL.createObjectURL(blob)
    downloadLink.href = url
    downloadLink.download = name
    downloadLink.click()
    URL.revokeObjectURL(url)
}

/**
 * @param {Document} document
 */
function documentHTML(document) {
    let clone = /** @type {Document} */(document.cloneNode(true))
    clone.body.style.overflowWrap = null
    return doctype + '\n' + clone.documentElement.outerHTML
}

function onDocumentLoaded() {
    iframe.contentDocument.body.style.overflowWrap = 'break-word'
    iframe.contentDocument.designMode = 'on'
    iframe.contentDocument.execCommand('enableAbsolutePositionEditor', false, 'true')
    iframe.contentDocument.execCommand('enableInlineTableEditing', false, 'true')
    iframe.contentDocument.execCommand('enableObjectResizing', false, 'true')

    iframe.contentDocument.addEventListener('keydown', onKeyDown)

    titleInput.value = iframe.contentDocument.title
}

window.addEventListener('load', () => {
    titleInput = document.querySelector('#title')

    iframe = document.querySelector('#document')
    onDocumentLoaded()
    iframe.addEventListener('load', onDocumentLoaded)

    document.addEventListener('keydown', onKeyDown)

    addMenuListener(document.querySelector('#fileMenu'), handleCommand)
    addMenuListener(document.querySelector('#editMenu'), handleCommand)
    addMenuListener(document.querySelector('#insertMenu'), handleCommand)
    addMenuListener(document.querySelector('#formatMenu'), handleCommand)
    addMenuListener(document.querySelector('#styleMenu'), handleCommand)

    titleInput.addEventListener('input', () => {
        iframe.contentDocument.title = titleInput.value
    })

    fileInput = document.querySelector('#file')
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length == 1) {
            openFile(fileInput.files[0])
        }
    })
})
