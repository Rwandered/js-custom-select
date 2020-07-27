const getHtml = (placeholder, data = [], selectedId) => {
  let text = placeholder || 'Select something from list'

  const listItem = data.map( (elem) => {
    let selCls = ''
    if(elem.id.toString() === selectedId.toString()) {
      selCls = 'selected'
      text = elem.value
    }
    return `<li class="select__list_item ${selCls}" data-type="item" data-id="${elem.id}">${elem.value}</li>`
  }).join('')

  return `
    <div class="select__backdrop" data-type="back"></div>
    <div class="select__input" data-type="input">
      <span data-type="text">${text}</span>
      <i class="fa fa-chevron-down" data-type="arrow"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${ listItem }
      </ul>
    </div>
`
}


export class Select {
  constructor(selector, options) {
    this.selectorDom = document.querySelector(selector)
    this.options = options
    this.selectedId = options.selectedId

    this.#render()
    this.#addSetUp()
  }

  #render() {
    const { placeHolder, data } = this.options
    this.selectorDom.classList.add('select')
    this.selectorDom.insertAdjacentHTML('afterbegin', getHtml(placeHolder, data, this.selectedId))
  }

  #addSetUp() {
    this.selectorDom.addEventListener('click', this.#addHandlerClick)
    this.arrowIcon = this.selectorDom.querySelector('[data-type="arrow"]')
    this.value = this.selectorDom.querySelector('[data-type="text"]')
    this.input = this.selectorDom.querySelector('[data-type="input"]')
  }

  #addHandlerClick = (event) => {
    const { type } = event.target.dataset
    switch (type) {
      case 'input':
        this.#toggle()
        break
      case 'item':
        const id = event.target.dataset.id
        this.select(id)
        break
      case 'back':
        this.close()
        break
      case 'arrow':
        this.#toggle()
        break
      case  'text':
        this.#toggle()
        break
    }
 }

  get current() {
    return this.options.data.find( elem => elem.id.toString() === this.selectedId.toString())
  }

  select = (id) => {
    this.selectedId = id
    const value = this.current.value
    const selectedItem = this.selectorDom.querySelector(`[data-id="${id}"]`)
    this.#setTextContent(value)
    this.selectorDom.querySelectorAll(`[data-type="item"]`).forEach(elem => elem.classList.remove('selected'))
    selectedItem.classList.add('selected')

    this.options.onSelect && this.options.onSelect(this.current)

    this.close()
  }

  #setTextContent = (text) => this.value.textContent = text

  #toggle = () => {
    this.selectorDom.classList.contains('open')
      ? this.close()
      : this.open()
  }

  #removeSetUp() {
    this.selectorDom.removeEventListener('click', this.#addHandlerClick)
  }

  open() {
    this.selectorDom.classList.add('open')
    this.arrowIcon.classList.remove('fa-chevron-down')
    this.arrowIcon.classList.add('fa-chevron-up')
  }

  close() {
    this.selectorDom.classList.remove('open')
    this.arrowIcon.classList.add('fa-chevron-down')
    this.arrowIcon.classList.remove('fa-chevron-up')
  }

  destroy() {
    this.#removeSetUp()
    this.selectorDom.remove()
  }
}