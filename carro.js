const templateCard = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()


let carrito = {}

document.addEventListener('DOMContentLoaded', ()=>{
  fetchData()
  if (localStorage.getItem('carrito')){
      carrito = JSON.parse(localStorage.getItem('carrito'))
      pintarCarrito()
  }
})
const fetchData = async ()=>{
  const res = await fetch('api.json')
  const data = await res.json()
  pintarCard(data)
}


cards.addEventListener('click', e =>{
  addCarrito(e)
})
items.addEventListener('click', e =>{
  btnAction(e)
})

const pintarCard = data =>{
    data.forEach(producto => {
    templateCard.querySelector('h5').textContent = producto.title
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
    templateCard.querySelector('button').dataset.id = producto.id


const clone = templateCard.cloneNode(true)
fragment.appendChild(clone)

    });
    cards.appendChild(fragment)
}
//Delegacion de eventos
const addCarrito = e => {
  if(e.target.classList.contains('btn-dark')){
  setCarrito(e.target.parentElement);
  }
  e.stopPropagation()
}

//armado del objeto
const setCarrito = objeto=>{
  const producto = {
    id:objeto.querySelector('button').dataset.id,
    title:objeto.querySelector('h5').textContent,
    precio:objeto.querySelector('p').textContent,
    cantidad:1
    
      }
      console.log(producto);
if (carrito.hasOwnProperty(producto.id)){
  producto.cantidad = carrito[producto.id].cantidad +1
}
carrito[producto.id]={...producto}
pintarCarrito();
cantCart(producto.cantidad);
}

// Pintar carrito en el DOM
const pintarCarrito = ()=>{
  items.innerHTML= ''
Object.values(carrito).forEach(item  =>{
templateCarrito.querySelector('th').textContent=item.id
templateCarrito.querySelectorAll('td')[0].textContent=item.title
templateCarrito.querySelectorAll('td')[1].textContent=item.cantidad
templateCarrito.querySelector('.btn-info').dataset.id=item.id
templateCarrito.querySelector('.btn-danger').dataset.id=item.id
templateCarrito.querySelector('span').textContent=item.cantidad * item.precio


const clone = templateCarrito.cloneNode(true)
fragment.appendChild(clone)
})
items.appendChild(fragment)



localStorage.setItem('carrito', JSON.stringify(carrito))
pintarFooter()

}

//Pintando el footer dentro del modal
const pintarFooter = ()=>{
  footer.innerHTML = ''
  if ( Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
      `
      return
  }
  const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc +cantidad  ,0 )
  const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio ,0)
  
  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio
  
  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.append(fragment)
 const vaciarCarrito = document.getElementById('vaciar-carrito')
 vaciarCarrito.addEventListener('click', ()=>{
  carrito={}
  pintarCarrito()
 })
}

const btnAction = e =>{
  if (e.target.classList.contains('btn-info')){
      carrito[e.target.dataset.id]
  
      const producto = carrito[e.target.dataset.id]
      producto.cantidad ++
      carrito[e.target.dataset.id] = {... producto}
      pintarCarrito()
  }
  if (e.target.classList.contains('btn-danger')){
      const producto = carrito[e.target.dataset.id]
      producto.cantidad --
     
      if(producto.cantidad === 0){
          delete  carrito[e.target.dataset.id]
      }
      pintarCarrito()
  
  }
  e.stopPropagation()
  }
  
  const cantCart = (cantidad) =>{
      
      let item =document.getElementById('cart')
     
      item.innerText= cantidad
     
      
       
  }
  function  vaciarCarrito(){
      location.reload()
      
    }
