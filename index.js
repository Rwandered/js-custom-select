import { Select } from './Select/select'
import './Select/select.scss'
import './index.scss'

const select = new Select('#select', {
  placeHolder: 'Select something',
  selectedId: 4,
  data: [
      {id: 1, value: 'React'},
      {id: 2, value: 'Angular'},
      {id: 3, value: 'Vue'},
      {id: 4, value: 'Js'},
      {id: 5, value: 'Node'},
      {id: 6, value: 'Nest'},
      {id: 7, value: 'RxJs'},
    ],
  onSelect(item) { // некий callback - который вызывается после того как элемент выбран
    console.log('Selected item: ', item)
  },
  multiple: true,
})

window.select = select
