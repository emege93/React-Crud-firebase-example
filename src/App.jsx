import React, {useState, useEffect} from 'react'
import {firebase} from './firebase'

function App() {

  const [tareas, setTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')

  useEffect(() => {

    const obtenerDatos = async () => {

      try {

        const db = firebase.firestore()
        const data = await db.collection('tareas').get()
        const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        console.log(arrayData)
        setTareas(arrayData)

      } catch (error) {
        console.log(error);
      }
    }

    obtenerDatos()

  }, [])

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Está vacio');
      return
    }

    try {

      const db = firebase.firestore()
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection('tareas').add(nuevaTarea)

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])

      setTarea('')

    } catch (error) {

      console.log(error);
    }

    console.log(tarea);
  }

  const eliminar = async (id) => {
    try {

      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error);
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Está vacio');
      return
    }

    try {

      const db = firebase.firestore()
      await db.collection('tareas').doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(tarea => (
                <li className="list-group-item" key={tarea.id}>{tarea.name} - {tarea.fecha}
                  <button
                    className="btn btn-danger btn-sm float-right"
                    type="submit"
                    onClick={() => eliminar(tarea.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mr-2"
                    type="submit"
                    onClick={() => activarEdicion(tarea)}
                  >
                    Editar
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar tarea'
            }
          </h3>
          <form onSubmit={ modoEdicion ? editar : agregar}>
            <input
              type="text"
              placeholder="Ingrese Tarea"
              className="form-control mb-2"
              value={tarea}
              onChange={e => setTarea(e.target.value)}
            />
            <button
              className={
                modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
              }
              type="submit"
            >
                {
                  modoEdicion ? 'Guardar' : 'Agregar'
                }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
