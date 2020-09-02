import { Select } from './Select/select'
import './Select/select.scss'
import './index.scss'

const select = new Select('#select', {
  placeHolder: 'Select something',
  selectedId: 4,
  data: [
      {id: 1, value: 'React', status: 'Res'},
      {id: 2, value: 'Angular', status: 'Angular'},
      {id: 3, value: 'Vue', status: 'Vue'},
      {id: 4, value: 'Js', status: 'Js'},
      {id: 5, value: 'Node', status: 'Node'},
      {id: 6, value: 'Nest', status: 'NestJS'},
      {id: 7, value: 'RxJs', status: 'SDfsdf'},
    ],
  fieldValue: 'status',
  onSelect(item) { // некий callback - который вызывается после того как элемент выбран
    console.log('Selected item: ', item)
  },
  multiple: true,
})

window.select = select
