const getHtml = (placeholder, data = [], selectedIds, multiple = false) => {
  let text = placeholder || 'Select something from list'

  const listItem = data.map( (elem) => {
    let selCls = ''
    let multi = ''

    selectedIds.forEach((id) => {
      if(elem.id.toString() === id.toString()) {
        selCls = 'selected'
        text = elem.value
      }
    })

    if(multiple) {
      multi = `tabIndex= '0'`
    }
    return `<li class="select__list_item ${selCls}" ${multi} data-type="item" data-id="${elem.id}">${elem.value}</li>`
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
    this.selectedIds = [options.selectedId.toString()]
    this.multiple = options.multiple

    this.#render()
    this.#addSetUp()
  }

  #render() {
    const { placeHolder, data, multiple} = this.options
    this.selectorDom.classList.add('select')
    this.selectorDom.insertAdjacentHTML('afterbegin', getHtml(placeHolder, data, this.selectedIds, multiple))
  }

  #addSetUp() {
    this.selectorDom.addEventListener('click', this.#addHandlerClick)

    if(this.multiple) {
      document.body.addEventListener('keydown', this.#addHandleMultiple)
      document.body.addEventListener('keyup', this.#removeHandleMultiple)
    }

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

 #addHandleMultiple = (event) => {
   if(event.key === 'Shift') {
     this.multiSelect = true
   }
 }

 #removeHandleMultiple = (event) => {
   if(event.key === 'Shift') {
     this.multiSelect = false
   }
 }

  get current() {

    const res = this.options.data.reduce( (acc, elem) => {
      return this.selectedIds.some( id => id.toString() === elem.id.toString())
        ? [...acc, elem]
        : acc
    }, [])

    return res
  }

  select = (id) => {
    if(!this.multiSelect) {
      this.selectedIds.length = 0
    }
    this.selectedIds.push(id)

    const value = this.current.map(e =>  e.value ).join(' ')
    const selectedItem = this.selectorDom.querySelector(`[data-id="${id}"]`)



    if(!this.multiSelect) {
      this.selectorDom.querySelectorAll(`[data-type="item"]`).forEach(elem => elem.classList.remove('selected'))
      this.close()
    }

    this.#setTextContent(value)
    selectedItem.classList.add('selected')

    this.options.onSelect && this.options.onSelect(this.current)
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
    this.multiSelect = false
  }

  destroy() {
    this.#removeSetUp()
    this.selectorDom.remove()
  }
}