import { shRepo as coreRepo, shApis } from '@iankibetsh/sh-core'
import shIndexedDB from '../repositories/ShIndexedDB.js'
import { Modal, Offcanvas } from 'bootstrap'

// Bootstrap/DOM-specific helpers live here; everything else comes from sh-core

function setTabCounts (url) {
    shApis.doGet(url).then(res => {
        Object.keys(res.data).forEach(key => {
            const elem = document.getElementById(key)
            if (elem === null) {
                return
            }
            if (typeof elem !== 'undefined') {
                let txt = elem.innerHTML
                txt = txt.split('<i class="d-none"></i>')[0]
                if (parseInt(res.data[key]) > 0) {
                    elem.innerHTML = txt + '<i class="d-none"></i><sup class="rounded-circle p-1 bg-info text-white">' + res.data[key] + '</sup>'
                }
            }
        })
    })
}

function getMenuCount (url) {
    shApis.doGet(url).then(() => {
    })
}

const showModal = modalId => {
    const modal = new Modal(document.getElementById(modalId))
    modal.show()
}

const hideModal = modalId => {
    const cleanedId = modalId.replace('#', '')
    const modalElement = document.getElementById(cleanedId)
    if (modalElement) {
        const button = modalElement.querySelector('.sh-modal-close')
        if (button) {
            button.click()
        } else {
            const modal = new Modal(modalElement)
            modal.hide()
        }
    }
}

const showOffCanvas = offCanvasId => {
    const offCanvas = new Offcanvas(document.getElementById(offCanvasId))
    offCanvas.show()
}

const hideOffCanvas = offCanvasId => {
    const element = document.getElementById(offCanvasId)
    const button = element.querySelector('.sh-offcanvas-close')
    if (button) {
        button.click()
    } else {
        const offCanvas = new Offcanvas(element)
        offCanvas.hide()
    }
}

const flushCache = () => {
    return shIndexedDB.clear()
}

export default {
    ...coreRepo,
    getMenuCount,
    setTabCounts,
    showModal,
    hideModal,
    showOffCanvas,
    hideOffCanvas,
    flushCache
}
