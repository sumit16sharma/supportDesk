import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaSignInAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    }) 

    const { email, password  } = formData;

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }

        if(isSuccess || user) {
            navigate('/')
        }

        dispatch(reset())
    }, [isError, message, isSuccess, user, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = { email, password }
        dispatch(login(userData))
    }

    if(isLoading) {
        return <Spinner />
    }

  return (
    <>
        <section className="heading">
            <h1>
                <FaSignInAlt /> Login    
            </h1>   
            <p>Please Log in to get Support</p>
        </section>

        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input 
                        type="email" 
                        className='form-control' 
                        id='email' 
                        value={email} 
                        name='email' 
                        onChange={onChange} 
                        placeholder='Enter your Email' 
                        required
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        className='form-control' 
                        id='password' 
                        value={password} 
                        name='password' 
                        onChange={onChange} 
                        placeholder='Enter your Password' 
                        required
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-block">Submit</button>
                </div>
            </form>
        </section>
    </>
  )
}

export default Login