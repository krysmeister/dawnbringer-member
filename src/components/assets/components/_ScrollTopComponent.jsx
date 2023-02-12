import {
  getScrollTop,
  getAttributeValueByBreakpoint,
  throttle,
  getObjectPropertyValueByKey,
  stringSnakeToCamel,
  getUniqueIdWithPrefix,
  DataUtil,
  ElementAnimateUtil,
} from '../_utils/index'

const defaultScrollTopOptions = {
  offset: 200,
  speed: 600,
}

class ScrollTopComponent {
  constructor(_element, options) {
    this.element = _element
    this.options = Object.assign(defaultScrollTopOptions, options)
    this.instanceUid = getUniqueIdWithPrefix('scrolltop')

    // Event Handlers
    this._handlers()

    // Bind Instance
    DataUtil.set(this.element, 'scrolltop', this)
  }

  _handlers = () => {
    let timer
    window.addEventListener('scroll', () => {
      throttle(timer, () => {
        this._scroll()
      })
    })

    this.element.addEventListener('click', (e) => {
      e.preventDefault()
      this._go()
    })
  }

  _scroll = () => {
    const offset = parseInt(this._getOption('offset'))
    const pos = getScrollTop() // current vertical position
    if (pos > offset) {
      if (!document.body.hasAttribute('data-scrolltop')) {
        document.body.setAttribute('data-scrolltop', 'on')
      }
    } else {
      if (document.body.hasAttribute('data-scrolltop')) {
        document.body.removeAttribute('data-scrolltop')
      }
    }
  }

  _go = () => {
    const speed = parseInt(this._getOption('speed'))
    ElementAnimateUtil.scrollTop(0, speed)
  }

  _getOption = (name) => {
    const attr = this.element.getAttribute(`data-scrolltop-${name}`)
    if (attr) {
      const value = getAttributeValueByBreakpoint(attr)
      return value !== null && String(value) === 'true'
    }

    const optionName = stringSnakeToCamel(name)
    const option = getObjectPropertyValueByKey(this.options, optionName)
    if (option) {
      return getAttributeValueByBreakpoint(option)
    }

    return null
  }

  ///////////////////////
  // ** Public API  ** //
  ///////////////////////

  // Plugin API
  go = () => {
    return this._go()
  }

  getElement = () => {
    return this.element
  }

  // Static methods
  static getInstance = (el) => {
    const scrollTop = DataUtil.get(el, 'scrolltop')
    if (scrollTop) {
      return scrollTop
    }
  }

  static createInstances = (selector) => {
    const elements = document.body.querySelectorAll(selector)
    elements.forEach((el) => {
      const item = el
      let scrollTop = ScrollTopComponent.getInstance(item)
      if (!scrollTop) {
        scrollTop = new ScrollTopComponent(item, defaultScrollTopOptions)
      }
    })
  }

  static createInsance = (selector, options = defaultScrollTopOptions) => {
    const element = document.body.querySelector(selector)
    if (!element) {
      return
    }
    const item = element
    let scrollTop = ScrollTopComponent.getInstance(item)
    if (!scrollTop) {
      scrollTop = new ScrollTopComponent(item, options)
    }
    return scrollTop
  }

  static bootstrap = () => {
    ScrollTopComponent.createInstances('[data-scrolltop="true"]')
  }

  static reinitialization = () => {
    ScrollTopComponent.createInstances('[data-scrolltop="true"]')
  }

  static goTop = () => {
    ElementAnimateUtil.scrollTop(0, defaultScrollTopOptions.speed)
  }
}
export {ScrollTopComponent, defaultScrollTopOptions}
