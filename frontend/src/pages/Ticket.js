import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import { getTicket, closeTicket } from '../features/tickets/ticketSlice'
import BackButton from '../components/BackButton'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNote, getNotes, reset as noteReset } from '../features/notes/noteSlice'
import NoteItem from '../components/NoteItem'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'

const customStyles = {
    content: {
      width: '600px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative',
    },
  }
  
Modal.setAppElement('#root')

const Ticket = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { ticketId } = useParams()
    const { isLoading, isError, ticket, message } = useSelector((state) => state.tickets)
    const { isLoading: notesIsLoading, notes } = useSelector((state) => state.notes)

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [noteText, setNoteText] = useState('')

    // close ticket
    const onTicketClose = () => {
        dispatch(closeTicket(ticketId))
        toast.success('Ticket Closed')
        navigate('/tickets')
    }

    // open/close modal
    const openModal = () => {
        setModalIsOpen(true)
    }
    const closeModal = () => {
        setModalIsOpen(false)
    }

    // create note submit
    const onNoteSubmit = (e) => {
        e.preventDefault()
        dispatch(createNote({ noteText, ticketId }))
        closeModal()
    }

    useEffect(() => {
        dispatch(noteReset())
        dispatch(getTicket(ticketId))
        dispatch(getNotes(ticketId))
    }, [dispatch, ticketId])

    if(isError) {
        toast.error(message)
        return (
            <div>
                <BackButton url='/tickets' />
                <h3>Something went wrong!!</h3>
            </div>
        )
    }

    if(isLoading) {
        return <Spinner />
    }  

    return (
    <div className='ticket-page' style={{ paddingBottom: '20px' }}>
        <header className="ticket-header">
            <BackButton url='/tickets' />
            <h2>
                Ticket ID: ${ticket._id}
                <span className={`status status-${ticket.status}`}>{ticket.status}</span>
            </h2>
            <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}</h3>
            <h3>Product: {ticket.product}</h3>
            <hr />
            <div className="ticket-desc">
                <h3>Description of Issue</h3>
                <p>{ticket.description}</p>
            </div>

            <h2>Notes</h2>
        </header>

        {ticket.status !== 'closed' && (
            <button className='btn' onClick={openModal}>
                <FaPlus /> Add Note
            </button>
        )}

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
            <h2>Add Note</h2>
            <button className='btn-close' onClick={closeModal}>
            X
            </button>
            <form onSubmit={onNoteSubmit}>
                <div className='form-group'>
                    <textarea
                    name='noteText'
                    id='noteText'
                    className='form-control'
                    placeholder='Note text'
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                </div>
                <div className='form-group'>
                    <button className='btn' type='submit'>
                    Submit
                    </button>
                </div>
            </form>
        </Modal>

        {notes.map((note) => (
            <NoteItem key={note._id} note={note} />
        ))}

        {ticket.status !== 'closed' && (
            <button className='btn btn-block btn-danger' onClick={onTicketClose}>Close Ticket</button>
        )}
    </div>
  )
}

export default Ticket