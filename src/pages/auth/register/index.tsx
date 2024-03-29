import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useCreateRegisterUserMutation } from '@/app/services/api'
import { setToast } from '@/app/reducers/toast.slice'

import { Button, CardForm, InputForm } from '@/components'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [register] = useCreateRegisterUserMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (name && email && password) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [name, email, password])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register({
      name,
      email,
      password,
    }).then(() => {
      dispatch(
        setToast({
          messageToast: `Register Success`,
          statusToast: 'success',
          showToast: true,
        }),
      )
      navigate('/login')
    })
  }
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden h-screen w-1/2 overflow-clip md:block">
        <img
          src="/img/img-4.webp"
          alt="login-img"
          className="h-screen object-cover"
        />
        <div className="absolute top-0 z-10 h-screen w-full bg-black opacity-10"></div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#eeebe3] bg-[url('/img/img-4.webp')] px-8 md:w-1/2 md:bg-[url('')]">
        <CardForm key={1} title="Register" handleSubmit={handleSubmit}>
          <>
            <InputForm
              label="Name"
              placeholder="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <InputForm
              label="Email"
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputForm
              label="Password"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-sm">
              Already have an account?
              <Link to="/login" className="font-semibold text-blue-500">
                login
              </Link>
            </div>

            <div className="flex flex-col gap-2 pt-10">
              <Button
                label="Register"
                sources="primary"
                type="submit"
                disabled={disabled}
              />
            </div>
          </>
        </CardForm>
      </div>
    </div>
  )
}

export default RegisterPage
